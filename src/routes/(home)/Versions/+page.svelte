<script>
	import { onMount } from 'svelte';
	import {
		versionIndexStore,
		resourceMapStore,
		sessionStore
	} from '$lib/stores/sessionStores';
	import {
		savedStores,
		collectedCardsStore,
		impossibleCardsStore,
		missedCardsStore
	} from '$lib/stores/savedStores';
	import { handleScroll } from '$lib/helpers/listScrollControls';
	import { navToCardsSite } from '$lib/helpers/navigationHelper';

	let items = [];
	let filteredVersions = [];
	let totals = {};
	let isCounting = false;

	const BIT = { all:1, noBase:2, onlyBest:4, onlyBestSpecial:8 };

	onMount(() => {
		handleScroll(items);
		filterVersions();
		requestIdleCallback ? requestIdleCallback(calcTotals) : setTimeout(calcTotals, 100);
		calcTotals();
	});

	function filterVersions() {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($versionIndexStore?.versions ?? {}).map(([id, v]) => ({ ...v, id }));
		filteredVersions = q
			? all.filter(v => (v?.details?.name ?? '').toLowerCase().includes(q))
			: all;
		filteredVersions.sort((a,b) => new Date(b.details.createdAt) - new Date(a.details.createdAt));
	}

	$: if($versionIndexStore) {
		filterVersions();
		calcTotals()
	}

	async function calcTotals() {
		isCounting = true;
		const rm = $resourceMapStore?.data ?? {};
		const collected  = new Set($collectedCardsStore);
		const impossible = new Set($impossibleCardsStore);
		const missed = new Set($missedCardsStore);

		const tmp = {};
		for (const v of filteredVersions) {
			let total = 0, got = 0;
			for (const [rid, e] of Object.entries(rm)) {
				if (!e || String(e.v) !== String(v.id)) continue;
				total++;
				if (collected.has(+rid) || impossible.has(+rid) || missed.has(+rid)) got++;
			}
			tmp[v.id] = { total, collected: got };
		}
		totals = tmp;
		isCounting = false;
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section class="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-2 xl:grid-cols-3">
	{#each filteredVersions as version, i}
		{#if version.id !== "127"}
		<div
			bind:this={items[i]}
			class="relative flex h-16 w-full transform border-2 border-accent transition-all duration-300 group/listItem hover:-translate-y-1 hover:brightness-110"
			style="background:linear-gradient(110deg,var(--color-baseC) 30%,var(--color-accent) 70%);"
		>
			<button
				on:click={() => navToCardsSite('Versions', version.id)}
				class="relative flex h-full w-full items-center cursor-pointer justify-between px-2"
			>
				<div class="flex h-full items-center gap-2">
					<img src={version?.details?.url} class="h-full contrast-75 py-1" alt="" />
					<span>{version?.details?.name}</span>
				</div>
				<div class="flex h-full items-center text-textC">
					{#if isCounting && !totals[version.id]}
						<span class="animate-pulse text-gray-400">…</span>
					{:else}
						<span>{totals[version.id]?.collected ?? 0}</span> /
						<span>{totals[version.id]?.total ?? 0}</span>
					{/if}
				</div>
			</button>
		</div>
			{/if}
	{/each}
</section>
