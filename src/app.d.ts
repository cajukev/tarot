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
			profile: {
				data:{
					id: string
					experience: number
					secrets: string[]
					achievements: {
						name:string
						completed: boolean
						progress: { [key: string]: any }
						description: string
						experience: number
					}[]
					custom_spreads: any[]
					tokens: number,
					essence: number,
					bought_items: string[],
					purchase_history: {item: string, date: string}[],
					daily: boolean,
					information: string
				}
			}
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
		ready?: boolean | false,
		incomplete?: boolean | false,
		cardback: string,
		art: string,
		model: string,
		analysis: string,
		summary: string,
		length?: string,
		storyCardMeaning: string,
	}

	type ListItem = {
    id: number;
    name: string;
    img: string;
    cost?: number;
    description?: string;
    action? (): void;
		selected?: boolean;
		exp?: number;
		bought?: boolean;
		completed?: boolean;
		available?: boolean | true;
  };
}