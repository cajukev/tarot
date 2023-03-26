// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { CollectionCard } from "$lib/cards";
import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit/dist/types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sb: TypedSupabaseClient
			session: Session | null
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null
		}

		
		// interface PageData {}
		// interface Platform {}
	}
	type Card = {
		name: string
		reversed: boolean
		position: string
		reading?: string
	}

	type ReadingType = {
		cards: CollectionCard[],
		conclusion: string,
		question: string,
		energy: string,
		setting: string,
		character: string,
	}
}