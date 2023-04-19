import { dbSecret } from '$lib/db';

export async function GET({request, params}) {

  if(params.key === import.meta.env.VITE_CRON_SHARED_KEY) {
    let data = await dbSecret.from("Profile")
      .update({ tokens: 10})
      .lt("tokens", 10)
      .select("id")
      .then((data) => {
        return data.data
      });

      return new Response(JSON.stringify(data));
    }
    else {
      return new Response("Invalid key", {status: 401});
    }
}