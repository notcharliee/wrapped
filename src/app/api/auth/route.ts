import { redirect } from "next/navigation"
import { spotifyApi } from "~/spotify"

export const GET = () => {
  redirect(spotifyApi.createAuthorizeURL(["user-top-read"], ""))
}