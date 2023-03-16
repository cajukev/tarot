<script lang="ts">
	import readingScenarios from '$lib/readingScenarios';
	import { settingStore, readingStore, flippedCardsStore, flippedCardStore } from '../stores';
	export let state: number;

	let readingScenario = readingScenarios.get($settingStore);
	let positions = readingScenario?.positions;
	let flippedCards = new Array(positions?.length).fill(false);
	$: {
		readingScenario = readingScenarios.get($settingStore)
		positions = readingScenario?.positions;
		flippedCards = new Array(positions?.length).fill(false);
	};

	$: {
		flippedCards = $flippedCardsStore;
	}

	let flipCard = (index: number) => {
		flippedCards[index] = !flippedCards[index];
		flippedCardStore.set(index)
	}

	let correctTitle = (title: string) => {
		return title
			.replace('The Justice', 'Justice')
			.replace('The Death', 'Death')
			.replace('The Wheel of Fortune', 'Wheel of Fortune')
			.replace('The Judgement', 'Judgement');
	};


	let restart = () => {
		state = 1;
	};

</script>

<div class="reading">
	<h2>"{$readingStore.question}"</h2>
	<div class="cards">
		{#each new Array(readingScenario?.positions.length) as card, i}
			<div>
				<p class="text-center">{positions && positions[i]}</p>
				<div class="stacked">
					{#if $readingStore.cards[i]}
						<div class="stacked">
							<div
								class={'card ' + (flippedCards[i] ? 'cardhidden ' : ' ') + (i === 0 || flippedCards[i-1]  ? 'ready' : '')}
							>
								<img
									src="/cards/cardback.webp"
									alt=""
									class={$readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
									on:click={() => {
										flipCard(i)
									}}
								/>
							</div>

							<div class={'card ' + (flippedCards[i] ? '' : 'cardhidden')}>
								<img
									src="/cards/{correctTitle($readingStore.cards[i].title)}-400.webp"
									alt=""
									class={$readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
								/>
								<h3>{correctTitle($readingStore.cards[i].title)}<span>{$readingStore.cards[i].reversed ? " | reversed" : ""}</span></h3>
								<p>{@html ($readingStore.cards[i].reading)?.trim() || ""}</p>
							</div>
						</div>
					{:else}
						<div class="stacked">
							<div class={'card cardmissing'}>
								<img src="/cards/cardback.webp" alt="" />
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
	<p class="conclusion">{@html ($readingStore.conclusion).trim() || ""}</p>
	<!-- Restart button -->
	<button on:click={() => restart()}>Restart</button>
</div>

<style lang="scss">
	.reading {
		margin-top: 2rem;
		text-align: center;
		& h2 {
			margin-bottom: 2rem;
		}
		.cards {
			// display: grid;
			// grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
			display: flex;
			flex-wrap: wrap;
			justify-content: space-evenly;
			grid-gap: clamp(32px, 3vw, 64px);
			
			@media screen and (max-width: 600px) {
				grid-template-columns: repeat(1, 1fr);
			}
			& .card {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				transition: all 0.75s ease;
				max-width: min(80vw,400px);;
				justify-self: center;
				& p {
					width: 100%;
					text-align: center;
					white-space: break-spaces;
					& li{
						margin: 0.5rem 0rem;
					}
				}
				& img {
					margin: 1rem 0rem;
					width: 100%;
					max-width: min(80vw,400px);;
					border-radius: 20px;
					border: 0.5rem solid #000;
					transition: all 0.75s ease;
				}
				&.ready img {
					cursor: pointer;
					filter: drop-shadow(-8px 8px 16px rgba(243, 221, 154, 0.37))
						drop-shadow(8px -8px 16px rgba(46, 103, 132, 0.6));
				}
				& h3{
					margin-bottom: 1rem;
					font-family: $header-font;
					& span{
						font-size: $base-font-size;
						opacity: 0.8;
						font-weight: 100;
					}
				}
			}
		}
		.conclusion {
			margin: 2rem auto 0rem;
			max-width: 40rem;
			white-space: break-spaces;
		}
	}

	.cardhidden {
		transition: opacity 0s;
		rotate: y 180deg;
		opacity: 0;
		pointer-events: none;
	}

	.cardhiddenReversed {
		transition: opacity 0s;
		rotate: y 180deg z 180deg;
		opacity: 0;
		pointer-events: none;
	}

	.cardmissing {
		opacity: 0.2;
		scale: 0.75;
		pointer-events: none;
		filter: blur(2px);
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
			transform: scale(0.75) rotate(0deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(180deg);
		}
	}
</style>
