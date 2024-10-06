"use client";

import { Loader } from "@/components/Loader";

export function Loading() {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-white/90"></div>

      <div className="w-full flex justify-center mt-40 absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4">
        <Loader text="Using AI magic to build your perfect playlist" />
      </div>
    </div>
  );
}
