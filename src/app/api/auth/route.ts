import { redirect } from "next/navigation"
import { NextRequest } from "next/server"
import { spotifyApi } from "~/spotify"

export const GET = (request: NextRequest) => {
  redirect(spotifyApi.createAuthorizeURL(["user-top-read"], ""))
}