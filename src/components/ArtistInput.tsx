"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

type ArtistInputProps = {
  initialArtist?: string;
};

export function ArtistInput({ initialArtist }: ArtistInputProps) {
  const router = useRouter();
  const session = useSession();

  const [artist, setArtist] = useState(initialArtist ?? "");
  const [isLoading, setIsLoading] = useState(false);

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated") {
    router.push("/login");
    return;
  }

  return (
    <div className="w-full h-screen flex items-center flex-col p-5 md:pt-40">
      <div className="text-8xl">🎸👨‍🎤🥁</div>
      <h1 className="text-5xl font-extrabold pt-5 md:text-center">
        Enter an artist and click Generate Playlist
      </h1>

      <input
        type="text"
        className="border mt-10 border-gray-300  rounded-full text-4xl px-6 py-2 font-bold"
        onChange={(e) => setArtist(e.target.value)}
        value={artist}
      />

      <button
        onClick={() => {
          setIsLoading(true);
          router.push(`/playlist?artist=${artist}`);
        }}
        disabled={!artist}
        className="mt-8 w-3/4 max-w-[400px] bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        Generate Playlist {isLoading && "🔄"}
      </button>
    </div>
  );
}
