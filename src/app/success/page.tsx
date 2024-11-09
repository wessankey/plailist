"use client";

import { Music4, Play, Plus } from "lucide-react";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const playlistUrl = searchParams.playlistUrl as string;

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="text-6xl font-bold mt-10 mb-5">Success!</h1>
      <div className="text-8xl">🤘</div>

      <p className="mt-3 text-lg font-semibold">
        Click the button below to listen to your new playlist!
      </p>

      <a
        href={playlistUrl}
        className="mt-6 w-72 bg-yellow-600 text-white text-xl font-bold p-3 rounded-full hover:scale-101 flex justify-center items-center gap-3"
      >
        <span>Listen Now</span>
        <Play />
      </a>

      <a
        href="/"
        className="mt-4 w-80 bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101 flex justify-center items-center gap-3"
      >
        <span>Create Another Playlist</span>
        <Plus />
      </a>
    </div>
  );
}
