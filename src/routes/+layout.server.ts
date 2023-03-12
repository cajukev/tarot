import { getServerSession } from "@supabase/auth-helpers-sveltekit";
import { redirect } from "@sveltejs/kit";
import type { Actions, LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const session = await getServerSession(event);
  if (session?.user) {
    return {
      session: await getServerSession(event),
      profile: await event.locals.sb
      .from('Profile')
      .select('*')
      .eq('id', session.user.id),
    }
  }
  return {
    session: await getServerSession(event),
    profile: null
  }
}