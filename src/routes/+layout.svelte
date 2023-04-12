<script lang="ts">
	import '../app.scss';
	import { db } from '$lib/db';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { achievementsStore, deviceStore, readingStore, menuStateStore } from '../stores';
	import type { PageData } from './$types';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { achievement as achievementToast, unlock as unlockToast } from '$lib/toastStubs';
	import type { Achievement } from '$lib/achievements';
	import { achievements } from '$lib/achievements';
	import { unlocks } from '$lib/unlocks';
	import Menu from './Menu.svelte';
	import { mapToObj, objToMap } from '$lib/utils';

	export let data: PageData;

	onMount(() => {
		console.log(data);
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
	let userAchievements: Map<string, Achievement> =
		objToMap(data.profile?.data?.achievements) || achievements;
	console.log('userAchievements', userAchievements);
	console.log(mapToObj(userAchievements));

	let storedQuestion = 'This is definitely not a question 1234567890987654321';

	$: {
		if ($achievementsStore?.value) handleAchievements();
	}
	let handleAchievements = () => {
		completeAchievement('Beginnings');
		let value;
		switch ($achievementsStore?.action) {
			case 'CompleteReading':
				value = $readingStore;
				// Completed a reading
				completeAchievement('Beginnings');

				if (!userAchievements.get('NewBeginnings')!.completed) {
					if (!userAchievements.get('NewBeginnings')!.progress.progress) {
						userAchievements.get('NewBeginnings')!.progress.progress = [value.setting];
						updateAchievements();
					} else {
						userAchievements.get('NewBeginnings')!.progress.progress.push(value.setting);
						updateAchievements();
					}
					if (userAchievements.get('NewBeginnings')!.progress.progress?.length >= 3) {
						completeAchievement('NewBeginnings');
					}
				}
				break;
			case 'AskQuestion':
				value = $readingStore.question;
				if (value !== storedQuestion) {
					storedQuestion = value;
				} else {
					completeAchievement('Perseverance');
					updateAchievements();
				}
		}
		userAchievements = new Map(userAchievements);
		console.log('handleAchievements', userAchievements);
	};
	let completeAchievement = (achievement: string) => {
		if (userAchievements.get(achievement)!.completed) return;

		userAchievements.get(achievement)!.completed = true;
		updateAchievements();
		addExperience(userAchievements.get(achievement)!.experience);
		achievementToast(`<b>Achievement Unlocked: ${userAchievements.get(achievement)!.name}</b><br>
			${userAchievements.get(achievement)!.description}<br>
			<i>+${userAchievements.get(achievement)!.experience} XP</i>`);
	};
	let updateAchievements = () => {
		fetch('/api/updateAchievements', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				achievements: mapToObj(userAchievements)
			})
		}).then(() => {
			invalidateAll();
		});
	};

	let addExperience = (amount: number) => {
		let newExperience = data.profile?.data?.experience + amount;
		console.log('addExperience', newExperience);
		fetch('/api/addExperience', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				experience: newExperience
			})
		}).then(() => {
			checkUnlocks(data.profile?.data?.experience, newExperience);
			invalidateAll();
		});
	};

	let checkUnlocks = (oldExperience: number, newExperience: number) => {
		unlocks.forEach((data) => {
			if (oldExperience < data.exp && newExperience >= data.exp) {
				unlockToast(
					`<b>Unlocked: ${data.name}</b><br>
				${data.description}`,
					{
						onpop: () => {
							switch (data.type) {
								case 'card':
									$menuStateStore = { value: 0, change: true };
									break;
							}
						}
					}
				);
			}
		});
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
<Menu />
<div class="toastWrapper">
	<SvelteToast />
</div>
<div class="topShadow" />
<div class="app">
	<div class="bg" />
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

	// Toast
	.toastWrapper {
		display: contents;
		line-height: 150%;
		--toastWidth: fit-content;
		--toastColor: #000;
		--toastBarBackground: #fff;
		--toastBorderRadius: 0.5rem;
	}
</style>
