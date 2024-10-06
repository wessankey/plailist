"use server";

import { redirect } from "next/navigation";

export async function login() {
  const params = {
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: "user-read-private user-read-email",
    redirect_uri: "http://localhost:3000/login/callback",
    // TODO: generate random 16 character string
    state: "d9f09xjdjk3d0kvn",
  };

  // @ts-ignore - URLSearchParams accepts an object despite what the TS types say
  const queryParams = new URLSearchParams(params).toString();
  const redirectUrl = `https://accounts.spotify.com/authorize?${queryParams}`;
  redirect(redirectUrl);
}

export async function requestAccessToken(code: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append(
    "Authorization",
    "Basic " + new Buffer.from(clientId + ":" + clientSecret).toString("base64")
  );

  const urlEncodedRedirectUri = encodeURIComponent(
    "http://localhost:3000/login/success"
  );

  const body = `grant_type=authorization_code&redirect_uri=${urlEncodedRedirectUri}&code=${code}`;

  const requestOptions = {
    method: "POST",
    headers,
    body,
    redirect: "follow",
  };

  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
