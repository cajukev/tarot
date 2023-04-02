<script lang="ts">
	import { db } from '$lib/db';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.scss';
	import { deviceStore } from '../stores';
	import Menu from './Menu.svelte';
	import type { PageData } from './$types';
	export let data: PageData;

	onMount(() => {
		if (window.matchMedia('(any-pointer: coarse)').matches) {
			$deviceStore.hasTouch = true;
		}
		if (matchMedia('(pointer:fine)').matches) {
			$deviceStore.hasMouse = true;
		}

		const {
			data: { subscription }
		} = db.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Quintessential&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="topShadow" />
<div class="bg"></div>
<div class="app">
	<!-- <Menu /> -->
	<slot />
</div>

<div class="dummy hidden" />

<style lang="scss">
	.app {
		min-height: 101vh;
		@media screen and (max-width: $breakpoint-2-1) {
			flex-direction: column;
			height: auto;
			position: relative;
		}
	}
	.bg{
		background-image: url("bg.svg");
		position: absolute;
		z-index: -2;
		width: 100%;
		height: 100vh;
		@media screen and (max-width: $breakpoint-2-1) {
			background-image: none;
		}
	}
	.topShadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50vh;
		background: linear-gradient(180deg, #050607 0%, rgba(5, 6, 7, 0) 100%);
		z-index: -1;
	}
</style>
