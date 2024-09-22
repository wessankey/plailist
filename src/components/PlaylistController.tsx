import { generatePlaylist } from "@/actions/createPlaylist";
import { PlaylistPage } from "@/components/PlaylistPage";
import { lookupSong } from "@/server/api/spotify";
import { Track } from "@/types";
import playlist from "../mock/playlist-details.json";

export async function PlaylistController({ artist }: { artist: string }) {
  // const res = await generatePlaylist(artist);

  // const spotifyRequests = res.map((song) =>
  //   lookupSong({ artist: song.artist, title: song.title })
  // );

  // const playlist = await Promise.allSettled(spotifyRequests).then((results) => {
  //   return results.reduce((acc, cur) => {
  //     if (cur.status === "fulfilled" && cur.value !== null) {
  //       return [...acc, cur.value];
  //     }
  //     return acc;
  //   }, [] as Track[]);
  // });

  return <PlaylistPage generatedPlaylist={playlist} />;
}
