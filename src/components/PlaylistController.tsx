import { buildPlaylist, checkArtistExists } from "@/actions/createPlaylist";
import { PlaylistPage } from "@/app/playlist/_components/PlaylistPage";
import { redirect } from "next/navigation";

export async function PlaylistController({ artist }: { artist: string }) {
  const artistExistsResponse = await checkArtistExists(artist);

  if (!artistExistsResponse.exists) {
    const didYouMean = artistExistsResponse.didYouMean.join("|");
    const urlEncodedDidYouMean = encodeURIComponent(didYouMean);
    redirect("/artist-not-found?didYouMean=" + urlEncodedDidYouMean);
  }

  const playlist = await buildPlaylist(artist);
  return <PlaylistPage artist={artist} generatedPlaylist={playlist} />;
}
