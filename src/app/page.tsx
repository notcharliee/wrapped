import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { spotifyApi } from "~/spotify"
import Link from "next/link"

export default async function HomePage ({
  searchParams,
}: {
  searchParams: {
    time_range: "short_term" | "medium_term" | "long_term",
  },
}) {
  if (!searchParams.time_range) redirect("/?time_range=short_term")

  const token = cookies().get("session")?.value
  if (!token) redirect("/api/auth")

  spotifyApi.setAccessToken(token)

  const topArtists = await spotifyApi.getMyTopArtists({ time_range: searchParams.time_range })
  const topSongs = await spotifyApi.getMyTopTracks({ time_range: searchParams.time_range })

  const genreCount: { [genre: string]: { count: number, index: number } } = {}

  topArtists.body.items.forEach((artist, index) => {
    artist.genres.forEach((genre) => {
      if (!genreCount[genre]) genreCount[genre] = { count: 0, index: index }
      genreCount[genre]!.count++
    })
  })

  const topGenres = Object.keys(genreCount).sort((a, b) => {
    const countDiff = genreCount[b]!.count - genreCount[a]!.count
    return countDiff !== 0 ? countDiff : genreCount[a]!.index - genreCount[b]!.index
  }).slice(0, 20)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-[#f8f8f8] bg-black">
      <div className="mt-[10vh] flex flex-col items-center justify-center space-y-8 lg:space-y-10">
        <h1 className="font-bold tracking-tighter text-4xl lg:text-7xl space-x-4 lg:space-x-6">
          <span>Spotify</span>
          <span className="bg-gradient-to-r from-indigo-400 to-red-600 px-3 py-1 lg:px-4 lg:py-2 rounded-md">Wrapped</span>
        </h1>
        <div className="text-neutral-400 text-lg">
          <Link href={"?time_range=short_term"} className={"hover:underline " + (searchParams.time_range == "short_term" ? "text-neutral-300 underline" : "")}>4 weeks</Link>{" • "}
          <Link href={"?time_range=medium_term"} className={"hover:underline " + (searchParams.time_range == "medium_term" ? "text-neutral-300 underline" : "")}>6 months</Link>{" • "}
          <Link href={"?time_range=long_term"} className={"hover:underline " + (searchParams.time_range == "long_term" ? "text-neutral-300 underline" : "")}>All time</Link>
        </div>
      </div>
      <div className="lg:mt-[5vh] mb-[10vh] grid grid-cols-1 lg:grid-cols-3">
        <div className="mt-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl lg:text-5xl">Top Songs</h2>
          <div className="my-4 p-8 flex flex-col gap-8 w-[350px]">{
            topSongs.body.items.map(song => (
              <div className="flex gap-4" key={song.id}>
                <img src={song.album.images[0]?.url} alt={song.name} className="w-10 h-10 rounded" />
                <div className="flex flex-col justify-around">
                  <strong className="leading-none line-clamp-1">{song.name}</strong>
                  <p className="text-neutral-400 leading-none line-clamp-1">{song.artists.map(artist => artist.name).join(", ")}</p>
                </div>
              </div>
            ))
          }</div>
        </div>
        <div className="mt-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl lg:text-5xl">Top Artists</h2>
          <div className="my-4 p-8 flex flex-col gap-8 w-[350px]">{
            topArtists.body.items.map(artist => (
              <div className="flex gap-4" key={artist.id}>
                <img src={artist.images[0]?.url} alt={artist.name} className="w-10 h-10 rounded" />
                <div className="flex flex-col justify-around">
                  <strong className="leading-none line-clamp-1">{artist.name}</strong>
                  <p className="text-neutral-400 leading-none line-clamp-1">{artist.genres[0] ?? "unknown genre"}</p>
                </div>
              </div>
            ))
          }</div>
        </div>
        <div className="mt-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl lg:text-5xl">Top Genres</h2>
          <div className="my-4 p-8 flex flex-col gap-8 w-[350px]">{
            topGenres.map((genre, index) => (
              <div className="flex gap-4" key={index}>
                <div className="min-w-10 h-10 rounded grid place-items-center bg-[#f8f8f8] text-black font-semibold">#{index+1}</div>
                <div className="flex flex-col justify-around w-full">
                  <strong className="leading-none line-clamp-1">{genre}</strong>
                  <div className="bg-gradient-to-r from-indigo-400 to-red-600 rounded h-4" style={{ width: `${(genreCount[genre]!.count / genreCount[topGenres[0]!]!.count) * 100}%` }} />
                </div>
              </div>
            ))
          }</div>
        </div>
      </div>
    </main>
  )
}
