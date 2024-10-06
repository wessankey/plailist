import Link from "next/link";

export default function ArtistNotFoundPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const didYouMean = searchParams.didYouMean as string;
  const didYouMeanParsed = didYouMean.split("|") || [];

  return (
    <div className="w-full h-screen p-5">
      <div>
        <h1 className="text-5xl font-bold">Uh oh...</h1>
        <p className="text-xl mt-3">
          We couldn&apos;t find the artist you&apos;re looking for.
        </p>
      </div>

      <div>
        <p className="mt-3 text-lg">Maybe you meant one of these?</p>

        <ul className="max-w-96">
          {didYouMeanParsed.map((artist) => (
            <li key={artist}>
              <Link
                href={`/playlist?artist=${artist}`}
                className="block border-2 border-gray-600 p-3 rounded-md mt-4 cursor-pointer hover:scale-101 hover:bg-orange-100 hover:font-bold"
              >
                {artist}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/"
        className="flex cursor-pointer justify-center mt-4 w-1/2 max-w-[400px] bg-green-700 text-white text-xl font-bold p-3 rounded-full hover:scale-101"
      >
        Back to home
      </Link>
    </div>
  );
}
