<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let items: ListItem[];

	// Add Horizonal drag to the container
	let container: HTMLElement;
	let isDown = false;
	let startX: number;
	let scrollLeft: number;

	onMount(() => {
		container.addEventListener('mousedown', (e) => {
			isDown = true;
			container.classList.add('active');
			startX = e.pageX - container.offsetLeft;
			scrollLeft = container.scrollLeft;
		});
		container.addEventListener('mouseleave', () => {
			isDown = false;
			container.classList.remove('active');
		});
		container.addEventListener('mouseup', () => {
			isDown = false;
			container.classList.remove('active');
		});
		container.addEventListener('mousemove', (e) => {
			if (!isDown) return;
			e.preventDefault();
			const x = e.pageX - container.offsetLeft;
			const walk = (x - startX) * 2; //scroll-fast
			container.scrollLeft = scrollLeft - walk;
			// console.log(walk);
		});
	});

	let itemIsDisabled = (item: ListItem) => {
		return item.bought || item.completed || item.available === false;
	};
</script>

<div class="container" bind:this={container}>
	{#each items as item}
		<div class={'item ' + (itemIsDisabled(item) ? 'disabled' : '')}>
			{#if item.exp}
				{#if item.exp <= $page.data.profile.data.experience}
					<p class="item-exp info">Acquired</p>
				{:else}
					<p class="item-exp info">{item.exp} exp</p>
				{/if}
			{/if}
			<button
				disabled={itemIsDisabled(item)}
				on:click={item.action}
				class={'item-img ' + (item.selected ? 'selected' : '')}
			>
				<img src={item.img} />
			</button>
			<p class="item-name info">{item.bought ? 'Bought' : item.name}</p>
			{#if item.description}
				<p class="item-description info">{item.description}</p>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		max-width: 100vw;
		overflow: auto;
		display: inline-flex;
		gap: 1rem;
		padding: 1rem;
		cursor: grab;
		&::-webkit-scrollbar {
			display: none;
		}
		.item {
			color: white;
			font-size: $mini-font-size;
			font-family: $other-font;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: start;
			width: min-content;
			border: 1px solid transparent;
			&.disabled {
				opacity: 0.5;
				order: 999;
				cursor: not-allowed;
				.item-img {
					cursor: not-allowed;
				}
			}
			.item-exp {
				margin-bottom: 0.5rem;
			}
			.item-img {
				border: none;
				background: rgba($color: #000000, $alpha: 0.3);
				border-radius: 1rem;
				width: 6rem;
				height: 6rem;
				transition: all 0.2s ease, outline 0s;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 3px solid rgba($color: #ffffff, $alpha: 0.0);

				img {
					transition: all 0.2s ease;
					border-radius: 0.5rem;
					max-width: 80%;
					max-height: 80%;
					width: 100%;
					object-fit: contain;
				}

				&:focus-visible {
					outline: 2px solid rgba($color: #ffffff, $alpha: 0.75) !important;
					outline-offset: 3px;
				}
				&:hover {
					background-color: rgba($color: #000000, $alpha: 0.4);
					img {
						transform: scale(1.05) translateX(0.5px);
					}
				}
				&.selected {
					background: rgba($color: #000000, $alpha: 0.8);
					border: 3px solid rgba($color: #ffffff, $alpha: 0.75);
					img {
						transform: scale(1.1) translateX(1px);
					}
				}
			}
			.item-name {
				margin-top: 0.5rem;
				text-align: center;
			}
			.item-description {
				margin-top: 0.5rem;
				text-align: center;
			}
		}
	}
</style>
