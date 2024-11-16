"use client";

import { addSongs, createPlaylist } from "@/actions/createPlaylist";
import { PlaylistInfo } from "@/components/PlaylistInfo";
import { Track } from "@/components/Track";
import { TPlaylist, TTrack } from "@/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "../../../components/Loader";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PlaylistPageProps = {
  artist: string;
  generatedPlaylist: TPlaylist;
};

export function PlaylistPage({ artist, generatedPlaylist }: PlaylistPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState(generatedPlaylist);
  let [isOpen, setIsOpen] = useState(false);

  const handleRemoveTrack = (uri: string) => {
    setPlaylist((playlist) => playlist.filter((track) => track.uri !== uri));
  };

  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    const playlistUrl = await createPlaylist(playlist);

    if (playlistUrl) {
      router.push("/success?playlistUrl=" + encodeURI(playlistUrl));
    }
  };

  const addSongsToPlaylist = (additionalSongs: TTrack[]) => {
    setPlaylist((playlist) => [...playlist, ...additionalSongs]);
  };

  const uris = new Set(playlist.map((track) => track.uri));
  console.log("log:uris:", uris.size);

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-5xl font-extrabold">Here&apos;s your playlist</h1>
        <PlaylistInfo />

        <Link
          href="/"
          className="w-fit text-lg flex items-center gap-1 font-semibold mt-3 hover:text-yellow-600"
        >
          <ArrowLeft /> <span> Back to Search</span>
        </Link>

        <div className=" w-full mt-3 mb-3">
          {playlist.filter(Boolean).map((song) => (
            <div key={song.uri} className="mt-5 ">
              <Track {...song} removeTrack={handleRemoveTrack} />
            </div>
          ))}
        </div>
      </main>

      <div className="flex flex-col gap-4 justify-center items-center md:flex-row border-t-2 border-gray-300 w-full p-5">
        <button
          onClick={() => setIsOpen(true)}
          className="md:mt-0 w-96 bg-yellow-600 text-white text-xl font-bold p-3 rounded-full hover:scale-101"
        >
          Add Songs
        </button>
        <button
          onClick={handleCreatePlaylist}
          className="md:mt-0 w-96 bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101"
        >
          Create Playlist
        </button>
      </div>

      {isLoading && (
        <>
          <div className="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-sm bg-white/85"></div>

          <div className="p-5 rounded-md  absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4">
            <Loader text="Adding this playlist to your Spotify account" />
          </div>
        </>
      )}

      <AddSongsModal
        artist={artist}
        isOpen={isOpen}
        currentPlaylist={playlist}
        onClose={() => setIsOpen(false)}
        addSongsToPlaylist={addSongsToPlaylist}
      />
    </div>
  );
}

const AddSongsModal = ({
  artist,
  isOpen,
  currentPlaylist,
  onClose,
  addSongsToPlaylist,
}: {
  artist: string;
  isOpen: boolean;
  currentPlaylist: TPlaylist;
  onClose: () => void;
  addSongsToPlaylist: (additionalSongs: TTrack[]) => void;
}) => {
  const plans = [3, 6, 10];

  const [songCount, setSongCount] = useState(plans[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSongs = async () => {
    setIsLoading(true);
    const additionalSongs = await addSongs(
      artist,
      songCount,
      currentPlaylist.map((track) => ({
        title: track.name,
        artist: track.artist,
      }))
    );

    addSongsToPlaylist(additionalSongs);
    setIsLoading(false);
    setSongCount(plans[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/80" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="max-w-[500px] w-full space-y-4 border bg-white p-8 rounded-lg mx-3">
          <DialogTitle className="font-bold text-2xl">Add Songs</DialogTitle>
          {isLoading && <Loader text="Adding songs to your playlist" />}
          {!isLoading && (
            <div>
              <p>How many songs do you want to add?</p>
              <RadioGroup
                value={songCount}
                onChange={setSongCount}
                aria-label="Server size"
                className="flex gap-3 mt-3"
              >
                {plans.map((plan) => (
                  <Field key={plan} className="flex items-center gap-2">
                    <Radio
                      value={plan}
                      className="group w-20 h-16 flex cursor-pointer border-[3px] border-gray-300 rounded-lg py-4 px-5 transition items-center data-[checked]:border-amber-400 justify-center"
                    >
                      <div className="font-bold text-xl">{plan}</div>
                    </Radio>
                  </Field>
                ))}
              </RadioGroup>
              <div className="flex justify-between pt-5">
                <button
                  className="rounded-full  px-3 py-1 font-bold"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="rounded-full bg-blue-600 px-3 py-1 text-white font-bold"
                  onClick={handleAddSongs}
                >
                  Add Songs
                </button>
              </div>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
};
