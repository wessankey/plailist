import { generatePlaylist } from "@/actions/createPlaylist";
import { PlaylistPage } from "@/components/PlaylistPage";
import { lookupSong } from "@/server/api/spotify";

export default async function Playlist({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const artist = searchParams.artist as string;
  const res = await generatePlaylist(artist);

  const spotifyRequests = res.map((song) =>
    lookupSong({ artist: song.artist, title: song.title })
  );

  const playlist = await Promise.allSettled(spotifyRequests).then((results) => {
    return results.map((result) => result.value);
  });

  return <PlaylistPage playlist={playlist} />;
}
