import SpotifyWebApi from "spotify-web-api-node"
import { env } from "~/env"

export const spotifyApi = new SpotifyWebApi({
  clientId: env.CLIENT_ID,
  clientSecret: env.CLIENT_SECRET,
  redirectUri: env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback",
})
