import { dbSecret } from '$lib/db';

export async function GET({request, params}) {

  if(params.key === import.meta.env.VITE_CRON_SHARED_KEY) {

    let setDaily = await dbSecret.from("Profile")
      .update({ daily: false})
      .eq("daily", true)
      .select("id")
      .then((data) => {
        return data.data
      });

    let data = await dbSecret.from("Profile")
      .update({ tokens: 50})
      .lt("tokens", 50)
      .select("id")
      .then((data) => {
        return data.data
      });

      return new Response(JSON.stringify({setDaily, data}));
    }
    else {
      return new Response("Invalid key", {status: 401});
    }
}