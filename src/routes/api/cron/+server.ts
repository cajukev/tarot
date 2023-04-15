import { dbSecret } from '$lib/db.js';

export function GET() {
  dbSecret.rpc('cron_update_profile_tokens')
  return new Response('Hello Cron!');
}