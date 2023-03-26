<script lang="ts">
	import readingScenarios from '$lib/readingScenarios';
	import { settingStore, readingStore, flippedCardsStore, cardFlipStore, flipLockStore } from '../stores';
	export let state: number;

	let readingScenario = readingScenarios.get($settingStore);
	let positions = readingScenario?.positions;
	let flippedCards = new Array(positions?.length).fill(false);
	// let flipLock = false;
	// $: {
	// 	flipLock = $flipLockStore;
	// }
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
		flippedCardsStore.set(flippedCards);
		cardFlipStore.set(index)
		// $flipLockStore = true;
	}

	let correctTitle = (title: string) => {
		return title
			.replace('The Justice', 'Justice')
			.replace('The Death', 'Death')
			.replace('The Wheel of Fortune', 'Wheel of Fortune')
			.replace('The Judgement', 'Judgment')
			.replace('The Judgment', 'Judgment')
			.replace('Judgment', 'Judgement')
			.replace('The King', 'King')
			.replace('The Queen', 'Queen')
			.replace('The Knight', 'Knight')
			.replace('The Page', 'Page')
			.replace('The One', 'One')
			.replace('The Two', 'Two')
			.replace('The Three', 'Three')
			.replace('The Four', 'Four')
			.replace('The Five', 'Five')
			.replace('The Six', 'Six')
			.replace('The Seven', 'Seven')
			.replace('The Eight', 'Eight')
			.replace('The Nine', 'Nine')
			.replace('The Ten', 'Ten')
			

	};


	let restart = () => {
		state = 1;
		document.body.scrollIntoView();
	};
	let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
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
								class={'card ' + (flippedCards[i] ? 'cardhidden ' : ' ') + 'ready'}
							>
								<img
									src="/cards/cardback-400.webp"
									alt=""
									class={$readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
									on:click={() => {
										// if(!$flipLockStore){
											flipCard(i)
										// }
									}}
								/>
							</div>

							<div class={'card ' + (flippedCards[i] ? '' : 'cardhidden')}>
								<img
									src="/cards/{_getCardImgName(correctTitle($readingStore.cards[i].name))}-400.webp"
									alt=""
									class={"white " + ($readingStore.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow')}
								/>
								<h3>{correctTitle($readingStore.cards[i].name)}<span>{$readingStore.cards[i].reversed ? " reversed" : ""}</span></h3>
								<!-- <p>{@html $readingStore.cards[i].reversed ? $readingStore.cards[i].reversedMeaning : $readingStore.cards[i].meaning }</p> -->
							</div>
						</div>
					{:else}
						<div class="stacked">
							<div class={'card cardmissing'}>
								<img src="/cards/cardback-400.webp" alt="" />
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
				transition: all 1s ease, opacity 0 0.5s ease;
				max-width: min(80vw,400px);;
				justify-self: center;
				perspective: 1200px;
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
				&.notready{
					cursor: not-allowed;
					pointer-events: none;
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
			transform: scale(0.75) rotatex(0deg) rotateY(0deg);;
		}
		100% {
			opacity: 1;
			transform: scale(1) rotatex(180deg) rotateY(180deg);;
		}
	}
</style>
