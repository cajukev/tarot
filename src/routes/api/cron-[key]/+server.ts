import { dbSecret } from '$lib/db';

export async function GET({params}) {

  if(params.key === import.meta.env.VITE_CRON_SHARED_KEY) {

    let resetDaily = await dbSecret.from("Profile")
      .update({ daily: false})
      .eq("daily", true)
      .select("id")
      .then((data) => {
        return data.data
      });

    let regenTokens = await dbSecret.from("Profile")
      .update({ tokens: 30})
      .lt("tokens", 30)
      .select("id")
      .then((data) => {
        return data.data
      });

      return new Response(JSON.stringify({resetDaily, regenTokens}));
    }
    else {
      return new Response("Invalid key", {status: 401});
    }
}