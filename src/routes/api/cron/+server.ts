import { dbSecret } from '$lib/db';

export async function GET(req) {

  if (req.request.headers.get('Authorization') !== `Bearer ${process.env.VITE_CRON_SECRET}`) {
    return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});
  }
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