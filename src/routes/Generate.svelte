<script lang="ts">
	import type { CollectionCard } from '$lib/cards';
	import { cards } from '$lib/cards';
	import { energyGrid, energyList } from '$lib/energies';
	import readingSpreads from '$lib/readingSpreads';
	import { onMount } from 'svelte';
	import characters from '$lib/characters';
	import {
		readingStore,
		timeVariableStore,
		flippedCardsStore,
		collectionStore,
		menuStateStore,
		customSpreadsStore,
		achievementsStore
	} from '../stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { secret as secretToast } from '$lib/toastStubs';
	import { secrets } from '$lib/secrets';
	import { unlocks } from '$lib/unlocks';
	import { getTokenCost } from '$lib/utils';
	import va from '@vercel/analytics';
	import ItemList from './ItemList.svelte';
	export let state: number;
	export let error = '';
	let innerState = 1;

	let generateButtonWrapper: HTMLDivElement;
	let pressedSegment = 0;

	$readingStore.setting = 'qa';
	$readingStore.character = 'Alex';

	let drawnCards: CollectionCard[] = [];
	let question = '';

	let scrollVar = 1;
	let oldScroll = 0;

	$: if($page.data.profile.data){
		// console.log('profile data', $page.data.profile.data);
		$customSpreadsStore = $page.data.profile.data.custom_spreads || [];
		setupItemList();
	}

	$: if($readingStore.ready){
		getReading();
	}

	let listItems: ListItem[] = []


	onMount(() => {
		window.onscroll = function () {
			scrollVar = oldScroll > scrollY ? 0 : 1;
			oldScroll = scrollY;
		};
		// Setup list items
		setupItemList();
	});

	let setupItemList = () => {
		// console.log('setupItemList', $readingStore.setting);
		listItems = [];
		Array.from(readingSpreads).forEach((spread) => {
			if(!unlocks.get(spread[1].key as string) || $page.data.profile?.data.experience >= (unlocks.get(spread[1].key as string)?.exp || 0)){
				listItems.push({
					id: listItems.length,
					name: spread[1].name,
					img: `./options/${spread[0]}.png`,
					action: () => {
						selectOption(spread[0]);
					},
					selected: spread[0] === $readingStore.setting
				});
			}
		});

		// Add exisiting custom spreads
		if($customSpreadsStore){
			$customSpreadsStore.forEach((spread) => {
				listItems.push({
					id: listItems.length,
					name: spread.name,
					img: `./options/custom.png`,
					action: () => {
						selectOption(spread.name);
					},
					selected: spread.name === $readingStore.setting
				});
			});
		}

		// Add custom spreads if unlocked
		if(unlocks.get('custom') && $page.data.profile?.data.experience >= (unlocks.get('custom')?.exp || 0)){
			listItems.push({
				id: listItems.length,
				name: 'Add Custom Spreads',
				img: `./options/Add.png`,
				action: () => {
					navigateToCustomSpreads();
				}
			});
		}else{
			// Add button to navigate to progression
			listItems.push({
				id: listItems.length,
				name: 'Unlock more spreads',
				img: `./options/Lock.svg`,
				action: () => {
					$menuStateStore = {value: 2, change: true}
				}
			});
		}
	}

	$: {
		$readingStore.cards = drawnCards;
		$readingStore.question = question;
	}

	$: if($readingStore.ready){
		$readingStore.ready = false;
		getReading();
	}

	let tokenCost = 0;
	$: {
		tokenCost = getTokenCost(
			$readingStore.cards.length,
			$readingStore.model || 'default'
		);
	}

	let mouseoverSegment = (segment: number) => {
		switch (segment) {
			case 1:
				generateButtonWrapper.style.transform =
					'rotatey(10deg) rotatex(-15deg) translateX(-0.5rem)';
				break;
			case 2:
				generateButtonWrapper.style.transform =
					'rotatey(3deg) rotatex(-15deg) translateX(-0.25rem)';
				break;
			case 3:
				generateButtonWrapper.style.transform = 'rotatey(0) rotatex(-15deg) translateX(0rem)';
				break;
			case 4:
				generateButtonWrapper.style.transform =
					'rotatey(-3deg) rotatex(-15deg) translateX(0.25rem)';
				break;
			case 5:
				generateButtonWrapper.style.transform =
					'rotatey(-10deg) rotatex(-15deg) translateX(0.5rem)';
				break;
			case 6:
				generateButtonWrapper.style.transform = 'rotatey(10deg) rotatex(15deg) translateX(-0.5rem)';
				break;
			case 7:
				generateButtonWrapper.style.transform = 'rotatey(3deg) rotatex(15deg) translateX(-0.25rem)';
				break;
			case 8:
				generateButtonWrapper.style.transform = 'rotatey(0) rotatex(15deg) translateX(0rem)';
				break;
			case 9:
				generateButtonWrapper.style.transform = 'rotatey(-3deg) rotatex(15deg) translateX(0.25rem)';
				break;
			case 10:
				generateButtonWrapper.style.transform = 'rotatey(-10deg) rotatex(15deg) translateX(0.5rem)';
				break;
		}
	};
	let mouseExit = () => {
		generateButtonWrapper.style.transform = 'rotate(0deg)';
	};
	let clickSegment = (segment: number) => {
		pressedSegment = segment;
		innerState = 2;
		draw();
	};

	let draw = () => {
		$achievementsStore = { action: 'AskQuestion', value: 'default' };
		state = 2; // loading
		window.scrollTo(0, 0);
		innerState = 1;
		$readingStore.conclusion = '';
		$readingStore.energy =
			energyList[energyGrid[pressedSegment - 1][scrollVar][$timeVariableStore]];
		$readingStore.cards = [];
		// Check if custom spread
		const customSpread = $customSpreadsStore.find(
			(spread) => spread.name === $readingStore.setting
		);
		if (customSpread) {
			$flippedCardsStore = customSpread.positions.map((pos) => false);
		} else {
			$flippedCardsStore =
				readingSpreads.get($readingStore.setting)?.positions.map((pos) => false) || [];
		}
		va.track('Draw');
		fetch('/api/draw', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				collectionDecks: $collectionStore,
				customSpread: $customSpreadsStore.find(
					(spread) => spread.name === $readingStore.setting
				),
				// tokenCost: tokenCost
			})
		})
			.then((res) => res.json())
			.then((data) => data.body)
			.then(
				(body: {
					cards?: { name: string; reversed: boolean; position: string }[];
					error?: string;
				}) => {
					if (body.error) {
						state = 4;
						error = body.error;
						// console.log(error);
						return;
					}
					if (body.cards) {
						let drawnCards = body.cards;
						let returnCards: CollectionCard[] = [];
						drawnCards.forEach((drawnCard) => {
							for (let [key, value] of cards.entries()) {
								value.cards.forEach((card) => {
									// console.log(card.name === drawnCard.name);
									if (drawnCard.name === card.name) {
										card.reversed = drawnCard.reversed;
										returnCards.push(JSON.parse(JSON.stringify(card)));
									}
								});
							}
						});
						// console.log(returnCards);
						$readingStore.cards = returnCards;
						invalidateAll();
						state = 3;
					}
				}
			);
	};

	let storedConclusion = "";
	
	let getReading = () => {
		$readingStore.conclusion = "";
		storedConclusion = "";
		va.track('GetReading');
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				customSpread: $customSpreadsStore.find(
					(spread) => spread.name === $readingStore.setting
				),
				tokenCost: tokenCost
			})
		}).then(async (res) => {
			const reader = res.body?.getReader();
			$achievementsStore = { action: 'StartReading', value: 'default' };
			$readingStore.incomplete = false;
			invalidateAll();
			while (true && reader) {
				const { done, value } = await reader.read();
				const res = new TextDecoder('utf-8').decode(value);
				console.log(res.substring(res.indexOf('{'),res.lastIndexOf('}') + 1));
				let text = chunksToText(res);
				// let text = res.slice(res.indexOf('"choices":[{"delta":{"content":"') + 32 , res.indexOf('"}',res.indexOf('"choices":[{"delta":{"content":"') + 32))
				if (text && !text.includes('"finish_reason":"stop')) {
					// Duplication glitch fix attempt
					if(!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
						$readingStore.conclusion += text.replaceAll('\\n','<br>').replaceAll('\\','');
						storedConclusion = $readingStore.conclusion;
					}
				}
				if (done) {
					// Is wrapped in {}
					if($readingStore.conclusion && $readingStore.conclusion.startsWith('{') && $readingStore.conclusion.endsWith('}')) {
						$readingStore.incomplete = false;
						$readingStore.conclusion = '...';
			
					}else{
						$readingStore.conclusion += `
						
...`;
						$achievementsStore = { action: 'CompleteReading', value: 'default' };
					}
					break;
				}
			}
		});
	};

	// let continueReading = () => {
	// 	va.track('ContinueReading');
	// 	fetch('/api/continueReading', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify({
	// 			reading: $readingStore,
	// 			customSpread: $customSpreadsStore.find(
	// 				(spread) => spread.name === $readingStore.setting
	// 			)
	// 		})
	// 	}).then(async (res) => {
	// 		const reader = res.body?.getReader();
	// 		$readingStore.incomplete = false;
	// 		invalidateAll();
	// 		while (true && reader) {
	// 			const { done, value } = await reader.read();
	// 			const text = new TextDecoder('utf-8').decode(value);
	// 			if (text){
	// 				// Duplication glitch fix attemmpt
	// 				if(!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
	// 					$readingStore.conclusion = text;
	// 					storedConclusion = text;
	// 				}
	// 			}
	// 			if (done) {
	// 				// Does not end with ...
	// 				if($readingStore.conclusion && !$readingStore.conclusion.endsWith('...') ) {
	// 					$readingStore.incomplete = true;
	// 				}else{
	// 					$achievementsStore = { action: 'CompleteReading', value: 'default' };
	// 				}
	// 				break;
	// 			}
	// 		}
	// 	});
	// };
	
	let chunksToText = (text: string): string => {
		if(text.includes('"choices":[{"delta":{"content":"')) {
			let startIndex = text.indexOf('"choices":[{"delta":{"content":"') + 32;
			let endIndex = text.indexOf('"}',text.indexOf('"choices":[{"delta":{"content":"') + 32);
			return text.slice(startIndex , endIndex) + chunksToText(text.slice(endIndex + 2));
		}else{
			return "";
		}
	}

	let selectOption = (option: string) => {
		// console.log(option);
		$readingStore.setting = option;
		$flippedCardsStore = readingSpreads.get(option)?.positions.map(() => false) || $customSpreadsStore.find(
			(spread) => spread.name === option
		)?.positions.map(() => false) || [];
		setupItemList();
	};

	

	let navigateToCustomSpreads = () => {
		$menuStateStore = { value: 4, change: true };
	};

	$: if ($readingStore) checkForSecret($readingStore.question);

	// Handle Secrets
	let checkForSecret = (input: string) => {
		switch (input.toLowerCase()) {
			// case 'svelte':
			// 	addSecret('Svelte');
			// 	break;
		}
	};

	let addSecret = (secret: string) => {
		if ($page.data.profile.data.secrets.includes(secret)) return;
		fetch('/api/addSecret', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				secrets: $page.data.profile.data.secrets.concat(secret)
			})
		}).then(() => {
			secretToast(
				`<b>Secret Unlocked: ${secrets.get(secret)?.name}</b><br>
			${secrets.get(secret)?.description}`,
				{
					onpop: () => {
						switch (secrets.get(secret)?.type) {
							case 'card':
								$menuStateStore = { value: 0, change: true };
								break;
						}
					}
				}
			);
			invalidateAll();
		});
	};
</script>

<div class="container">
	<div class={'input ' + (innerState !== 1 ? 'hidden' : '')}>
		<div class="setup">
			<div class="optionSelectWrapper">
				<p>Choose a spread</p>
				<ItemList bind:items={listItems}></ItemList>
			</div>
		</div>
		<div>
			<p>Enter your question</p>
			<!-- Placeholder random in readingSpreads?.get($readingStore.setting)?.placeholders -->
			<textarea bind:value={question} name="question" id="question" placeholder={
				readingSpreads?.get($readingStore.setting)?.placeholders?.[Math.floor(Math.random() * (readingSpreads?.get($readingStore.setting)?.placeholders?.length ?? 0))] || ""
			}></textarea>
			<div bind:this={generateButtonWrapper} class="generateButtonWrapper stacked">
				<div class="generateButton" on:mouseleave={mouseExit} on:touchend={mouseExit}>
					<div
						class="timeVarIndicator"
						style={'left:' +
							(($timeVariableStore - 1) / 11) * 100 +
							'%; ' +
							'transform: translatey(' +
							(scrollVar === 1 ? '-100%' : '-70%') +
							');' +
							'opacity:' +
							($timeVariableStore === 0 || $timeVariableStore === 10 ? '0' : '1')}
					/>
					<div
						class="timeVarIndicator"
						style={'left:' +
							(($timeVariableStore - 1) / 11) * 100 +
							'%; ' +
							'transform: scale(-1) translatey(' +
							(scrollVar === 1 ? '-70%' : '-100%') +
							');' +
							'opacity:' +
							($timeVariableStore === 0 || $timeVariableStore === 10 ? '0' : '1')}
					/>
					<button
						type="button"
						on:mouseover|preventDefault={() => mouseoverSegment(1)}
						on:focus={() => mouseoverSegment(1)}
						on:touchstart={() => mouseoverSegment(1)}
						on:touchmove={() => mouseoverSegment(1)}
						on:click|preventDefault={() => clickSegment(1)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(2)}
						on:focus={() => mouseoverSegment(2)}
						on:touchstart={() => mouseoverSegment(2)}
						on:touchmove={() => mouseoverSegment(2)}
						on:click={() => clickSegment(2)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(3)}
						on:focus={() => mouseoverSegment(3)}
						on:touchstart={() => mouseoverSegment(3)}
						on:touchmove={() => mouseoverSegment(3)}
						on:click={() => clickSegment(3)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(4)}
						on:focus={() => mouseoverSegment(4)}
						on:touchstart={() => mouseoverSegment(4)}
						on:touchmove={() => mouseoverSegment(4)}
						on:click={() => clickSegment(4)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(5)}
						on:focus={() => mouseoverSegment(5)}
						on:touchstart={() => mouseoverSegment(5)}
						on:touchmove={() => mouseoverSegment(5)}
						on:click={() => clickSegment(5)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(6)}
						on:focus={() => mouseoverSegment(6)}
						on:touchstart={() => mouseoverSegment(6)}
						on:touchmove={() => mouseoverSegment(6)}
						on:click={() => clickSegment(6)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(7)}
						on:focus={() => mouseoverSegment(7)}
						on:touchstart={() => mouseoverSegment(7)}
						on:touchmove={() => mouseoverSegment(7)}
						on:click={() => clickSegment(7)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(8)}
						on:focus={() => mouseoverSegment(8)}
						on:touchstart={() => mouseoverSegment(8)}
						on:touchmove={() => mouseoverSegment(8)}
						on:click={() => clickSegment(8)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(9)}
						on:focus={() => mouseoverSegment(9)}
						on:touchstart={() => mouseoverSegment(9)}
						on:touchmove={() => mouseoverSegment(9)}
						on:click={() => clickSegment(9)}
					/>
					<button
						type="button"
						on:mouseover={() => mouseoverSegment(10)}
						on:focus={() => mouseoverSegment(10)}
						on:touchstart={() => mouseoverSegment(10)}
						on:touchmove={() => mouseoverSegment(10)}
						on:click={() => clickSegment(10)}
					/>
				</div>
				<p>Tell me my fortune</p>
			</div>
			<!-- If daily is available -->
			{#if !$page.data.profile.data.daily }
				<p class="bonus info">Daily bonus is available! <br> Complete a reading to earn 5 shop essence!</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		margin-top: 2rem;
		text-align: center;
	}
	.setup {
		display: grid;
		grid-template-columns: 100%;
		& .optionSelectWrapper {
			> p {
				font-size: $h4-font-size;
			}
			
		}
	}
	.input {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		& textarea {
			resize: vertical;
			width: 30rem;
			max-width: 80vw;
			height: 2.5rem;
			margin-bottom: 1rem;
			padding-top: 0.25rem;
			text-align: center;
			font-size: $base-font-size;
			font-family: $other-font;
		}
	}
	.generateButtonWrapper {
		overflow: visible;
		transition: all 0.5s ease-in-out;
		perspective: 100px;
		.generateButton {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: repeat(2, 1fr);
			min-height: 5rem;
			position: relative;
			overflow-x: hidden;
			overflow-y: hidden;
			& button {
				width: 100%;
				height: 100%;
				background-color: #000;
				border: none;
			}
			& .timeVarIndicator {
				pointer-events: none;
				background: radial-gradient(
					50% 100% at 50% 0%,
					rgba(255, 255, 255, 0.47) 0%,
					rgba(217, 217, 217, 0) 100%
				);
				height: 100%;
				width: 30%;
				transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
				position: absolute;
			}
		}
		& p {
			pointer-events: none;
			place-self: center;
			font-size: $h4-font-size;
			transform: translateZ(0);
		}
	}
	.bonus{
		margin-top: 0.5rem;
	}
	
</style>
