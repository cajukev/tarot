import { dbSecret } from '$lib/db';

export function GET() {
  try {
    dbSecret.from("Profile")
      .update({ tokens: 15})
      .lt("tokens", 15)
      .then((data) => {
        console.log(data);
      });
  } catch (error) {
    console.log(error);
  } finally {
    console.log("finally");
    return new Response('Hello Cron!');
  }
}