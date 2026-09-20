<script>
	import { onMount } from 'svelte';
	import { countriesIndexStore, resourceMapStore, sessionStore } from '$lib/stores/sessionStores';
	import { savedStores, collectedCardsStore, impossibleCardsStore, missedCardsStore } from '$lib/stores/savedStores';
	import { handleScroll } from '$lib/helpers/listScrollControls';
	import { goto } from '$app/navigation';
	import { navToCardsSite } from '$lib/helpers/navigationHelper';

	let items = [];
	let filteredCountries = [];
	let totals = {};

	const BIT = {
		all: 1,
		noBase: 2,
		onlyBest: 4,
		onlyBestSpecial: 8
	};

	onMount(() => handleScroll(items));

	$: {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($countriesIndexStore.countries ?? {}).map(([id, c]) => ({
			...c,
			id
		}));

		filteredCountries = q
			? all.filter(
					(c) =>
						(c?.name ?? '').toLowerCase().includes(q) || (c?.deName ?? '').toLowerCase().includes(q)
				)
			: all;

		filteredCountries.sort((a, b) => a.sortId - b.sortId);
		handleScroll(items);

		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant;
		const bitMask = BIT[variant] ?? 0;
		const collected = new Set($collectedCardsStore);
		const impossible = new Set($impossibleCardsStore);
		const missed = new Set($missedCardsStore);

		const tmp = {};
		for (const c of filteredCountries) {
			const allCards = Object.entries(rm).filter(([rid, e]) => {
				if (!e || e.c !== Number(c.id)) return false;
				return variant === 'all' || (e.m & bitMask) !== 0;
			});

			const collectedIds = allCards
				.map(([rid]) => rid)
				.filter((rid) => collected.has(Number(rid)) || impossible.has(Number(rid)) || missed.has(Number(+rid)));

			tmp[c.id] = {
				total: allCards.length,
				collected: collectedIds.length,
				collectedIds
			};
		}
		totals = tmp;
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section class="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-3">
	{#each filteredCountries as country, i}
		<div
			bind:this={items[i]}
			class="relative flex h-16 w-full transform border-2 border-accent transition-all duration-300 group/listItem hover:-translate-y-1 hover:brightness-110"
			style="background:linear-gradient(110deg,var(--color-baseC) 30%,var(--color-accent) 70%);"
		>
			<button
				class="absolute right-0 -top-6 aspect-square rounded-t-sm cursor-pointer bg-accent px-2 text-2xl opacity-0 transition-opacity duration-300 group-hover/listItem:opacity-100"
			>
				☆
			</button>

			<button
				on:click={() => navToCardsSite('Countries', country.id)}
				class="relative flex h-full w-full items-center justify-between px-2 cursor-pointer"
			>
				<div class="flex h-full items-center gap-2">
					<img
						src={`https://cdn.easysbc.io/fc27/countries/${country.id}.png`}
						class="h-full py-4 contrast-75"
						alt="flagImg"
						on:error={(e) => {
							const img = e.currentTarget;
							img.src = 'https://cdn.easysbc.io/fc27/countries/21.png';
							img.onerror = null;
						}}
					/>
					<span>{country.deName}</span>
				</div>
				<div class="flex h-full items-center text-textC">
					<span>{totals[country.id]?.collected}</span>/<span>{totals[country.id]?.total}</span>
				</div>
			</button>
		</div>
	{/each}
</section>
