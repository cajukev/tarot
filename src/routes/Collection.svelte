<script lang="ts">
	import { cards, type CollectionCard, type CollectionDeck } from '$lib/cards';
	import { energyGroups, energyList, energyMap } from '$lib/energies';
	import { collectionStore } from '../stores';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { unlocks } from '$lib/unlocks';
	import { secrets } from '$lib/secrets';
	import { achievements, achievementsOrder } from '$lib/achievements';
	import { objToMap } from '$lib/utils';
	import { onMount } from 'svelte';

	export let landing = false;

	let decks: CollectionDeck[] = [];
	onMount(() => {
		if ($collectionStore.length === 0){
			for (let [key, deck] of cards.entries()) {
				decks.push(deck);
				deck.available = (!unlocks.get(deck.abbrv) || $page.data.profile?.data.experience >= (unlocks.get(deck.abbrv)?.exp || 0)) && (!secrets.has(deck.abbrv) || $page.data.profile?.data.secrets.includes(deck.abbrv) )
			}
		}
	});
	$:{
		$collectionStore = decks;
	}

	let currentCard: CollectionCard | undefined = undefined;

	let infoBox: HTMLDivElement;
	let isShown = false;

	let achievementsMap = objToMap($page.data.profile?.data.achievements) || achievements;
	let achiementMACompleted: boolean = achievementsMap.get("AllMACards").completed;
	let achievementMAProgress: string[] = achievementsMap.get("AllMACards").progress;

	let infoBoxAppear = (card: CollectionCard) => {
		isShown = true;
		infoBox.classList.add('visible');
		infoBox.scrollTop = 0;
		currentCard = card;
		setTimeout(() => {
			currentCard = card;
		}, 250);
	};

	let infoBoxHide = () => {
		isShown = false;
		infoBox.classList.remove('visible');
		setTimeout(() => {
			currentCard?.reversed && (currentCard.reversed = false);
			currentCard = undefined;
		}, 250);
	};

	let _getCardImgName = (card: CollectionCard) => {
		return card.name.replace(/ /g, '_').replace(/'/g, '');
	};

	let addColorsToMeaningText = (text: string) => {
		let newText = text;
		energyList.forEach((energy) => {
			newText = newText.replace(
				`<b>${energy}</b>`,
				`<b><span style="color: ${_getEnergyColor(
					energy
				)}; text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 8px rgba(255, 255, 255, 0.35);">${energy}</span></b>`
			);
		});
		return newText;
	};

	export let _getEnergyColor = (energy: string) => {
		console.log(energy, energyMap.get(energyList.indexOf(energy) + 1)?.group);
		return energyGroups.get(energyMap.get(energyList.indexOf(energy) + 1)?.group || 0)?.color;
	};
</script>

<div class="container">
	<div>
	<p class="info">
		You can click on a card to see more information about it. 
		{#if !landing}
		<br>You can click on the deck name to toggle a deck on or off.
		{/if}
	</p>
		{#each decks as deck}
		<div class="deck">
			
			{#if (!unlocks.get(deck.abbrv) || $page.data.profile?.data.experience >= (unlocks.get(deck.abbrv)?.exp || 0)) && (!secrets.has(deck.abbrv) || $page.data.profile?.data.secrets.includes(deck.abbrv) ) }
	
			<div class="header">
				<h3>
					<label for={"check."+deck.name}>{deck.name} 
						{#if !landing}
						<button id={"check."+deck.name} on:click={() => deck.available = !deck.available}>
							{deck.available ? '✅' : '❌'}
						</button>
						{/if}
					</label>
				</h3>
			</div>
			<div class="cards">
				{#each deck.cards as card}
					<div
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
					src="/cards/{_getCardImgName(currentCard)}-400.webp"
					alt=""
				/>
			{/if}
			<h3>
				{currentCard?.name}
				{#if !achiementMACompleted && achievementMAProgress.includes(currentCard?.name || '')}
					<span class="achievementIndicator">✨</span>
				{/if}
			</h3>
			{#if currentCard?.reversed}
				<h4 in:fade>Reversed</h4>
			{/if}
			{#if currentCard?.reversed === false}
				<p in:fade>
					{@html addColorsToMeaningText(currentCard?.meaning)}
					<span class="dummy energy" />
				</p>
			{:else if currentCard?.reversed === true}
				<p in:fade>
					{@html addColorsToMeaningText(currentCard?.reversedMeaning)}
					<span class="dummy energy" />
				</p>
			{/if}
			
		</div>
	</div>
</div>

<!-- <div>
	{#each [...energyGroups.values()] as group, i}
		<div class="energyGroup">
			<h3>{addColorsToMeaningText(group.title)}</h3>
			{#each [...energyMap.values()]
				.sort((a, b) => a.value.localeCompare(b.value))
				.filter((e) => e.group === i + 1) as energy}
				<div class="">
					<div class="energyName">{energy.value}</div>
				</div>
			{/each}
		</div>
	{/each}
</div> -->
<style lang="scss">
	.container{
		text-align: center;
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
			img {
				border-radius: 0.25rem;
				border: 2px solid white;
				width: 100%;
				height: 100%;
				object-fit: cover;
				margin-top: -0.25rem;
				box-shadow: 0 0.5rem 1rem rgba(black, 0.5);
				transition: all 0.1s ease;
				&:hover {
					cursor: pointer;
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
