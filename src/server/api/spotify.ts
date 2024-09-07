const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export async function lookupSong({
  artist,
  title,
}: {
  artist: string;
  title: string;
}) {
  const urlEncodedArtist = encodeURIComponent(artist);
  const urlEncodedTitle = encodeURIComponent(title);

  const url = `${SPOTIFY_BASE_URL}/search?&type=track&q=artist:${urlEncodedArtist}%20track:${urlEncodedTitle}&limit=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.SPOTIFY_API_KEY}`,
    },
  });

  const data = await response.json();

  if (data.tracks.items && data.tracks.items.length > 0) {
    const track = data.tracks.items[0];

    return {
      artist: track.artists[0].name,
      name: track.name,
      album: track.album.name,
      uri: track.uri,
      images: track.album.images,
      duration: track.duration_ms,
      popularity: track.popularity,
    };
  }

  return null;
}
