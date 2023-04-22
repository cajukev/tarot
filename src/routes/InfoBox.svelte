<script lang="ts">
	import { page } from '$app/stores';
	import { achievements } from '$lib/achievements';
	import type { CollectionCard } from '$lib/cards';
  import { energyGroups, energyList, energyMap } from '$lib/energies';
	import { objToMap } from '$lib/utils';
	import { fade } from 'svelte/transition';

  export let isShown = false;
  export let currentCard: CollectionCard | undefined = undefined;
  export let collection: boolean = false;


  $: if(isShown === true){
    infoBoxAppear(currentCard as CollectionCard);
  }
  let infoBox: HTMLDivElement;

  let infoBoxAppear = (card: CollectionCard) => {
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
      currentCard = undefined;
    }, 250);
  };

  let _getCardImgName = (name: string) => {
		return name.replace(/ /g, '_').replace(/'/g, '');
	};

	let achievementsMap = objToMap($page.data.profile?.data.achievements) || achievements;
	let achiementMACompleted: boolean = achievementsMap.get("AllMACards").completed;
	let achievementMAProgress: string[] = achievementsMap.get("AllMACards").progress;

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
		return energyGroups.get(energyMap.get(energyList.indexOf(energy) + 1)?.group || 0)?.color;
	};

  let reverseCard = () => {
    if(currentCard && collection){
      currentCard.reversed = !currentCard.reversed;
    }
  }
</script>

<div class="container">
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
						reverseCard();
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							e.stopPropagation();
							reverseCard()
						}
					}}
					class={currentCard?.reversed ? 'reversed' : ''}
					src="/cards/{_getCardImgName(currentCard.name)}-400.webp"
					alt=""
				/>
			{/if}
			<h3>
				{currentCard?.name}
        {#if !achiementMACompleted && achievementMAProgress.includes(currentCard?.name || '') && collection}
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

<style lang="scss">
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