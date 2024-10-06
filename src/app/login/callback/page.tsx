import { requestAccessToken } from "@/actions/login";

export default async function CallbackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // TODO: how to confirm that the state is the same as the one we sent?
  const state = searchParams.state;
  const code = searchParams.code as string;

  await requestAccessToken(code);

  return (
    <div className="flex justify-center mt-32">
      <p className="text-2xl font-bold">Logging in...</p>
    </div>
  );
}
