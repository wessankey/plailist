import { lookupSong } from "@/server/api/spotify";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject, generateText, tool } from "ai";
import llmPlaylist from "../mock/llm-playlist.json";
import playlist from "../mock/playlist-details.json";
import { z } from "zod";
import { Track } from "@/components/Track";

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

async function generatePlaylist() {
  const anthropic = createAnthropic({
    apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
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
        content: "Bring Me The Horizon",
      },
    ],
    schema: playlistResponseSchema,
  });

  return object.playlist;
}

export default async function Home() {
  // const playlist = await generatePlaylist();

  // const spotifyRequests = llmPlaylist.map((song) =>
  //   lookupSong({ artist: song.artist, title: song.title })
  // );

  // const data = await Promise.allSettled(spotifyRequests).then((results) => {
  //   return results.map((result) => result.value);
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {playlist.map((song) => (
        <Track key={song.uri} />
      ))}
    </main>
  );
}
