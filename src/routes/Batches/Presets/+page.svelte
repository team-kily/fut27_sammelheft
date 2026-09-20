<script>
        import { apiClient } from '$lib/apiClient';
        import { resourceMapStore, presetsBatchesStore } from '$lib/stores/sessionStores';
        import { collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';
        import RenderedCard from '$lib/svelte/RenderedCard.svelte';
        import { navToCardsSite } from '$lib/helpers/navigationHelper';
        import { browser } from '$app/environment';
        import { onMount } from 'svelte';

        let missingSpecial = [];
        let missingSpecialBest = [];
        let missingSpecial99 = [];
        let allSpecial99 = [];

        let responsiveCardSize = 120;

        function sortByRatingDesc(cards) {
                return [...cards].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        }

        async function generateMissingBatches() {
                const cardsNoBase = await apiClient.fetchData('core-data/cards-noBase.json');

                if ($resourceMapStore.data === undefined) {
                        const mapData = await apiClient.fetchData('index-data/resourceMap.json');
                        resourceMapStore.set(mapData);
                }

                const rm = $resourceMapStore.data ?? {};

                const collected = new Set([
                        ...$collectedCardsStore,
                        ...$impossibleCardsStore
                ]);

                // Alle 99er – unabhängig davon, ob gesammelt oder nicht
                allSpecial99 = sortByRatingDesc(
                        cardsNoBase.filter((card) => card.rating == 99)
                );

                missingSpecial = sortByRatingDesc(
                        cardsNoBase.filter((card) => !collected.has(card.resourceId))
                );

                missingSpecialBest = sortByRatingDesc(
                        missingSpecial.filter((card) => {
                                const e = rm[card.resourceId];
                                return e && e.m === 15;
                        })
                );

                missingSpecial99 = sortByRatingDesc(
                        missingSpecial.filter((card) => card.rating == 99)
                );

                const newBatches = [
                        {
                                id: 'all-99',
                                name: 'Alle 99er-Karten',
                                allIds: allSpecial99,
                                highlightedPlayers: [...allSpecial99]
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 6)
                        },
                        {
                                id: '210303',
                                name: 'Fehlende Special-Karten',
                                allIds: missingSpecial,
                                highlightedPlayers: [...missingSpecial]
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 6)
                        },
                        {
                                id: '160319',
                                name: 'Fehlende Beste Special-Karten',
                                allIds: missingSpecialBest,
                                highlightedPlayers: [...missingSpecialBest]
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 6)
                        },
                        {
                                id: '99',
                                name: 'Fehlende 99er-Karten',
                                allIds: missingSpecial99,
                                highlightedPlayers: [...missingSpecial99]
                                        .sort(() => Math.random() - 0.5)
                                        .slice(0, 6)
                        }
                ];

                presetsBatchesStore.set(newBatches);
        }

        onMount(() => {
                generateMissingBatches();
        });

        $: {
                if (browser) {
                        if (window.innerWidth >= 1024) responsiveCardSize = 200;
                        else if (window.innerWidth >= 768) responsiveCardSize = 160;
                        else responsiveCardSize = 120;
                }
        }
</script>

<div class="flex flex-col gap-8">
	{#if Array.isArray($presetsBatchesStore)}
		{#each $presetsBatchesStore as batch}
			{#if batch.allIds.length > 0}
				<button
					onclick={() => navToCardsSite('Batches', batch.id)}
					class="bg-fixed bg-size-[200%] bg-center cursor-pointer"
					style="background-image: url('https://cdn.easysbc.io/fc27/cards/e_150_0.png');"
				>
					<div class="backdrop-blur-xl py-6 px-4 backdrop-brightness-75">
						<div class="flex justify-between pb-2">
							<h2 class="text-3xl text-shadow-lg/50 text-white font-bold">
								{batch.name}
							</h2>

							<span class="text-3xl text-shadow-lg/50 text-white font-bold">
								{batch.allIds.length}
							</span>
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
			{/if}
		{/each}
	{/if}
</div>
