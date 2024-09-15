"use client";

import { Trash2, X } from "lucide-react";
import { useState } from "react";

export function PlaylistInfo() {
  const [isDisplayed, setIsDisplayed] = useState(true);

  const handleDismiss = () => {
    setIsDisplayed(false);
  };

  if (!isDisplayed) return null;

  return (
    <div className="rounded-md bg-blue-100 p-4 mt-4 relative">
      <p>
        Remove any songs you don&apos;t like by clicking the{" "}
        <span>
          <Trash2 className="text-gray-800 inline-block w-5" />
        </span>
        .
      </p>
      <p className="mt-3">
        If everything looks good, click{" "}
        <span className="font-bold">Create Playlist</span>.
      </p>
      <p className="mt-3">
        Add more songs by clicking <span className="font-bold">Add Songs</span>
      </p>

      <X
        onClick={handleDismiss}
        className="text-gray-800 inline-block w-5 absolute top-2 right-3 hover:scale-105 cursor-pointer"
      />
    </div>
  );
}
