<script lang="ts">
	import { db } from '$lib/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.scss';
	import { achievementsStore, deviceStore, flippedCardsStore, readingStore } from '../stores';
	import Menu from './Menu.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { Achievement } from '$lib/achievements';
	import { achievements } from '$lib/achievements';
	import Reading from './Reading.svelte';

	onMount(() => {
		console.log(data)
		if (window.matchMedia('(any-pointer: coarse)').matches) {
			$deviceStore.hasTouch = true;
		}
		if (matchMedia('(pointer:fine)').matches) {
			$deviceStore.hasMouse = true;
		}

		const {
			data: { subscription }
		} = db.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	// HANDLE ACHIEVEMENTS
	// let userAchievements: Map<string, Achievement> = new Map(data.profile?.data?.achievements) || achievements;
	let userAchievements: Map<string, Achievement> = achievements;
	
	let storedQuestion = "This is definitely not a question 1234567890987654321";

	$: {
		if ($achievementsStore?.value) handleAchievements();
	}
	let handleAchievements = () => {
		let value;
		switch ($achievementsStore?.action) {
			case 'CompleteReading':
				value = $readingStore;
				// Completed a reading
				completeAchievement('Beginnings');

				if (!userAchievements.get('NewBeginnings')!.completed) {
					if (!userAchievements.get('NewBeginnings')!.progress.progess) {
						userAchievements.get('NewBeginnings')!.progress.progess = [value.setting];
					} else {
						userAchievements.get('NewBeginnings')!.progress.progess.push(value.setting);
					}
					if (userAchievements.get('NewBeginnings')!.progress.progess?.length >= 3) {
						completeAchievement('NewBeginnings');
					}
				}
				break;
				case 'AskQuestion':
					value = $readingStore.question;
					if(value !== storedQuestion){
						storedQuestion = value;
					}else{
						completeAchievement('Perseverance')
					}

		}
		userAchievements = new Map(userAchievements);
	};
	let completeAchievement = (achievement: string) => {
		if (!userAchievements.get(achievement)!.completed) {
			userAchievements.get(achievement)!.completed = true;
			console.log('completeAchievement', achievement);
		}
	};
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Quintessential&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<SvelteToast />
<div class="topShadow" />
<div class="app">
	<div class="bg" />
	<!-- <Menu /> -->
	<slot />
</div>

<div class="dummy hidden" />

<style lang="scss">
	.app {
		min-height: 101vh;
		position: relative;
		@media screen and (max-width: $breakpoint-2-1) {
			flex-direction: column;
			height: auto;
		}
	}
	.bg {
		background-image: url('bg.svg');
		position: absolute;
		z-index: -2;
		width: 100%;
		height: 100%;
		@media screen and (max-width: $breakpoint-2-1) {
			background-image: none;
		}
	}
	.topShadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50vh;
		background: linear-gradient(180deg, #050607 0%, rgba(5, 6, 7, 0) 100%);
		z-index: -1;
	}
</style>
