import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { spotifyApi } from "~/spotify"

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get("code")
  if (!code) redirect("/api/auth")

  const authResponse = await spotifyApi.authorizationCodeGrant(code)
  if (authResponse.statusCode !== 200) NextResponse.json(authResponse.statusCode, { status: authResponse.statusCode })

  const {
    access_token,
    expires_in,
  } = authResponse.body

  cookies().set("session", access_token, {
    httpOnly: true,
    maxAge: expires_in,
    sameSite: true,
    secure: true,
  })

  redirect("/")
}