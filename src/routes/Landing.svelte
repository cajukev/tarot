<script lang="ts">
	import Collection from './Collection.svelte';
	import Contents from './Contents.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import type { CollectionCard } from '$lib/cards';
	import InfoBox from './InfoBox.svelte';

	let recursiveInvalidate = (count: number) => {
		switch (count) {
			case 0:
				break;
			default:
				setTimeout(() => {
					if (!$page.data.profile) {
						invalidateAll();
					}
				}, 500);
				recursiveInvalidate(count - 1);
		}
	};
	onMount(() => {
		recursiveInvalidate(5);
	});

	let landingReading: ReadingType = {
		cards: [
			{
				name: 'The Magician',
				reversed: false,
				energy: {
					upright: ['Manifestation', 'Willpower'],
					reversed: ['Manipulation', 'Trickery']
				},
				meaning:
					'The Magician embodies <b>Manifestation</b> and <b>Willpower</b>, symbolizing the power to create and achieve goals.',
				reversedMeaning:
					'Reversed, The Magician warns of <b>Manipulation</b> and <b>Trickery</b>, suggesting deceit or dishonest intentions.'
			},
			{
				name: 'Wheel of Fortune',
				reversed: false,
				energy: {
					upright: ['Luck', 'Cycles'],
					reversed: ['Misfortune', 'Resistance']
				},
				meaning:
					'The Wheel of Fortune signifies <b>Luck</b> and <b>Cycles</b>, symbolizing destiny, change, and the ups and downs of life.',
				reversedMeaning:
					'In reverse, The Wheel of Fortune indicates <b>Misfortune</b> and <b>Resistance</b>, suggesting setbacks or an unwillingness to adapt.'
			},
			{
				name: 'The High Priestess',
				reversed: false,
				energy: {
					upright: ['Intuition', 'Mystery'],
					reversed: ['Secrets', 'Disconnection']
				},
				meaning:
					'The High Priestess signifies <b>Intuition</b> and <b>Mystery</b>, representing inner wisdom and spiritual insight.',
				reversedMeaning:
					'In reverse, The High Priestess indicates <b>Secrets</b> and <b>Disconnection</b>, suggesting hidden truths or emotional detachment.'
			}
		],
		energy: 'Beginnings',
		question: 'What is this website?',
		setting: '',
		conclusion: '',
		character: '',
		cardback: 'AITarot'
	};

	let flippedCards = [false, false, false];

	let flipCard = (index: number) => {
		flippedCards[index] = !flippedCards[index];
		console.log(flippedCards);
		if (flippedCards.every((card) => card)) {
			setTimeout(() => {
				onReadingStart();
			}, 500);
		}
	};

	let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

	let landingText = `Dear friend, you've come seeking answers about what this website can do. Let's see what the cards have to say and explore the hidden truths together.

The first card I've drawn for you is the <b>Magician</b>. This card hints at the transformative potential of this website. By embracing the tarot's guidance, you can gain valuable insights and discover new perspectives that may help you navigate through life's challenges. The Magician's presence indicates that the tools and resources offered by this website can truly empower you on your personal journey.

Next up is the <b>Wheel of Fortune</b>. This card represents the cycles of life and the many opportunities that come with them. The website offers a dynamic and engaging experience, inviting you to dive deeper into the world of tarot. By exploring the various spreads and unlocking additional card packs, you'll find that the website is constantly evolving, providing you with fresh insights and new ways to grow and learn.

Finally, we have the <b>High Priestess</b>. She is a symbol of intuition and mystery, reminding us that there's more to the website than meets the eye. Through deciphering the secret variables that determine the energy associated with your questions, you can unlock a deeper understanding of the tarot and your own inner wisdom. The High Priestess invites you to trust your instincts and delve into the enigmatic aspects of this website.

Peeking into the cards' wisdom, it's clear that this website offers an engaging and enlightening experience. With the power of AI-driven tarot readings, a wealth of spreads, and hidden secrets to uncover, you'll find a dynamic and enriching journey ahead. So, my friend, let's embrace the tarot's guidance and unlock its mysteries together.`;

	let landingTextArray = landingText.split(' ');

	let landingTextArrayIndex = 0;

	let landingTextInterval: any;

	let afterButton: HTMLElement;
	let onReadingStart = () => {
		landingTextInterval = setInterval(() => {
			if (landingTextArrayIndex < landingTextArray.length) {
				landingReading.conclusion += landingTextArray[landingTextArrayIndex] + ' ';
				landingTextArrayIndex++;
			} else {
				clearInterval(landingTextInterval);
				afterButton.classList.remove('hidden');
			}
		}, 30);
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

<div class="container screenPadding">
	<a href="/login"><div class="button">Login</div></a>
	<!-- Landing Reading -->

	<div class="reading">
		<div class="header">
			<h2>"{landingReading.question}"</h2>
			<p class="info">Energy: {landingReading.energy}</p>
		</div>
		<p class={!flippedCards.some((card) => !card) ? 'faded' : ''}>
			Click the cards to start the reading
		</p>
		<div class="cards">
			{#each new Array(landingReading.cards.length) as card, i}
				<div>
					<div class="stacked">
						{#if landingReading.cards[i]}
							<div class="stacked">
								<div class={'card ' + (flippedCards[i] ? 'cardhidden ' : ' ') + 'ready'}>
									<img
										src="/cards/cardback-200.webp"
										alt=""
										class={landingReading.cards[i].reversed
											? 'reversed cardGrowReversed'
											: 'cardGrow'}
										tabindex={flippedCards[i] ? -1 : 0}
										on:click={() => {
											flipCard(i);
										}}
										on:keydown={(e) => {
											if (e.key === 'Enter') {
												flipCard(i);
											}
										}}
									/>
								</div>

								<div class={'card ' + (flippedCards[i] ? '' : 'cardhidden')}>
									<img
										src="/cards/{_getCardImgName(landingReading.cards[i].name)}-200.webp"
										alt=""
										class={'white ' +
											(landingReading.cards[i].reversed ? 'reversed cardGrowReversed' : 'cardGrow')}
										tabindex={flippedCards[i] ? -1 : 0}
										on:click={() => {
											infoBoxAppear(landingReading.cards[i]);
										}}
										on:keydown={(e) => {
											if (e.key === 'Enter') {
												infoBoxAppear(landingReading.cards[i]);
											}
										}}
									/>
									<!-- <h3>
										{landingReading.cards[i].name}
										<span>
											{landingReading.cards[i].reversed ? ' reversed' : ''}
										</span>
									</h3> -->
									<!-- <p>{@html landingReading.cards[i].reversed ? landingReading.cards[i].reversedMeaning : landingReading.cards[i].meaning }</p> -->
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
    <p class={"info " + (flippedCards.every((card) => !card) ? 'faded' : '')}>
      Click the cards to learn more about them
    </p>
    <div class="conclusion">
      {#if landingReading.conclusion.length > 0 }
      <p class="info">Reader: Alex The Novice</p>
      {/if}
      <p class="">{@html landingReading.conclusion.trim() || ''}</p>
      <a href="/login" bind:this={afterButton} class="hidden"><div class="button">Sign up</div></a>
    </div>

	</div>
</div>
<div class="collection">
	<h1>Collection</h1>
	<Collection landing={true} />
</div>

<InfoBox bind:isShown bind:currentCard> </InfoBox>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;

		a {
			transition: all 1s ease-in-out;
			position: relative;
			text-decoration: none;
      display: flex;
      justify-content: center;
			&.hidden {
				opacity: 0;
				pointer-events: none;
				.button {
					transform: translateY(100%);
				}
			}
			.button {
				margin-top: 2rem;
				padding: 0.5rem 1.25rem;
				width: max-content;
				border: none;
				border-radius: 0.5rem;
				background: $accent;
				color: black;
				font-family: $header-font;
				font-size: $h4-font-size;
				font-weight: 700;
				cursor: pointer;
				transition: all 1s ease-in-out;
				&:hover {
					background: rgba($accent, 0.75);
				}
			}
		}
	}
	.reading {
		margin-top: 2rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		& h2 {
			margin-bottom: 0.5rem;
			~ p {
				&:last-of-type {
					margin-bottom: 2rem;
				}
			}
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
					max-width: min(80vw, 400px);
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

	.collection {
		padding-top: 2rem;
		padding-bottom: 4rem;
		// background-color: $bg2;
		text-align: center;
	}
</style>
