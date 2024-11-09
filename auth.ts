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
      let accessToken = account?.access_token ?? token.access_token;
      let refreshToken =
        account?.refresh_token ?? (token.refresh_token as string);
      let expiresAt = account?.expires_at ?? (token.expires_at as number);

      // if (Date.now() < expiresAt * 1000) {
      //   const response = await getRefreshToken(
      //     refreshToken,
      //     process.env.SPOTIFY_CLIENT_ID || ""
      //   );

      //   console.log("log:response:", response);

      //   accessToken = response.access_token;
      //   refreshToken = response.refresh_token;
      //   expiresAt = response.expires_at;
      // }

      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user = await userResponse.json();

      return {
        ...token,
        access_token: accessToken,
        expires_at: expiresAt,
        refresh_token: refreshToken,
        user_id: user.id,
      };
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

const getRefreshToken = async (refreshToken: string, clientId: string) => {
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };
  const body = await fetch(url, payload);
  const response = await body.json();

  return {
    access_token: response.access_token,
    refresh_token: response.refresh_token,
    expires_at: response.expires_in + Date.now(),
  };
};
