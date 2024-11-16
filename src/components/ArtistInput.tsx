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
        className="relative mt-8 w-3/4 max-w-[400px] bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Generate Playlist"}
        {isLoading && (
          <span className="absolute right-20 top-1/2 -translate-y-1/2">
            <svg
              className="w-8 h-8 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
