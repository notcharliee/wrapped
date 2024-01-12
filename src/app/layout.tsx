import "~/styles/globals.css"
import { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Spotify Wrapped",
  description: "A Spotify Wrapped clone that tracks your top songs, artists, and genres.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: { name: "@notcharliee", url: "https://github.com/notcharliee" }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>{children}</body>
    </html>
  )
}
