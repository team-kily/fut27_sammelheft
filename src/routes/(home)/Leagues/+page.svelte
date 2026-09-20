<script>
	import { onMount } from 'svelte';
	import {
		leaguesIndexStore,
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
	let filteredLeagues = [];
	let totals = {};       
	let clubTotals = {};   
	let expandedLeagueId = null;
	let isCounting = false;

	const BIT = { all: 1, noBase: 2, onlyBest: 4, onlyBestSpecial: 8 };

	onMount(() => {
		handleScroll(items);
		filterLeagues();
		requestIdleCallback ? requestIdleCallback(calcTotals) : setTimeout(calcTotals, 100);
	});

	function filterLeagues() {
		const q = ($sessionStore.searchQuery ?? '').toLowerCase().trim();
		const all = Object.entries($leaguesIndexStore.leagues ?? {}).map(([id, c]) => ({ ...c, id }));
		filteredLeagues = q ? all.filter((l) => (l?.name ?? '').toLowerCase().includes(q)) : all;
		filteredLeagues.sort((a, b) => a.sortId - b.sortId);
	}

	$: if($leaguesIndexStore) {
		filterLeagues();
		calcTotals()
	}

	async function calcTotals() {
		isCounting = true;
		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant || 'all';
		const bitMask = BIT[variant] ?? 0;
		const collected = new Set($collectedCardsStore);
		const impossible = new Set($impossibleCardsStore);
		const missed = new Set($missedCardsStore);

		const tmp = {};
		for (const l of filteredLeagues) {
			let total = 0, got = 0;
			for (const [rid, e] of Object.entries(rm)) {
				if (!e) continue;
				if (Number(l.id) === 2118) {
					if (e.l === 2118 || e.club === 114605) {
						if (variant !== 'all' && !(e.m & bitMask)) continue;
						total++;
						if (collected.has(+rid) || impossible.has(+rid) || missed.has(+rid)) got++;
					}
				} else if (e.l === Number(l.id)) {
					if (variant !== 'all' && !(e.m & bitMask)) continue;
					total++;
					if (collected.has(+rid) || impossible.has(+rid) || missed.has(+rid)) got++;
				}
			}
			tmp[l.id] = { total, collected: got };
		}
		totals = tmp;
		isCounting = false;

		if (expandedLeagueId) await calcClubTotals(expandedLeagueId);
	}

	async function calcClubTotals(leagueId) {
		const rm = $resourceMapStore?.data ?? {};
		const variant = $savedStores.displayedCardsVariant || 'all';
		const bitMask = BIT[variant] ?? 0;
		const collected = new Set($collectedCardsStore);
		const impossible = new Set($impossibleCardsStore);
		const missed = new Set($missedCardsStore);

		const league = $leaguesIndexStore.leagues[leagueId];
		const cTmp = {};

		for (const c of league.clubIds ?? []) {
			const clubId = String(c.id).includes('_') ? Number(c.id.split('_')[1]) : Number(c.id);
			let total = 0, got = 0;
			for (const [rid, e] of Object.entries(rm)) {
				if (!e) continue;
				if (e.club === clubId && (leagueId == 2118 || e.l === Number(leagueId))) {
					if (variant !== 'all' && !(e.m & bitMask)) continue;
					total++;
					if (collected.has(+rid) || impossible.has(+rid) || missed.has(+rid)) got++;
				}
			}
			cTmp[c.id] = { total, collected: got };
		}
		clubTotals = { ...clubTotals, [leagueId]: cTmp };
	}

	function toggleLeague(id) {
		expandedLeagueId = expandedLeagueId === id ? null : id;
		if (expandedLeagueId) calcClubTotals(expandedLeagueId);
	}
</script>

<svelte:window on:scroll={() => handleScroll(items)} />

<section class="grid grid-cols-1 gap-4 px-4 py-4">
	{#each filteredLeagues as league, i}
		<div
			bind:this={items[i]}
			class="border-2 pl-8 border-accent group/listItem relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:brightness-110 text-sm md:text-base"
			style="background:linear-gradient(110deg,var(--color-baseC) 30%,var(--color-accent) 70%);"
		>
			<!-- Liga-Kopf -->
			<button
				on:click={() => navToCardsSite('Leagues', league.id)}
				class="flex w-full items-center justify-between px-2 h-16 cursor-pointer"
			>
				<div class="flex items-center gap-2 md:gap-4 h-full">
					{#if league.cId === null}
						<img src="https://cdn.easysbc.io/fc27/clubs/114605.png" class="h-full py-4 contrast-75 hidden md:block" alt="" />
					{:else}
						<img src={`https://cdn.easysbc.io/fc27/countries/${league.cId}.png`} class="h-full py-6 hidden md:block" alt="" />
					{/if}
					<img
							src={`https://cdn.easysbc.io/fc27/leagues/dark/${league.id}.png`}
						alt=""
						class="h-full py-4 contrast-75"
						on:error={(e) => {
								e.currentTarget.src = `https://cdn.easysbc.io/fc27/leagues/${league.id}.png`;
							e.currentTarget.onerror = null;
						}}
					/>
					<span class="whitespace-nowrap">{league.name}</span>
				</div>
				<div class="flex items-center text-textC gap-2">
					{#if isCounting && !totals[league.id]}
						<span class="animate-pulse text-gray-400">…</span>
					{:else}
						<span>{totals[league.id]?.collected ?? 0}</span>/
						<span>{totals[league.id]?.total ?? 0}</span>
					{/if}
				</div>
			</button>

			<button
				class="absolute top-1/2 -translate-y-1/2 left-2 text-textC transition-transform duration-300 {expandedLeagueId === league.id ? 'rotate-90' : ''}"
				on:click={() => toggleLeague(league.id)}>➤
			</button>
		</div>

		<!-- Clubs -->
		{#if expandedLeagueId === league.id}
			<div class="grid md:grid-cols-2 px-2 md:px-8 gap-2">
				{#each league.clubIds ?? [] as cid, j}
					{@const club = clubTotals[league.id]?.[cid.id]}
					<button
						on:click={() => navToCardsSite('Clubs', cid.id)}
						class="flex pl-2 md:odd:pl-6 pr-2 md:even:pr-6 px-2 py-1 h-8 justify-between cursor-pointer text-xs md:text-base"
						style="background:linear-gradient(to {j % 2 === 0 ? 'left' : 'right'}, var(--color-accent) 40%, transparent 100%);"
						bind:this={items[i + 60 + j]}
					>
						<div class="flex h-full items-center gap-2 px-2">
							<img src={`https://cdn.easysbc.io/fc27/clubs/${cid.id}.png`} class="h-full contrast-75" alt="" />
							<span>{cid.name}</span>
						</div>
						<div class="flex gap-1 items-center">
							{#if isCounting && !club}
								<span class="animate-pulse text-gray-400">…</span>
							{:else}
								<span>{club?.collected ?? 0}</span>/<span>{club?.total ?? 0}</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	{/each}
</section>
