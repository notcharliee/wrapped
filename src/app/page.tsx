import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { spotifyApi } from "~/spotify"
import Link from "next/link"

export default async ({ searchParams }: { searchParams: { time_range: "short_term" | "medium_term" | "long_term" } }) => {
  if (!searchParams.time_range) redirect("/?time_range=short_term")

  const token = cookies().get("session")?.value
  if (!token) redirect("/api/auth")

  spotifyApi.setAccessToken(token)

  const topArtists = await spotifyApi.getMyTopArtists({ time_range: searchParams.time_range })
  const topSongs = await spotifyApi.getMyTopTracks({ time_range: searchParams.time_range })

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-[#f8f8f8] bg-black">

      <div className="my-[5vh] lg:my-[10vh] flex flex-col items-center justify-center space-y-8 sm:space-y-10">
        <h1 className="font-bold tracking-tighter text-4xl sm:text-7xl space-x-6">
          <span>Spotify</span>
          <span className="bg-gradient-to-r from-indigo-400 to-red-600 px-3 py-1 sm:px-4 sm:py-2 rounded-md">Wrapped</span>
        </h1>
        <div className="text-neutral-400 text-lg">
          <Link href={"?time_range=short_term"} className={"hover:underline " + (searchParams.time_range == "short_term" ? "text-neutral-300 underline" : "")}>4 weeks</Link>{" • "}
          <Link href={"?time_range=medium_term"} className={"hover:underline " + (searchParams.time_range == "medium_term" ? "text-neutral-300 underline" : "")}>6 months</Link>{" • "}
          <Link href={"?time_range=long_term"} className={"hover:underline " + (searchParams.time_range == "long_term" ? "text-neutral-300 underline" : "")}>All time</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

        <div className="my-[5vh] lg:my-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl sm:text-5xl">Top Songs</h2>
          <div className="my-4 p-8 flex flex-col gap-8 min-w-[350px] max-w-[414px]">{
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

        <div className="my-[5vh] lg:my-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl sm:text-5xl">Top Artists</h2>
          <div className="my-4 p-8 flex flex-col gap-8 min-w-[350px] max-w-[414px]">{
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

        {/* <div className="my-[5vh] lg:my-[10vh] flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <h2 className="font-bold tracking-tighter text-3xl sm:text-5xl">Top Genres</h2>
          <div className="my-4 p-8 flex flex-col gap-8 min-w-[350px] max-w-[414px]">{
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
        </div> */}

      </div>

    </main>
  )
}
