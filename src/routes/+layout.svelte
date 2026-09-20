<script>
	import '../app.css';

	import GlobalMenu from '$lib/svelte/GlobalMenu.svelte';
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { themeStore } from '$lib/stores/savedStores';
	import { page } from '$app/stores';
	import { apiClient } from '$lib/apiClient';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		versionIndexStore,
		resourceMapStore,
		countriesIndexStore,
		leaguesIndexStore,
		playStylesStore
	} from '$lib/stores/sessionStores';

	// import { dev } from '$app/environment';
	// import { injectAnalytics } from '@vercel/analytics/sveltekit';

	// injectAnalytics({ mode: dev ? 'development' : 'production' });

	export let children;

	onMount(() => {
		[
			['index-data/versionIndex.json', versionIndexStore],
			['index-data/countriesIndex.json', countriesIndexStore],
			['index-data/leaguesIndex.json', leaguesIndexStore],
			['index-data/resourceMap.json', resourceMapStore],
			[
				'https://raw.githubusercontent.com/Flo-Kayser/db_fut27cards/refs/heads/main/staticData/playStyles.json',
				playStylesStore
			]
		].forEach(([url, store]) => {
			apiClient.fetchData(url).then(store.set);
		});

		if (browser) {
			const unsubscribe = themeStore.subscribe(({ colors }) => {
				if (!colors) return;
				for (const [name, value] of Object.entries(colors)) {
					document.documentElement.style.setProperty(name, value);
				}
			});
			onDestroy(unsubscribe);
		}

		if (window.location.pathname === '/') {
			goto('/Versions');
		}
	});

	const hideMenuOn = /^\/(?:(Countries|Leagues|Versions|Clubs)\/[^/]+|Batches\/\d+)$/;
</script>

<main class="relative select-none bg-tri">
	{#if !hideMenuOn.test($page.url.pathname)}
		<GlobalMenu />
	{/if}

	{@render children()}
</main>
