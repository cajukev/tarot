<script lang="ts">
	import { cards, type CollectionCard, type CollectionDeck } from '$lib/cards';
	import { openai } from '$lib/openai';
	import type { ChatCompletionRequestMessage } from 'openai';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { deviceStore } from '../stores';
	let majorArcana: CollectionCard[] | undefined = cards.get('Major Arcana');

	let decks: CollectionDeck[] = [];
	for (let [key, value] of cards.entries()) {
		decks.push({ name: key, cards: value });
	}

	let currentCard: CollectionCard | undefined = undefined;

	let infoBox: HTMLDivElement;
	let isShown = false;

	let infoBoxAppear = (e: MouseEvent, card: CollectionCard) => {
		isShown = true;
		infoBox.classList.add('visible');
		infoBox.scrollTop = 0;
		currentCard = card;
	};

	let infoBoxHide = () => {
		isShown = false;
		infoBox.classList.remove('visible');
		setTimeout(() => {
			currentCard?.reversed && (currentCard.reversed = false);
			currentCard = undefined;
		}, 250);
	};
</script>

<div class="container sidePadding">
	<div class="">
		{#each decks as deck}
			<h2>{deck.name}</h2>
			<div class="deck">
				{#each deck.cards as card}
					<div
						on:click={(e) => {
							infoBoxAppear(e, card);
						}}
						class="card"
					>
						<img src="/cards/{card?.name}-200.webp" alt="" />
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<div
		bind:this={infoBox}
		class={'infoBox '}
		on:click={(e) => {
			infoBoxHide();
		}}
		on:keydown={(e) => {
			if (e.key === 'Escape') {
				infoBoxHide();
			}
		}}
	>
		<div class="infoBoxContent">
			{#if currentCard}
				<img
					on:click={(e) => {
						e.stopPropagation();
						if (currentCard) {
							currentCard.reversed = !currentCard?.reversed;
						}
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							e.stopPropagation();
							if (currentCard) {
								currentCard.reversed = !currentCard?.reversed;
							}
						}
					}}
					class={currentCard?.reversed ? 'reversed' : ''}
					src="/cards/{currentCard?.name}-400.webp"
					alt=""
				/>
			{/if}
			<h3>{currentCard?.name}</h3>
			{#if currentCard?.reversed}
				<h4 in:fade>Reversed</h4>
			{/if}
			{#if currentCard?.reversed === false}
				<p in:fade>
					{@html currentCard?.meaning}
					<span class="dummy energy" />
				</p>
			{:else if currentCard?.reversed === true}
				<p in:fade>
					{@html currentCard?.reversedMeaning}
					<span class="dummy energy" />
				</p>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.container {
	}
	h2 {
		margin-top: 2rem;
		font-family: $header-font;
		text-align: center;
	}
	h3 {
		font-family: $header-font;
	}
	.deck {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0rem;
		.card {
			width: max(80px, 9.0909%);
			padding-right: 0.25rem;
			img {
				border-radius: 0.25rem;
				border: 2px solid white;
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}

	.infoBox {
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 100;
		background-color: rgba($bg, 0.5);
		backdrop-filter: blur(5px) brightness(0.25);
		border-radius: 5px;
		padding: 0.5rem;
		padding-top: 2rem;
		transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
		text-align: center;
		top: 0 !important;
		left: 0 !important;
		overflow: auto;
		.infoBoxContent {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-bottom: 2rem;
			perspective: 1200px;
			h3 {
				margin-top: 0.5rem;
			}
			& img {
				width: 400px;
				max-width: 90vw;
				border-radius: 0.25rem;
				border: 2px solid white;
				box-shadow: inset 0px 0px 0px 4px #f00;
				transition: all 1s cubic-bezier(0.21, 0.96, 0.49, 0.96);
				&.reversed {
					transform: rotatex(180deg) rotateY(180deg);
				}
			}
			p {
				margin-top: 1rem;
				max-width: 30rem;
			}
			& h3 {
				font-family: $header-font;
			}
			& h4 {
				font-family: $header-font;
				font-size: $base-font-size;
				opacity: 0.8;
				font-weight: 100;
			}
		}
		&:not(.visible) {
			opacity: 0;
			transform: scale(0.9) translateY(1rem);
			pointer-events: none;
		}
	}
</style>
