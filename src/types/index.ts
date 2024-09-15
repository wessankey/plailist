export type Track = {
  artist: string;
  name: string;
  album: string;
  uri: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  duration: number;
  popularity: number;
};

export type Playlist = Track[];