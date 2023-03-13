<script lang="ts">
	import readingScenarios from '$lib/readingScenarios';
	import { settingStore } from '../stores';
	export let reading: ReadingType;
	export let state: number;
	export let error: string;

	let readingScenario = readingScenarios.get($settingStore);
	let positions = readingScenario?.positions;
	$: {
		readingScenario = readingScenarios.get($settingStore)
		positions = readingScenario?.positions;
	};
	// Reading state
	let flippedCards: boolean[];
	$: {
		flippedCards = new Array(readingScenario?.positions.length).fill(false);
	}

	let flipCard = (index: number) => {
		flippedCards[index] = !flippedCards[index];
    if(index !== flippedCards.length - 1 || flippedCards.length !== 1){
      generateNextReading();
    }
	};

	let generateNextReading = () => {
		fetch('/api/tarotreading', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				reading
			})
		})
			.then((res) => res.json())
			.then((data) => data.body)
			.then((body: { conclusion?: string; reading?: ReadingType }) => {
				if (body.conclusion) {
					console.log(body.conclusion);
					state = 4; // conclusion
					error = body.conclusion;
				}
				if (body.reading) {
					console.log(body.reading);
					state = 3; // reading / inaccuracies
					reading = body.reading;
				}
			});
	};

	let correctTitle = (title: string) => {
		return title
			.replace('The Justice', 'Justice')
			.replace('The Death', 'Death')
			.replace('The Wheel of Fortune', 'Wheel of Fortune')
			.replace('The Judgement', 'Judgement');
	};


	let restart = () => {
		state = 1;
		reading = {
			question: '',
			energy: '',
			cards: [],
			setting: '',
			conclusion: ''

		};
		flippedCards = new Array(readingScenario?.positions.length).fill(false);
	};

</script>

<div class="reading">
	<h2>"{reading.question}"</h2>
	<div class="cards">
		{#each new Array(readingScenario?.positions.length) as card, i}
			<div>
				<p class="text-center">{positions && positions[i]}</p>
				<div class="stacked">
					{#if reading.cards[i]}
						<div class="stacked">
							<div
								class={'card ' + (flippedCards[i] ? 'cardhidden' : 'ready')}
								on:click={() => flipCard(i)}
							>
								<img
									src="/cards/cardback.webp"
									alt=""
									class={reading.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
								/>
							</div>

							<div class={'card ' + (flippedCards[i] ? '' : 'cardhidden')}>
								<img
									src="/cards/{correctTitle(reading.cards[i].title)}-400.webp"
									alt=""
									class={reading.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow'}
								/>
								<h3>{correctTitle(reading.cards[i].title)}<span>{reading.cards[i].reversed ? " | reversed" : ""}</span></h3>
								<p>{@html reading.cards[i].reading}</p>
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
	<p class="conclusion">{reading.conclusion || ""}</p>
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
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr) );
			grid-gap: clamp(32px, 3vw, 64px);
			
			@media screen and (max-width: 600px) {
				grid-template-columns: repeat(1, 1fr);
			}
			& .card {
				display: flex;
				flex-direction: column;
				align-items: center;
				transition: all 0.5s ease;
				max-width: 400px;
				justify-self: center;
				& p {
					width: 100%;
					text-align: center;
				}
				& img {
					margin: 1rem 0rem;
					width: 100%;
					max-width: 400px;
					border-radius: 20px;
					border: 0.5rem solid #000;
					transition: all 0.5s ease;
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
		}
	}

	.cardhidden {
		rotate: y 180deg;
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
		animation: cardGrowAnim 1s ease forwards;
	}
	.cardGrowReversed {
		animation: cardGrowAnimReversed 1s ease forwards;
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
