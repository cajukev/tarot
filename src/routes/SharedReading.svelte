<script lang="ts">

    import { readingStore, customSpreadsStore } from "../stores";

    import readingSpreads from "$lib/readingSpreads";
    import { art } from "$lib/customization";
    import { getCardsPack, type CollectionCard } from '$lib/cards';
	import characters from "$lib/characters";
	import InfoBox from "./InfoBox.svelte";


    let infoBoxIsShown = false;
    let currentCard: CollectionCard;


    let infoBoxAppear = (card: CollectionCard) => {
		infoBoxIsShown = true;
		currentCard = card;
		setTimeout(() => {
			currentCard = card;
		}, 250);
	};

    let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

</script>

<div class="reading">
	<div class="header">
		<h2>"{$readingStore.question}"</h2>
		{#if $readingStore.energy !== ''}
			<p class="info">Energy: {$readingStore.energy}</p>
		{/if}
	</div>
	<div class="cards">
		{#each new Array($readingStore.cards?.length) as card, i}
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
							<!-- Front of card -->
							<div class='card '>
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
									tabindex=0
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
	<p class='info'>
		Click the cards to learn more about them
	</p>
	
		<p class="info infoReader">
			Reader: {characters.get($readingStore.character)?.name}
			{characters.get($readingStore.character)?.title}
		</p>
        <!-- model -->
        <p class="info ">
			Model: {$readingStore.model}
		</p>
	<p class="conclusion">
		{@html $readingStore.conclusion.trim()}
		<!-- {#if $readingStore.incomplete }
		<button class="btn-link" on:click={() => startReading()}>
			Continue the reading
		</button>
		{/if} -->
	</p>
</div>

<div>
	<InfoBox bind:isShown={infoBoxIsShown} {currentCard} />
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
