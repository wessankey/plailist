import { auth, signIn } from "../../../auth";

export default async function LoginPage() {
  const myAuth = await auth();

  console.log("log:auth:", myAuth);

  return (
    <div className="flex justify-center mt-32">
      <form
        action={async () => {
          "use server";
          await signIn("spotify");
        }}
      >
        <button
          type="submit"
          className="mt-8 w-72 max-w-[400px] bg-yellow-600 text-white text-xl font-bold p-3 rounded-full hover:scale-101 disabled:bg-gray-400 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          Login with Spotify
        </button>
      </form>
    </div>
  );
}
