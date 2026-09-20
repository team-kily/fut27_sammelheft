<script>
	import { apiClient } from '$lib/apiClient';
	import { browser } from '$app/environment';

	import { onMount } from 'svelte';
	import { allBatchesIndexStore } from '$lib/stores/sessionStores';
	import RenderedCard from '$lib/svelte/RenderedCard.svelte';
	import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

	import { navToCardsSite } from '$lib/helpers/navigationHelper';

	onMount(() => {
		apiClient
			.fetchData('index-data/batches/index-other-batches.json')
			.then(allBatchesIndexStore.set);
	});
	let responsiveCardSize = 120;

	$: {
		if (browser) {
			if (window.innerWidth >= 1024) {
				responsiveCardSize = 200;
			} else if (window.innerWidth >= 768) {
				responsiveCardSize = 160;
			} else {
				responsiveCardSize = 120;
			}
		}
	}

	function countCollectedOrImpossible(batch) {
		if (!batch?.allIds) return 0;
		const collected = new Set([...$collectedCardsStore, ...$impossibleCardsStore]);
		return batch.allIds.filter((id) => collected.has(id)).length;
	}
</script>

<div class="flex flex-col gap-8">
	{#if Array.isArray($allBatchesIndexStore)}
		{#each $allBatchesIndexStore as batch}
			<button
				onclick={() => navToCardsSite('Batches', batch.id)}
				class="bg-fixed bg-size-[200%] bg-center cursor-pointer"
				style="background-image: url('https://cdn.easysbc.io/fc27/cards/e_22_0.png');"
			>
				<div class="backdrop-blur-xl py-6 px-4 backdrop-brightness-75">
					<div class="flex justify-between pb-2">
						<h2 class="text-3xl text-white text-shadow-lg/50 font-bold">{batch.name}</h2>
						<span class="text-3xl text-shadow-lg/50 text-white font-bold"
							>{countCollectedOrImpossible(batch)} / {batch.allIds.length}</span
						>
					</div>

					<div class="flex flex-wrap justify-center">
						{#each batch.highlightedPlayers ?? [] as card, i}
							<div
								class="
                                    {i >= 4 ? 'hidden lg:flex' : ''}
									{i >= 2 && i < 4 ? 'hidden md:flex' : ''}
								"
							>
								<RenderedCard
									{card}
									displayMode={true}
									customCardSize={responsiveCardSize}
									origin="batch"
								/>
							</div>
						{/each}
					</div>
				</div>
			</button>
		{/each}
	{/if}
</div>
