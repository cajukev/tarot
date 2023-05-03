<!-- TODO

	- Add a way to save toggle state of decks
	- update card in achievements on load
	
-->
<script lang="ts">
	import { cards, type CollectionCard, type CollectionDeck } from '$lib/cards';
	import { collectionStore } from '../stores';
	import { page } from '$app/stores';
	import { unlocks } from '$lib/unlocks';
	import { secrets } from '$lib/secrets';
	import InfoBox from './InfoBox.svelte';
	import ItemList from './ItemList.svelte';
	import { cardbacks } from '$lib/cardbacks';
	import { error } from '$lib/toastStubs';

	export let landing = false;

	let decks: CollectionDeck[] = [];

	let checkCollection = () => {
		decks = Array.from(cards.values())
		// For each deck, check if it's available in the collectionStore, if so set the decks value to that
		// If not, set it to true
		decks.forEach((deck) => {
			let inStorage = $collectionStore.find((d) => d.abbrv === deck.abbrv);
			if (inStorage) {
				deck.available = inStorage.available;
			} else {
				deck.available = false;
			}
		});
	}
	checkCollection();

	let toggleDeck = (deck: CollectionDeck) => {
		// If there is only 1 available deck, don't allow it to be toggled off
		if (decks.filter((d) => d.available).length === 1 && deck.available){
			error("There must be at least one deck available!");
			return;
		}
		deck.available = !deck.available;
		collectionStore.set(decks);
		decks = $collectionStore;
		setupItemList();
	};

	
	let itemList: ListItem[] = [
	]
	let _getCardImgName = (card: CollectionCard) => {
		return card.name.replace(/ /g, '_').replace(/'/g, '');
	};
	let setupItemList = () => {
		itemList = [];
		decks.forEach((deck, i) => {
			let img = cardbacks.find((c) => c.name === deck.name)?.image || _getCardImgName(deck.cards[0]) ;
			if((!unlocks.get(deck.abbrv) || $page.data.profile?.data.experience >= (unlocks.get(deck.abbrv)?.exp || 0)) && 
			(!secrets.has(deck.abbrv) || $page.data.profile?.data.secrets.includes(deck.abbrv) ) && 
			(!deck.pack || $page.data.profile?.data.bought_items.includes(deck.pack))){
				console.log(deck.name);
				itemList.push({
					id: i,
					name: deck.name,
					img: "/cards/"+img+"-120.webp",
					action: () => {
						toggleDeck(deck);
					},
					selected: deck.available
				});
			}
		});
		console.log(itemList);
	}
	setupItemList();


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

<div class="container">
	<div>
		<p class="info">
			You can click on a deck to enable / disable it for your next reading.
		</p>
		<ItemList items={itemList}></ItemList>
		<p class="info">
			You can click on a card to see more information about it.
		</p>
		{#each decks as deck}
		<div class="deck">
			
			{#if deck.available}
	
			<div class="header">
				<h3>
					{deck.name} 
					<!-- <label for={"check."+deck.name}>
						{#if !landing}
						<button id={"check."+deck.name} on:click={() => toggleDeck(deck)}>
							{deck.available ? '✅' : '❌'}
						</button>
						{/if}
					</label> -->
				</h3>
			</div>
			<div class="cards">
				{#each deck.cards as card}
					<div
						tabindex="0"
						on:click={() => {
							infoBoxAppear(card);
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								infoBoxAppear(card);
							}
						}}
						class="card"
					>
						<img
							src="/cards/{_getCardImgName(card)}-120.webp"
							srcset={`/cards/${_getCardImgName(card)}-120.webp 120w, /cards/${_getCardImgName(
								card
							)}-200.webp 200w`}
							alt={card?.name}
						/>
					</div>
					<div class="hiddenImg">
						<img
							src="/cards/{_getCardImgName(card)}-400.webp"
							alt={card?.name}
							loading="lazy"
						/>
					</div>
				{/each}
			</div>
			{/if}
		</div>
		{/each}
	</div>

	<InfoBox bind:isShown bind:currentCard collection={true}></InfoBox>
</div>

<style lang="scss">
	.container{
		text-align: center;
		display: relative;
	}
	h3 {
		font-family: $header-font;
		text-align: center;
		button{
			background: none;
			border: none;
			font-size: $h4-font-size;
		}
	}
	.deck:not(:first-of-type){
		margin-top: 2rem;
	}
	.cards {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		.card {
			width: max(60px, 8%);
			transition: all 0.1s ease;
			&:focus {
					cursor: pointer;
					transform: translateY(-0.25rem);
				}
			img {
				border-radius: 0.25rem;
				border: 2px solid white;
				width: 100%; 
				height: 100%;
				object-fit: cover;
				margin-top: -0.25rem;
				box-shadow: 0 0.5rem 1rem rgba(black, 0.5);
				transition: all 0.1s ease;
				
				&:focus {
					outline: none;
					transform: translateY(-0.25rem);
				}
			}
		}
		.hiddenImg {
			position: fixed;
			top: 0;
			left: 0;
			width: 0;
			height: 0;
			overflow: hidden;
			opacity: 0;
			visibility: hidden;
			pointer-events: none;
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
			min-height: 100%;
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
				.achievementIndicator{
					opacity: 0.5;
				}
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
