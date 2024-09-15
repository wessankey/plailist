import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Track as TrackType } from "@/types";

const msToMinutesAndSeconds = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? `0${seconds}` : seconds}`;
};

export function Track({
  artist,
  name,
  album,
  uri,
  images,
  duration,
  popularity,
}: TrackType) {
  return (
    <div className="flex gap-3 justify-between w-[30rem] border border-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-100 hover:cursor-pointer">
      <div className="flex gap-3">
        <Image
          src={images[2].url}
          alt={name}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
        <div className="min-w-0">
          <h2 className="font-bold text-md truncate overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h2>
          <p className="text-gray-600 text-sm">{artist}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <p className="text-gray-500 text-sm">
          {msToMinutesAndSeconds(duration)}
        </p>

        <Trash2 className="text-gray-500 hover:cursor-pointer hover:scale-105 size-5 hover:text-red-400" />
      </div>
    </div>
  );
}
