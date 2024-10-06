import { PlaylistController } from "@/components/PlaylistController";
import { Suspense } from "react";
import { Loading } from "./_components/Loading";

export default async function Playlist({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const artist = searchParams.artist as string;

  return (
    <Suspense fallback={<Loading />}>
      <PlaylistController artist={artist} />
    </Suspense>
  );
}
