<script lang="ts">
	import '../app.scss';
	import { db } from '$lib/db';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { achievementsStore, deviceStore, readingStore, menuStateStore, textSizeStore } from '../stores';
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

	inject({ mode: dev ? 'development' : 'production' });

	let userAchievements: Map<string, Achievement>;

	onMount(() => {
		if (window.matchMedia('(any-pointer: coarse)').matches) {
			$deviceStore.hasTouch = true;
		}
		if (matchMedia('(pointer:fine)').matches) {
			$deviceStore.hasMouse = true;
		}
		// Text size
		document.documentElement.style.setProperty('--fontMultiplier', $textSizeStore+"");

		// Supabase Auth
		const {
			data: { subscription }
		} = db.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};

	});


	let storedQuestion = 'This is definitely not a question 1234567890987654321';
	let storedEnergy = '';
	let completedExp = 0;

	$: {
		if ($achievementsStore?.value) handleAchievements();
	}
	let handleAchievements = () => {
		if(!userAchievements){
			if (!data.profile?.data?.achievements) {
				userAchievements = achievements;
			} else {
				userAchievements = new Map([
					...achievements,
					...(objToMap(data.profile!.data.achievements) || [])
				])
			}
		}

		completedExp = 0;
		let value;
		let updateAchievementsFlag = false;
		// console.log('handleAchievements', $achievementsStore);
		switch ($achievementsStore?.action) {
			case 'CompleteReading':
				value = $readingStore;
				// Daily Challenge
				if ( data.profile && !data.profile?.data?.daily){
					completeDailyReading();
				}

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
				// console.log('StartReading');
				value = $readingStore;
				let spentTokens = getTokenCost(value.cards.length, value.model, data.profile?.data?.information);
				userAchievements.get('200Tokens')!.progress =
					userAchievements.get('200Tokens')!.progress + spentTokens;
				if (userAchievements.get('200Tokens')!.progress >= 200) {
					completeAchievement('200Tokens');
				}
				if (userAchievements.get('200Tokens')!.progress >= 100) {
					completeAchievement('100Tokens');
				}
				if (userAchievements.get('200Tokens')!.progress >= 75) {
					completeAchievement('75Tokens');
				}
				if (userAchievements.get('200Tokens')!.progress >= 50) {
					completeAchievement('50Tokens');
				}
				if (userAchievements.get('200Tokens')!.progress >= 25) {
					completeAchievement('25Tokens');
				}
				if (userAchievements.get('200Tokens')!.progress >= 10) {
					completeAchievement('10Tokens');
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
		// console.log('handleAchievements', userAchievements);
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
		// console.log('updateAchievements', mapToObj(userAchievements));
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
		// console.log('addExperience', amount);
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
	let completeDailyReading = () => {
		// console.log('completeDailyReading');
		fetch('/api/completeDailyReading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		}).then(() => {
			achievementToast(`<b>Daily Reading Complete!</b><br>
			<i>+5 Essence</i>`);
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
	<title>Call Upon The Power Of Tarot</title>
</svelte:head>
<div class="toastWrapper">
	<SvelteToast />
</div>
<div class="topShadow" />
<div class="app">
	<p class="title">AITarot.website</p> 
	<Menu />
	<div class="bg" />
	<Title />
	<slot />
	<p class="title end">AITarot.website</p>
	<div class="endMenu">
		<Menu></Menu>
	</div>
</div>

<div class="dummy hidden" />

<style lang="scss">
	.app {
		min-height: 101vh;
		position: relative;
		padding-bottom: 3rem;
		@media screen and (max-width: $breakpoint-2-1) {
			flex-direction: column;
			height: auto;
		}
	}
	.bg {
		background-image: url('/static/bg.svg');
		position: fixed;
		top: 0;
		z-index: -2;
		width: 100%;
		height: 100%;
		@media screen and (max-width: $breakpoint-2-1) {
			background-image: none;
		}
	}
	.topShadow {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50vh;
		background: linear-gradient(180deg, #050607 0%, rgba(5, 6, 7, 0) 100%);
		z-index: -1;
	}
	.title{
      font-family: $header-font;
			text-align: center;
			margin: 1rem 0;
      font-size: 2rem;
      font-weight: 300;
      color: white;
      margin-bottom: 0.5rem;
			&.end{
				margin-bottom: 2rem;
			}
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
