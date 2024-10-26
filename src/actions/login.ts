"use server";

import { redirect } from "next/navigation";

function generateRandomString(length: number) {
  if (length <= 0) {
    throw new Error("Length must be a positive integer");
  }

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export async function login() {
  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope:
      "user-read-private user-read-email playlist-modify-private playlist-modify-public",
    redirect_uri: "http://localhost:3000/login/callback",
    state: generateRandomString(16),
  };

  // @ts-ignore - URLSearchParams accepts an object despite what the TS types say
  const queryParams = new URLSearchParams(params).toString();
  const redirectUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
  redirect(redirectUrl);
}

export async function requestAccessToken(code: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const headers = new Headers({
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
  });

  const urlEncodedRedirectUri = encodeURIComponent(
    "http://localhost:3000/login/callback"
  );

  const body = `grant_type=authorization_code&redirect_uri=${urlEncodedRedirectUri}&code=${code}`;

  const requestOptions = {
    method: "POST",
    headers,
    body,
  };

  const res = await fetch(
    "https://accounts.spotify.com/api/token",
    requestOptions
  );

  const data = await res.json();

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}
