"use client";

import { ArtistInput } from "@/components/ArtistInput";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <SessionProvider>
      <ArtistInput />
    </SessionProvider>
  );
}
