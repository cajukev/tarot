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
	import { cards } from '$lib/cards';
	import { getTokenCost, mapToObj, objToMap } from '$lib/utils';
	import Title from './Title.svelte';
	import Menu from './Menu.svelte';
	import characters from '$lib/characters';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	export let data: PageData;

	// inject({ mode: dev ? 'development' : 'production' });

	let userAchievements: Map<string, Achievement>;

	onMount(() => {
		if (window.matchMedia('(any-pointer: coarse)').matches) {
			$deviceStore.hasTouch = true;
		}
		if (matchMedia('(pointer:fine)').matches) {
			$deviceStore.hasMouse = true;
		}

		// Supabase Auth
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
	$: if (!data.profile?.data?.achievements) {
		userAchievements = achievements;
	} else {
		userAchievements = new Map([
			...achievements,
			...(objToMap(data.profile!.data.achievements) || [])
		]);
		console.log('userAchievements', userAchievements, achievements);
		if (userAchievements.size !== achievements.size) {
			updateAchievements();
		}
	}

	let storedQuestion = 'This is definitely not a question 1234567890987654321';
	let storedEnergy = '';
	let completedExp = 0;

	$: {
		if ($achievementsStore?.value) handleAchievements();
	}
	let handleAchievements = () => {
		completedExp = 0;
		let value;
		let updateAchievementsFlag = false;
		console.log('handleAchievements', $achievementsStore);
		switch ($achievementsStore?.action) {
			case 'CompleteReading':
				value = $readingStore;
				// FirstCompletedReading
				completeAchievement('FirstCompletedReading');
				// ReadingWith3Preset
				if (!userAchievements.get('ReadingWith3Preset')!.completed) {
					if (
						!userAchievements.get('ReadingWith3Preset')!.progress ||
						userAchievements.get('ReadingWith3Preset')!.progress.length === 0
					) {
						userAchievements.get('ReadingWith3Preset')!.progress = [value.setting];
						updateAchievementsFlag = true;
					} else {
						if (!userAchievements.get('ReadingWith3Preset')!.progress.includes(value.setting)) {
							userAchievements.get('ReadingWith3Preset')!.progress.push(value.setting);
							updateAchievementsFlag = true;
						}
						if (userAchievements.get('ReadingWith3Preset')!.progress?.length >= 3) {
							completeAchievement('ReadingWith3Preset');
						}
					}
				}
				break;

			case 'AskQuestion':
				value = $readingStore;
				// SameQuestion
				if (value.question !== storedQuestion) {
					storedQuestion = value.question;
				} else {
					completeAchievement('SameQuestion');
					updateAchievementsFlag = true;
				}
				// PerfectionismEnergy
				if (value.energy === 'Perfectionism' && storedEnergy === 'Perfectionism') {
					completeAchievement('PerfectionismEnergy');
					updateAchievementsFlag = true;
				}
				// SameEnergy
				if (value.energy !== storedEnergy) {
					storedEnergy = value.energy;
				} else {
					completeAchievement('SameEnergy');
					updateAchievementsFlag = true;
				}
				break;
			case 'FlipCard':
				value = $achievementsStore?.value;
				// AllMACards (flip all Major Arcana cards, progress is card name array)
				if (!userAchievements.get('AllMACards')!.completed) {
					if (
						cards
							.get('Major Arcana')
							?.cards?.find((card) => card.name === $achievementsStore?.value)
					) {
						if (
							!userAchievements.get('AllMACards')!.progress ||
							userAchievements.get('AllMACards')!.progress.length === 0
						) {
							userAchievements.get('AllMACards')!.progress = [$achievementsStore?.value];
							updateAchievementsFlag = true;
						} else {
							if (
								!userAchievements.get('AllMACards')!.progress.includes($achievementsStore?.value)
							) {
								userAchievements.get('AllMACards')!.progress.push($achievementsStore?.value);
								updateAchievementsFlag = true;
							}
						}
						if (userAchievements.get('AllMACards')!.progress?.length >= 22) {
							completeAchievement('AllMACards');
						}
					}
				}
				break;
			case 'StartReading':
				console.log('StartReading');
				value = $readingStore;
				let spentTokens = getTokenCost(value.cards.length, characters.get(value.character)!.model);
				userAchievements.get('30Tokens')!.progress =
					userAchievements.get('30Tokens')!.progress + spentTokens;
				if (userAchievements.get('30Tokens')!.progress >= 30) {
					completeAchievement('30Tokens');
				}
				if (userAchievements.get('30Tokens')!.progress >= 25) {
					completeAchievement('25Tokens');
				}
				if (userAchievements.get('30Tokens')!.progress >= 20) {
					completeAchievement('20Tokens');
				}
				if (userAchievements.get('30Tokens')!.progress >= 15) {
					completeAchievement('15Tokens');
				}
				if (userAchievements.get('30Tokens')!.progress >= 10) {
					completeAchievement('10Tokens');
				}
				if (userAchievements.get('30Tokens')!.progress >= 5) {
					completeAchievement('5Tokens');
				}
				updateAchievementsFlag = true;
				break;
		}
		userAchievements = new Map(userAchievements);
		if (updateAchievementsFlag) updateAchievements();
		if (completedExp > 0) {
			addExperience(completedExp);
		} else {
			invalidateAll();
		}
		console.log('handleAchievements', userAchievements);
	};
	let completeAchievement = (achievement: string) => {
		if (userAchievements.get(achievement)!.completed) return;

		userAchievements.get(achievement)!.completed = true;
		updateAchievements();
		completedExp += userAchievements.get(achievement)!.experience;
		achievementToast(`<b>Achievement Unlocked: ${userAchievements.get(achievement)!.name}</b><br>
			${userAchievements.get(achievement)!.description}<br>
			<i>+${userAchievements.get(achievement)!.experience} XP</i>`);
	};
	let updateAchievements = () => {
		console.log('updateAchievements', mapToObj(userAchievements));
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
		console.log('addExperience', amount);
		fetch('/api/addExperience', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				experience: amount
			})
		}).then(() => {
			checkUnlocks(data.profile?.data?.experience, data.profile?.data?.experience + amount);
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
	<Title />
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
		background-image: url('/static/bg.svg');
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
