"use server";

import {
  createPlaylist as createPlaylistSpotify,
  getAccessToken,
  lookupSong,
} from "@/server/api/spotify";
import { TPlaylist, TTrack } from "@/types";
import { createAnthropic } from "@ai-sdk/anthropic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { generateObject } from "ai";
import { z } from "zod";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GENERATE_SYSTEM_PROMPT = `You have incredible taste in music and a deep, wide knowledge of all genres of music. The user will provide you with an artist, and you are tasked with generating a playlist that meets the following criteria:
  - The playlist should be a mix of songs that are similar in style to the provided artist
  - The playlist must include {SONG_COUNT} songs
  - None of the songs should be written or performed by the provided artist
  - Each recommended song needs to include the song title and the artist. Ensure that the song is actually a song by the artist.
  - The songs must be songs that actually exist
  - The playlist should not include more than one song from the same artist
  - The response should be a JSON array containing an object for each song with the following properties: title and artist
  `;

const CHECK_ARTIST_EXISTS_SYSTEM_PROMPT = `You are a music expert with knowledge of all existing artists and musicians. The user will provide you with an artist, and you are tasked with determining if the artist exists. The name does not need to be an exact match. For example: the user input "black keys" refers to "The Black Keys". The response should be a JSON object with the following properties:
- exists: a boolean indicating whether the artist exists
- didYouMean: an array of strings containing the names of existing artists that are similar to the provided artist. This should be empty if the artist exists.`;

const ADD_SYSTEM_PROMPT =
  GENERATE_SYSTEM_PROMPT +
  `
  - A JSON array containing a song title and artist is provided at the bottom of this prompt. Do not include any of these songs.`;

const playlistSchema = z.object({
  playlist: z.array(
    z.object({
      title: z.string().describe("The title of the song"),
      artist: z.string().describe("The artist of the song"),
    })
  ),
});

const artistExistsSchema = z.object({
  exists: z.boolean().describe("Whether the artist exists"),
  didYouMean: z.array(z.string()).describe("Artists with similar names"),
});

type TPlaylistSchema = z.infer<typeof playlistSchema>;

async function generatePlaylist(artist: string) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: [
      {
        role: "system",
        content: GENERATE_SYSTEM_PROMPT.replace("{SONG_COUNT}", "20"),
      },
      {
        role: "user",
        content: artist,
      },
    ],
    schema: playlistSchema,
  });

  return object.playlist;
}

async function generateAdditionalSongList(
  artist: string,
  songCount: number,
  currentPlaylist: TPlaylistSchema["playlist"]
) {
  const prompt =
    ADD_SYSTEM_PROMPT.replace("{SONG_COUNT}", (songCount * 3).toString()) +
    "\n" +
    JSON.stringify(currentPlaylist);

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: artist,
      },
    ],
    schema: playlistSchema,
  });

  return object.playlist;
}

async function getSongDetails(songs: TPlaylistSchema["playlist"]) {
  const accessToken = await getAccessToken();

  const spotifyRequests = songs.map((song) =>
    lookupSong({ artist: song.artist, title: song.title, accessToken })
  );

  const playlist = await Promise.allSettled(spotifyRequests).then((results) => {
    return results.reduce((acc, cur) => {
      if (cur.status === "fulfilled" && cur.value !== null) {
        return [...acc, cur.value];
      }
      return acc;
    }, [] as TTrack[]);
  });

  return playlist;
}

export async function addSongs(
  artist: string,
  songCount: number,
  currentPlaylist: TPlaylistSchema["playlist"]
) {
  const songs = await generateAdditionalSongList(
    artist,
    songCount,
    currentPlaylist
  );

  const songDetails = await getSongDetails(songs);
  return songDetails.slice(0, songCount);
}

export async function buildPlaylist(artist: string) {
  const songs = await generatePlaylist(artist);
  const songDetails = await getSongDetails(songs);
  return songDetails.slice(0, 10);
}

export async function checkArtistExists(artist: string) {
  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: [
      {
        role: "system",
        content: CHECK_ARTIST_EXISTS_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: artist,
      },
    ],
    schema: artistExistsSchema,
  });

  return object;
}

export async function createPlaylist(
  playlist: TPlaylist
): Promise<string | undefined> {
  const user = await currentUser();
  const userId = user?.externalAccounts[0].externalId;
  if (!userId) throw new Error("User not found");

  return await createPlaylistSpotify(playlist, userId);
}
