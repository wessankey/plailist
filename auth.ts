import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

const scope =
  "user-read-private user-read-email playlist-modify-private playlist-modify-public";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${scope}`,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account) {
        const userResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${account.access_token}`,
          },
        });
        const user = await userResponse.json();

        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user_id: user.id,
        };
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
  },
});
