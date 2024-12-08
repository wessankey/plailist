import Image from "next/image";
import { Trash2 } from "lucide-react";
import { TTrack } from "@/types";

const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? `0${seconds}` : seconds}`;
};

type TrackProps = TTrack & {
  removeTrack: (uri: string) => void;
};

export function Track({
  artist,
  name,
  album,
  uri,
  images,
  duration,
  popularity,
  removeTrack,
}: TrackProps) {
  return (
    <div className="w-full border-2 border-gray-500 p-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer bg-white">
      <div className="flex items-center gap-3">
        <Image
          src={images[2].url}
          alt={name}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
        <div className="min-w-0 flex-1 mr-2">
          <p className="font-bold text-md truncate">{name}</p>
          <p className="text-gray-700 text-sm">{artist}</p>
        </div>

        <div className="flex-shrink-0 gap-4 flex">
          <p className="text-gray-600 text-sm">
            {msToMinutesAndSeconds(duration)}
          </p>

          <Trash2
            onClick={() => removeTrack(uri)}
            className="text-gray-700 hover:cursor-pointer hover:scale-105 size-5 hover:text-red-500"
          />
        </div>
      </div>
    </div>
  );
}
