import { buildPlaylist } from "@/actions/createPlaylist";
import { PlaylistPage } from "@/components/PlaylistPage";

export async function PlaylistController({ artist }: { artist: string }) {
  const playlist = await buildPlaylist(artist);

  return <PlaylistPage artist={artist} generatedPlaylist={playlist} />;
}
