import { restClient } from "@massive.com/client-js";

const key = import.meta.env.VITE_MASSIVE_KEY as string | undefined;

if (!key) {
  throw new Error(
    "VITE_MASSIVE_KEY is not set. Copy .env.example to .env.local and paste the API key."
  );
}


//singleton for massive REST client
//all of the api calls for the app will flow through here
export const massive = restClient(key, "https://api.massive.com");
