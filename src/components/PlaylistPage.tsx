"use client";

import { PlaylistInfo } from "@/components/PlaylistInfo";
import { Track } from "@/components/Track";
import { useState } from "react";
import { Loader } from "./Loader";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types";
import { createPlaylist } from "@/actions/createPlaylist";

type PlaylistPageProps = {
  playlist: Playlist;
};

export function PlaylistPage({ playlist }: PlaylistPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    const playlistCreated = await createPlaylist(playlist);

    if (playlistCreated) {
      router.push("/success");
    }
  };

  return (
    <main className="relative">
      <div className="m-4">
        <h1 className="text-5xl font-extrabold">Here&apos;s your playlist</h1>
        <PlaylistInfo />
        <div className="flex items-center flex-col h-[50rem]">
          <div className="overflow-auto w-full mt-3">
            {playlist.filter(Boolean).map((song) => (
              <div key={song.uri} className="mt-5 ">
                <Track {...song} />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleCreatePlaylist}
          className="mt-4 w-full bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101"
        >
          Create Playlist
        </button>
        <button className="mt-4 w-full bg-yellow-600 text-white text-xl font-bold p-3 rounded-full hover:scale-101">
          Add Songs
        </button>
      </div>

      {isLoading && (
        <>
          <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-white/85"></div>

          <div className="p-5 rounded-md  absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4">
            <Loader text="Adding this playlist to your Spotify account" />
          </div>
        </>
      )}
    </main>
  );
}
