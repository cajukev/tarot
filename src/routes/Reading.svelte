<script lang="ts">
	import { page } from '$app/stores';
	import characters from '$lib/characters';
	import readingSpreads from '$lib/readingSpreads';
	import { getAnalysisTokenCost, getTokenCost, objToMap } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import {
		readingStore,
		flippedCardsStore,
		customSpreadsStore,
		achievementsStore,
		menuStateStore
	} from '../stores';
	import { getCardsPack, type CollectionCard } from '$lib/cards';
	import InfoBox from './InfoBox.svelte';
	import { unlocks } from '$lib/unlocks';
	import { set } from '@fern-api/openai/core/schemas';
	import ItemList from './ItemList.svelte';
	import { art } from '$lib/customization';
	import Collection from './Collection.svelte';
	import CardSelect from './CardSelect.svelte';
	import { invalidateAll } from '$app/navigation';
	import { secret } from '$lib/toastStubs';
	export let state: number;

	let cardSelectPopup: HTMLElement;
	let currentSelectCardPosition: number | null = null;
	let currentSelectCard: CollectionCard | null = null;
	let selectedCard: CollectionCard | undefined | null = undefined;
	let flipCard = (index: number) => {
		if ($readingStore.cards[index].name === 'undefined') {
			// Card is undefined, select card
			cardSelectPopup.classList.remove('hidden');
			currentSelectCardPosition = index;
		} else {
			// Card is set
			$flippedCardsStore[index] = !$flippedCardsStore[index];
			$achievementsStore = {
				action: 'FlipCard',
				value: $readingStore.cards[index].name
			};
		}
	};

	$: if (selectedCard !== undefined && selectedCard !== null) {
		setCard();
		flipCard(currentSelectCardPosition as number);
		// reset variables
		currentSelectCard = null;
		currentSelectCardPosition = null;
		closePopup();
	}

	let setCard = () => {
		console.log('setCard', currentSelectCard);
		$readingStore.cards[currentSelectCardPosition as number] = JSON.parse(
			JSON.stringify(currentSelectCard || '')
		);
		selectedCard = undefined;
	};

	// actionState 0: show actions
	// actionState 1: hide actions

	let actionState = 0;

	$: if ($flippedCardsStore?.every((card) => card) && !$readingStore.conclusion) {
		actionState = 1;
	} else {
		actionState = 0;
		loading = false;
	}

	let readingElem: HTMLDivElement;
	let restart = () => {
		state = 1;
		document.body.scrollIntoView();
	};

	let reset = () => {
		actionState = 0;
		$readingStore.ready = false;
		$readingStore.conclusion = '';
		readingElem.scrollIntoView();
	};

	let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

	let tokenCost = 0;
	let analysisTokenCost = 0;
	$: {
		tokenCost = getTokenCost($flippedCardsStore?.length, $readingStore.model || 'default');
		analysisTokenCost = getAnalysisTokenCost($flippedCardsStore?.length);
	}
	let loading = false;

	// Infobox state

	let currentCard: CollectionCard | undefined | null = undefined;

	let infoBoxIsShown = false;

	let infoBoxAppear = (card: CollectionCard) => {
		infoBoxIsShown = true;
		currentCard = card;
		setTimeout(() => {
			currentCard = card;
		}, 250);
	};

	let selectCharacter = (character: string) => {
		$readingStore.character = character;
	};

	// ItemList, 1 selected at a time

	let listItems: ListItem[] = [];
	let selected = 0;

	let setupItemList = () => {
		listItems = [];
		for (let i = 0; i < characters.size; i++) {
			let available = false;
			if (
				!characters.get([...characters.keys()][i])?.pack ||
				(characters.get([...characters.keys()][i])?.pack === 'unlock' &&
					$page.data.profile?.data.experience >=
						(unlocks.get(characters.get([...characters.keys()][i])?.name + '')?.exp || 0)) ||
				(characters.get([...characters.keys()][i])?.pack &&
					$page.data.profile?.data.bought_items.includes(
						characters.get([...characters.keys()][i])?.pack + ''
					))
			) {
				available = true;
			}

			listItems.push({
				id: i,
				name: characters.get([...characters.keys()][i])?.name || '',
				description: characters.get([...characters.keys()][i])?.title || '',
				selected: i === selected,
				img: '/options/' + characters.get([...characters.keys()][i])?.name + '-200.webp' || '',
				available: available,
				action() {
					selectItem(i);
				}
			});
		}
	};
	setupItemList();

	let selectItem = (id: number) => {
		listItems[id].selected = !listItems[id].selected;
		selected = id;
		selectCharacter([...characters.keys()][id]);
		setupItemList();
	};

	let closePopup = () => {
		cardSelectPopup.classList.add('hidden');
	};

	let analyseCards = () => {
		if (loading) return;
		loading = true;
		fetch('/api/analysis', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				readingStore: $readingStore,
				tokenCost: analysisTokenCost
			})
		})
			.then(async (res) => {
				console.log(res);
				const reader = res.body?.getReader();
				let storedLength = 0;
				let flag = false;
				while (true && reader && !flag) {
					const { done, value } = await reader.read();
					if(storedLength === value?.length){
						console.log('done');
						loading = false;
						actionState = 1;
						flag = true;
						invalidateAll();
						break;
					}else{
						storedLength = value?.length || 0;
					}
					const text = new TextDecoder('utf-8').decode(value);
					if (text) {
						if (!(storedAnalysis.length > 20 && text.length > 1.5 * storedAnalysis.length)) {
							$readingStore.analysis = text;
							storedAnalysis = $readingStore.analysis;
						}
					}
					
				}
			})
			// .finally(() => {
			// 	console.log('done');
			// 	loading = false;
			// 	actionState = 0;
			// 	invalidateAll();
			// });
	};

	let storedConclusion = '';
	let storedAnalysis = '';
	let getReadingWithAnalysis = () => {
		if (loading) return;
		loading = true;
		actionState = 0;
		storedConclusion = '';
		storedAnalysis = '';
		fetch('/api/tarotReadingWithAnalysis', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				readingStore: $readingStore,
				customSpread: $customSpreadsStore.find((spread) => spread.name === $readingStore.setting),
				tokenCost: tokenCost
			})
		})
			.then(async (res) => {
				const reader = res.body?.getReader();
				$achievementsStore = { action: 'StartReading', value: 'default' };
				let storedLength = 0;
				let flag = false;
				let flag2 = false;
				while (true && reader && !flag) {
					const { done, value } = await reader.read();
					if(storedLength === value?.length){
						console.log('done');
						loading = false;
						actionState = 1;
						$achievementsStore = { action: 'CompleteReading', value: 'default' };
						$readingStore.conclusion = $readingStore.conclusion + `
...`;					
						flag = true;
						invalidateAll();
						break;
					}else{
						if(!flag2){
							invalidateAll();
							flag2 = true;
						}
						storedLength = value?.length || 0;
						const text = new TextDecoder('utf-8').decode(value);
						if (text) {
							if (!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
								$readingStore.conclusion = text;
								storedConclusion = $readingStore.conclusion;
							}
						}
					}
				}
			})
	};

	let getReading = () => {
		if (loading) return;
		loading = true;
		actionState = 0;
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
				customSpread: $customSpreadsStore.find((spread) => spread.name === $readingStore.setting),
				tokenCost: tokenCost
			})
		})
			.then(async (res) => {
				console.log(res);
				$achievementsStore = { action: 'StartReading', value: 'default' };
				const reader = res.body?.getReader();
				let storedLength = 0;
				let flag = false;
				let flag2 = false;
				while (true && reader && !flag) {
					const { done, value } = await reader.read();
					if(storedLength === value?.length){
						console.log('done');
						loading = false;
						actionState = 1;
						$achievementsStore = { action: 'CompleteReading', value: 'default' };
						$readingStore.conclusion = $readingStore.conclusion + `
...`
						flag = true;
						invalidateAll();
						break;
					}else{
						if(!flag2){
							invalidateAll();
							flag2 = true;
						}
						storedLength = value?.length || 0;
						const text = new TextDecoder('utf-8').decode(value);
						if (text) {
							if (!(storedConclusion.length > 20 && text.length > 1.5 * storedConclusion.length)) {
								$readingStore.conclusion = text;
								storedConclusion = $readingStore.conclusion;
							}
						}
					}
				}
			})
	};

	let saveReading = () => {
		fetch('/api/saveReading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading: $readingStore,
			})

		})
		.then((res) => res.json())
		.then((res) => {
			console.log(res.body.reading.data[0].id);
			// Copy to clipboard
			navigator.clipboard.writeText(window.location.origin + '/reading/' + res.body.reading.data[0].id);
			secret(`Link copied to clipboard!`)
		})

	};
	
</script>

<div class="reading" bind:this={readingElem}>
	<div class="header">
		<h2>"{$readingStore.question}"</h2>
		{#if $readingStore.energy !== ''}
			<p class="info">Energy: {$readingStore.energy}</p>
		{/if}
	</div>
	<p class={'info ' + ($flippedCardsStore?.some((card) => card) ? 'faded' : '')}>
		Click the cards to start the reading
	</p>
	<div class="cards">
		{#each new Array($flippedCardsStore?.length) as card, i}
			<div>
				<p class="text-center">
					{(readingSpreads.get($readingStore.setting)?.positions &&
						readingSpreads.get($readingStore.setting)?.positions[i]) ||
						''}
					{$customSpreadsStore.find((spread) => spread.name === $readingStore.setting)?.positions[
						i
					] || ''}
				</p>
				<div class="stacked">
					{#if $readingStore.cards[i]}
						<div class="stacked">
							<!-- Back of card -->
							<div class={'card ' + ($flippedCardsStore[i] ? 'cardhidden ' : ' ') + 'ready'}>
								<img
									src={'/cards/' + $readingStore.cardback + '-200.webp'}
									alt=""
									class={$readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
									tabindex={$flippedCardsStore[i] ? -1 : 0}
									on:click={() => {
										flipCard(i);
									}}
									on:keydown={(event) => {
										if (event.key === 'Enter') {
											flipCard(i);
										}
									}}
								/>
							</div>
							<!-- Front of card -->
							<div class={'card ' + ($flippedCardsStore[i] ? '' : 'cardhidden')}>
								<img
									src={'/cards/' +
										_getCardImgName($readingStore.cards[i].name) +
										'-200' +
										($readingStore.art &&
										art
											.find((a) => a.suffix === $readingStore.art)
											?.decks.includes(getCardsPack($readingStore.cards[i].name) || 'anythingElse')
											? '-' + $readingStore.art
											: '') +
										'.webp'}
									alt=""
									tabindex={$flippedCardsStore[i] ? 0 : -1}
									class={'white ' +
										($readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow')}
									on:click={() => {
										infoBoxAppear($readingStore.cards[i]);
									}}
									on:keydown={(event) => {
										if (event.key === 'Enter') {
											infoBoxAppear($readingStore.cards[i]);
										}
									}}
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<p class={'info ' + ($flippedCardsStore?.every((card) => !card) ? 'faded' : '')}>
		Click the cards to learn more about them
	</p>
	{#if $readingStore.analysis.length > 0}
		<div class="analysis">
			<!-- Show hide -->
			<details open>
				<summary>Analysis</summary>
				<p>{$readingStore.analysis}</p>
			</details>
		</div>
	{:else if $readingStore.cards.length > 1 && actionState === 1}
		{#if analysisTokenCost <= $page.data.profile.data.tokens }
			<div>
				<button class="action analyse" on:click={() => analyseCards()}>Analyse Cards</button>
				<p class="cost">
					Costs {analysisTokenCost} tokens
					<span>({$page.data.profile.data.tokens} remaining)</span>
				</p>
			</div>
		{:else}
			<div>
				<p>Not enough tokens for card analysis</p>
			</div>
		{/if}
	{/if}
	{#if actionState}
		<div transition:fade>
			<div class="optionSelectWrapper">
				<p>Choose a reader</p>
				<ItemList items={listItems} />
			</div>
			<!-- Model select radio button, gpt-3.5-turbo && gpt-4 -->
			<div class="modelSelect">
				<p>Choose a model</p>
				<div class="radio">
					<input
						type="radio"
						id="gpt-3.5-turbo"
						name="model"
						value="gpt-3.5-turbo"
						checked={$readingStore.model === 'gpt-3.5-turbo'}
						on:change={() => ($readingStore.model = 'gpt-3.5-turbo')}
					/>
					<label for="gpt-3.5-turbo"
						>GPT-3.5 Turbo {characters.get($readingStore.character)?.model === 'gpt-3.5-turbo'
							? '(suggested)'
							: ''}</label
					>
				</div>
				<div class="radio">
					<input
						type="radio"
						id="gpt-4"
						name="model"
						value="gpt-4"
						checked={$readingStore.model === 'gpt-4'}
						on:change={() => ($readingStore.model = 'gpt-4')}
					/>
					<label for="gpt-4"
						>GPT-4 {characters.get($readingStore.character)?.model === 'gpt-4'
							? '(suggested)'
							: ''}</label
					>
				</div>
			</div>
			{#if tokenCost <= $page.data.profile.data.tokens}
				<div>
					<button class="startReading" on:click={() => getReading()}>
						{'Get ' + $readingStore.character + "'s interpretation"}
					</button>

					{#if $readingStore.analysis.length > 0}
						<button class="startReading" on:click={() => getReadingWithAnalysis()}>
							With Analysis
						</button>
					{/if}
				</div>
			{:else}
				<div>
					<p>Not enough tokens</p>
				</div>
			{/if}
			<p class="cost">
				Costs {tokenCost} token{tokenCost !== 1 ? 's' : ''} |
				<span>({$page.data.profile.data.tokens} remaining)</span>
			</p>
			<button class="cta" on:click={() => ($menuStateStore = { value: 5, change: true })}>
				Buy More Tokens
			</button>
			{#if $page.data.profile.data.tokens < 50}
				<p class="info">Regain up to 30 tokens at 12:00PM EST</p>
			{/if}
		</div>
	{/if}
	{#if $readingStore.conclusion.length > 0}
		<p class="info infoReader">
			Reader: {characters.get($readingStore.character)?.name}
			{characters.get($readingStore.character)?.title}
		</p>
	{/if}
	<p class="conclusion">
		{@html $readingStore.conclusion.trim()}
		<!-- {#if $readingStore.incomplete }
		<button class="btn-link" on:click={() => startReading()}>
			Continue the reading
		</button>
		{/if} -->
	</p>
	<div class="actions">
		{#if actionState || $readingStore.conclusion.endsWith('...') || $readingStore.incomplete || $readingStore.cards.length === 0}
			{#if $readingStore.conclusion.length > 0}
				<button class="btn-link" on:click={() => reset()}>Select a different reader</button>
				<button class="btn-link" on:click={() => saveReading()}>Share reading</button>
			{/if}
			<button class="btn-link" on:click={() => restart()}>New reading</button>
		{/if}
	</div>
</div>

<div>
	<InfoBox bind:isShown={infoBoxIsShown} {currentCard} />
</div>

<div bind:this={cardSelectPopup} class="fullScreenPopup hidden">
	<CardSelect bind:currentCard={currentSelectCard} bind:selectedCard />
</div>

<style lang="scss">
	.reading {
		margin-top: 2rem;
		padding-bottom: 0rem;
		text-align: center;
		& h2 {
			margin: 0.5rem;
		}
		.actions {
			display: flex;
			justify-content: center;
			gap: 1rem;
		}
		.cards {
			// display: grid;
			// grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			grid-gap: clamp(32px, 3vw, 64px);

			@media screen and (max-width: 600px) {
				grid-template-columns: repeat(1, 1fr);
			}
			& .card {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				transition: all 1s ease, opacity 0 0.5s ease;
				max-width: min(80vw, 400px);
				justify-self: center;
				perspective: 1200px;
				& p {
					width: 100%;
					text-align: center;
					white-space: break-spaces;
				}
				& img {
					margin: 1rem 0rem;
					width: 100%;
					max-width: min(80vw, 200px);
					border-radius: 0.25rem;
					border: 0.25rem solid #000;
					transition: all 1s ease;
					&.white {
						border: 0.25rem solid #fff;
					}
				}
				&.ready img {
					border: 4px solid #000;
					cursor: pointer;
					filter: drop-shadow(-8px 8px 16px rgba(243, 221, 154, 0.37))
						drop-shadow(8px -8px 16px rgba(46, 103, 132, 0.6));
				}
				&.notready {
					cursor: not-allowed;
					pointer-events: none;
				}
			}
		}
		.conclusion {
			margin: 1rem auto;
			padding: 0 1rem;
			max-width: 40rem;
			white-space: break-spaces;
		}
	}

	.cardhidden {
		z-index: 0;
		rotate: y 180deg;
		opacity: 0;
		pointer-events: none;
	}

	.cardhiddenReversed {
		z-index: 0;
		rotate: y 180deg z 180deg;
		opacity: 0;
		pointer-events: none;
	}
	.startReading {
		margin-top: 2rem;
		background-color: $accent;
		border: none;
		padding: 0.25rem 0.5rem;
		font-family: $other-font;
		font-size: $h4-font-size;
		cursor: pointer;
		&:first-of-type {
			margin-right: 1rem;
		}
	}
	.cta {
		cursor: pointer;
		background-color: $accent;
		border: none;
		padding: 0.25rem 0.5rem;
		font-family: $other-font;
		font-weight: 700;
	}
	.analysis {
		margin: auto;
		margin-top: 2rem;
		padding: 0 1rem;
		max-width: 40rem;
		white-space: break-spaces;
	}
	.analyse {
		margin-top: 1rem;
	}
	.cost {
		padding: 1rem 0rem 0.5rem;
	}
	.infoReader {
		margin-top: 2rem;
	}

	.cardGrow {
		animation: cardGrowAnim 0.5s ease forwards;
	}
	.cardGrowReversed {
		animation: cardGrowAnimReversed 0.5s ease forwards;
	}
	@keyframes cardGrowAnim {
		0% {
			opacity: 0.2;
			transform: scale(0.75);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes cardGrowAnimReversed {
		0% {
			opacity: 0.2;
			transform: scale(0.75) rotatex(0deg) rotateY(0deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotatex(180deg) rotateY(180deg);
		}
	}

	.optionSelectWrapper {
		margin-top: 1rem;
		> p {
			font-size: $h4-font-size;
		}
		& .optionSelect {
			max-width: 100vw;
			overflow: auto;
			display: inline-flex;
			gap: 1rem;
			padding: 1rem;
			&::-webkit-scrollbar {
				display: none;
			}
			.option {
				color: white;
				font-size: $base-font-size;
				font-family: $other-font;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: start;
				padding: 1rem 1rem;
				width: min-content;
				background: rgba($color: #000000, $alpha: 0.2);
				border-radius: 1rem;
				outline: none;
				border: 1px solid transparent;
				cursor: pointer;
				transition: all 0.2s ease;
				&::-webkit-scrollbar {
					display: none;
				}
				.imgWrapper {
					width: min(30vw, 6rem);
					aspect-ratio: 1/1;
					overflow: hidden;
					border-radius: 1rem;
					display: flex;
					align-items: center;
					justify-content: center;
					img {
						transition: all 1s ease;
					}
				}
				&:hover {
					background-color: rgba($color: #000000, $alpha: 0.4);
					& img {
						transform: scale(1.05);
					}
				}
				&.active {
					background-color: rgba($color: #000000, $alpha: 0.8);
					border: 1px solid #ffffff2c;
					& img {
						transform: scale(1.1);
					}
				}
				&:focus {
					border: 1px solid white;
				}
				& .optionText {
					margin-top: 0.5rem;
				}
				&.customOption {
					position: relative;
					&:hover {
						& .delete {
							opacity: 1;
							pointer-events: all;
						}
					}
					&:focus {
						& .delete {
							opacity: 1;
							pointer-events: all;
						}
					}
					& .delete {
						position: absolute;
						bottom: 0;
						transform: translateY(50%);
						width: 100%;
						background-color: red;
						border-radius: 0 0 1rem 1rem;
						border: none;
						font-family: $other-font;
						font-size: $base-font-size;
						opacity: 0;
						pointer-events: none;
						transition: all 0.25s ease;
						&:hover {
							background-color: #be0000;
							cursor: pointer;
						}
						&:focus {
							opacity: 1;
							pointer-events: all;
							outline: 1px solid white;
						}
					}
				}
			}
			.lockedOption {
				color: white;
				font-size: $base-font-size;
				font-family: $other-font;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: start;
				padding: 1rem 1rem;
				width: min-content;
				background: rgba($color: #000000, $alpha: 0.2);
				border-radius: 1rem;
				outline: none;
				border: 1px solid transparent;
				cursor: pointer;
				transition: all 0.2s ease;
				&::-webkit-scrollbar {
					display: none;
				}
				.imgWrapper {
					width: min(30vw, 6rem);
					aspect-ratio: 1/1;
					overflow: hidden;
					border-radius: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					img {
						transition: all 1s ease;
					}
				}
				&:hover {
					background-color: rgba($color: #000000, $alpha: 0.4);
					& img {
						transform: scale(1.05);
					}
				}
				&:focus {
					border: 1px solid white;
				}
				& .optionText {
					margin-top: 0.5rem;
				}
			}
		}
	}
	.character {
		& .option:not(.lockedOption) {
			& .imgWrapper {
				&.active {
					border: 1px solid #ffffff;
				}
				& img {
					width: 100%;
				}
			}
		}
	}
	.lockedOption {
		& .imgWrapper {
			& img {
				width: 60%;
			}
		}
	}
	.fullScreenPopup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba($color: #000000, $alpha: 0.8);
		z-index: 100;
		overflow-y: scroll;
		padding-top: 4rem;
		padding-bottom: 2rem;
		transition: opacity 0.2s ease;
		backdrop-filter: blur(5px);

		& > div {
			background-color: white;
			border-radius: 1rem;
			padding: 2rem;
			max-width: 80vw;
			max-height: 80vh;
			overflow-y: scroll;
		}
	}
</style>
