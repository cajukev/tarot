<script lang="ts">
	import { page } from '$app/stores';
	import characters from '$lib/characters';
	import readingScenarios from '$lib/readingScenarios';
	import { getTokenCost, objToMap } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import {
		readingStore,
		flippedCardsStore,
		customScenariosStore,
		achievementsStore,
		menuStateStore
	} from '../stores';
	import type { CollectionCard } from '$lib/cards';
	import InfoBox from './InfoBox.svelte';
	export let state: number;

	let flipCard = (index: number) => {
		$flippedCardsStore[index] = !$flippedCardsStore[index];
		$achievementsStore = {
			action: 'FlipCard',
			value: $readingStore.cards[index].name
		};
	};

	// actionState 0: show actions
	// actionState 1: hide actions

	let actionState = 0;

	$: if($flippedCardsStore?.every((card) => card) && !$readingStore.conclusion){
		actionState = 1;
	}else{
		actionState = 0;
		loading = false;
	}

	let restart = () => {
		state = 1;
		document.body.scrollIntoView();
	};
	let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

	let tokenCost = 0;
	$: {
		tokenCost = getTokenCost(
			$flippedCardsStore?.length,
			characters.get($readingStore.character)?.model || 'default'
		);
	}
	let loading = false;
	let startReading = () => {
		if(loading === true) return;
		loading = true;
		$readingStore.ready = true;
		actionState = 0;
	};

	// Infobox state

	let currentCard: CollectionCard | undefined = undefined;

	let isShown = false;
	

	let infoBoxAppear = (card: CollectionCard) => {
		isShown = true;
		currentCard = card;
		setTimeout(() => {
			currentCard = card;
		}, 250);
	};
	
</script>

<div class="reading">
	<div class="header">
		<button class="restart" on:click={() => restart()}>Restart</button>
		<h2>"{$readingStore.question}"</h2>
		<p class="info">Energy: {$readingStore.energy}</p>
	</div>
	<p class={"info " + ($flippedCardsStore?.some((card) => card) ? 'faded' : '')}>
		Click the cards to start the reading
	</p>
	<div class="cards">
		{#each new Array($flippedCardsStore?.length) as card, i}
			<div>
				<p class="text-center">
					{(readingScenarios.get($readingStore.setting)?.positions &&
						readingScenarios.get($readingStore.setting)?.positions[i]) ||
						''}
					{$customScenariosStore.find((scenario) => scenario.name === $readingStore.setting)
						?.positions[i] || ''}
				</p>
				<div class="stacked">
					{#if $readingStore.cards[i]}
						<div class="stacked">
							<div class={'card ' + ($flippedCardsStore[i] ? 'cardhidden ' : ' ') + 'ready'}>
								<img
									src="/cards/cardback-200.webp"
									alt=""
									class={$readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
									tabindex={$flippedCardsStore[i] ? -1 : 0}
									on:click={() => {
										flipCard(i);
									}}
									on:keydown={
										(event) => {
											if (event.key === 'Enter') {
												flipCard(i);
											}
										}
									}
								/>
							</div>

							<div class={'card ' + ($flippedCardsStore[i] ? '' : 'cardhidden')}>
								<img
									src="/cards/{_getCardImgName($readingStore.cards[i].name)}-200.webp"
									alt=""
									tabindex={$flippedCardsStore[i] ? 0 : -1}
									class={'white ' +
										($readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow')}
										on:click={() => {
											infoBoxAppear($readingStore.cards[i]);
										}}
										on:keydown={
											(event) => {
												if (event.key === 'Enter') {
													infoBoxAppear($readingStore.cards[i]);
												}
											}
										}
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<p class={"info " + ($flippedCardsStore?.every((card) => !card) ? 'faded' : '')}>
		Click the cards to learn more about them
	</p>
	{#if actionState}
		<div transition:fade>
			{#if tokenCost <= $page.data.profile.data.tokens}
				<div>
					<button class="startReading" on:click={() => startReading()}>
						{'Get ' + $readingStore.character + "'s interpretation"}
					</button>
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
			<button class="cta" on:click={() => ($menuStateStore = { value: 6, change: true })}
				>Buy More Tokens</button
			>
			{#if $page.data.profile.data.tokens < 10}
				<p class="info">Regain up to 10 tokens at 12:00PM EST</p>
			{/if}
		</div>
	{/if}
	{#if $readingStore.conclusion.length > 0 }
	<p class="info infoReader">
		Reader: {characters.get($readingStore.character)?.name}
		{characters.get($readingStore.character)?.title}
	</p>
	{/if}
	<p class="conclusion">{@html $readingStore.conclusion.trim()}</p>
	<button class="restart bottom" on:click={() => restart()}>Restart</button>
</div>

<div>
	<InfoBox bind:isShown bind:currentCard></InfoBox>
</div>


<style lang="scss">
	.reading {
		margin-top: 2rem;
		padding-bottom: 5rem;
		text-align: center;
		& h2 {
			margin-bottom: 0.5rem;
			~ p {
				font-size: $mini-font-size;
				opacity: 0.8;
				&:last-of-type {
					margin-bottom: 2rem;
				}
			}
		}
		.restart {
			background: none;
			border: none;
			color: white;
			text-decoration: underline;
			font-size: $base-font-size;
			margin-bottom: 1rem;
			cursor: pointer;
			&.bottom {
				margin-top: 1rem;
			}
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
					& li {
						margin: 0.5rem 0rem;
					}
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
				& h3 {
					font-family: $header-font;
					& span {
						font-size: $base-font-size;
						opacity: 0.8;
						font-weight: 100;
					}
				}
			}
		}
		.conclusion {
			margin: 1rem auto 0rem;
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
	}
	.cta{
		cursor: pointer;
		background-color: $accent;
		border: none;
		padding: 0.25rem 0.5rem;
		font-family: $other-font;
		font-weight: 700;
	}
	.cost{
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
	
</style>
