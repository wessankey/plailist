"use server";

import {
  createPlaylist as createPlaylistSpotify,
  lookupSong,
} from "@/server/api/spotify";
import { TPlaylist, TTrack } from "@/types";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const GENERATE_SYSTEM_PROMPT = `You have incredible taste in music and a deep, wide knowledge of all genres of music. The user will provide you with an artist, and you are tasked with generating a playlist that meets the following criteria:
  - The playlist must include {SONG_COUNT} songs
  - None of the songs should be written or performedby the provided artist
  - The songs must be songs that actually exist
  - The playlist should not include more than one song from the same artist 
  - The response should be a JSON array containing an object for each song with the following properties: title and artist.`;

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
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const { object } = await generateObject({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages: [
      {
        role: "system",
        content: GENERATE_SYSTEM_PROMPT.replace("{SONG_COUNT}", "10"),
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
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt =
    ADD_SYSTEM_PROMPT.replace("{SONG_COUNT}", songCount.toString()) +
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
  const spotifyRequests = songs.map((song) =>
    lookupSong({ artist: song.artist, title: song.title })
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

  return await getSongDetails(songs);
}

export async function buildPlaylist(artist: string) {
  const songs = await generatePlaylist(artist);
  return await getSongDetails(songs);
}

export async function checkArtistExists(artist: string) {
  const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

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

  console.log("log:checkArtistExists", object);

  return object;
}

export async function createPlaylist(
  playlist: TPlaylist
): Promise<string | undefined> {
  return await createPlaylistSpotify(playlist);
}
