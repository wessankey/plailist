"use server";

import { createPlaylist as createPlaylistSpotify } from "@/server/api/spotify";
import { Playlist } from "@/types";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const SYSTEM_PROMPT =
  "You have incredible taste in music and a deep, wide knowledge of all genres of music. The user will provide you with an artist, and you are tasked with generating a playlist of 10 songs that are similar to the artist but to not include any of the artist's own songs. Ensure that the artist actually wrote the song. The playlist should not include more than one song from the same artist. The response should be a JSON array containing an object for each song with the following properties: title and artist.";

const playlistResponseSchema = z.object({
  playlist: z.array(
    z.object({
      title: z.string().describe("The title of the song"),
      artist: z.string().describe("The artist of the song"),
    })
  ),
});

export async function generatePlaylist(artist: string) {
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: artist,
      },
    ],
    schema: playlistResponseSchema,
  });

  return object.playlist;
}

export async function createPlaylist(
  playlist: Playlist
): Promise<string | undefined> {
  return await createPlaylistSpotify(playlist);
}
