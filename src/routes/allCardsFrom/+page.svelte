<script>
	import { browser } from '$app/environment';
	import { apiClient } from '$lib/apiClient';
	import {
		savedStores,
		collectedCardsStore,
		impossibleCardsStore,
		missedCardsStore,
		cardSettingsStore,
		animationSettingsStore
	} from '$lib/stores/savedStores';
	import { assetIdToNameStore } from '$lib/stores/sessionStores';
	import RenderedCard from '$lib/svelte/RenderedCard.svelte';
	import { toggleCard } from '$lib/helpers/collectionHelpers';
	import { collectAnimation } from '$lib/helpers/cardAnimationHelper';
	import { onMount } from 'svelte';

	let search = '';
	let results = [];
	let selectedPlayer = null;
	let selectedPlayerCardName = null;
	let playerCards = [];

	let responsiveCardSize = 150;

	$: {
		if (browser) {
			if (window.innerWidth >= 768) {
				responsiveCardSize = 200;
			} else {
				responsiveCardSize = 150;
			}
		}
	}

	onMount(async () => {
		if (Object.keys($assetIdToNameStore).length === 0) {
			const data = await apiClient.fetchData('index-data/assetIdToName.json');
			assetIdToNameStore.set(data);
		}
	});

	$: {
		const allPlayers = $assetIdToNameStore ?? {};
		const term = search
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '');

		results = term
			? Object.entries(allPlayers)
					.filter(([_, name]) => {
						const normalized = name
							.toLowerCase()
							.normalize('NFD')
							.replace(/\p{Diacritic}/gu, '');
						return normalized.includes(term);
					})
					.slice(0, 100)
			: [];
	}
	async function handlePlayerSelect(assetId) {
		const playerFile = await apiClient.fetchData(`players/${assetId}.json`);
		if (!playerFile) return;

		search = '';
		results = [];
		selectedPlayer = playerFile.name;
		selectedPlayerCardName = playerFile.cardName;
		playerCards = Object.entries(playerFile)
			.filter(([key, _]) => key !== 'name' && key !== 'cardName')
			.map(([_, value]) => value);
	}

	$: collectedPlayerCards = playerCards.filter((card) =>
		$collectedCardsStore.includes(card.resourceId)
	);

	$: impossiblePlayerCards = playerCards.filter((card) =>
		$impossibleCardsStore.includes(card.resourceId)
	);

	function handleClick(e, card) {
		if (
			$collectedCardsStore.includes(card.resourceId) ||
			$impossibleCardsStore.includes(card.resourceId) ||
			$missedCardsStore.includes(card.resourceId) ||
			$savedStores.impossibleSwitch ||
			$savedStores.missedSwitch
		) {
			toggleCard(card.resourceId);
		} else {
			if ($cardSettingsStore.playAnimation) {
				collectAnimation(card, e.currentTarget);
				setTimeout(
					() => toggleCard(card.resourceId),
					($animationSettingsStore.cardDisplayDuration ?? 1) * 1000 + 2000
				);
			} else {
				toggleCard(card.resourceId);
			}
		}
	}
</script>

<div class="flex mt-4 md:mt-6 justify-center w-full min-h-[85vh]">
	<div
		class="relative w-[90%] h-full min-h-[85vh] bg-white/30 flex flex-col items-center p-2 gap-4"
	>
		<div class="w-full flex justify-end">
			<label class="inline-flex cursor-pointer items-center gap-2">
				<span class:text-white={!$savedStores.allCardsDisplaySwitch}>Sammelmodus</span>
				<input
					type="checkbox"
					class="peer sr-only"
					bind:checked={$savedStores.allCardsDisplaySwitch}
				/>
				<div
					class="relative h-6 w-11 rounded-full bg-accent peer-checked:bg-accent peer-focus:outline-none after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
				></div>
				<span class:text-white={$savedStores.allCardsDisplaySwitch}>Display Modus</span>
			</label>
		</div>

		<input
			type="text"
			bind:value={search}
			autocomplete="off"
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					if (results.length > 0) {
						handlePlayerSelect(results[0][0]);
					}
				}
			}}
			placeholder="Spieler suchen..."
			class="w-11/12 md:w-2/3 lg:w-1/2 px-4 py-2 text-lg font-black border border-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
		/>

		<div
			class="w-[87%] md:w-[65%] lg:w-[49%] absolute top-26 max-h-[70vh] z-[1000] overflow-y-auto bg-white/80 shadow"
		>
			{#if search && results.length === 0}
				<p class="p-4 text-gray-600 italic text-center">Keine Ergebnisse gefunden.</p>
			{:else if results.length > 0}
				<ul class="divide-y divide-gray-300">
					{#each results as [assetId, name]}
						<button
							on:click={() => handlePlayerSelect(assetId)}
							class="p-3 hover:bg-gray-100 w-full flex cursor-pointer justify-between items-center"
						>
							<span class="font-medium">{name}</span>
						</button>
					{/each}
				</ul>
			{/if}
		</div>

		{#if selectedPlayer}
			<p class="font-black text-white text-xl text-center">
				{selectedPlayer} hat bereits {playerCards.length} Karten gesammelt.
				<br />
				Du hast bereits {collectedPlayerCards.length +
					impossiblePlayerCards.length}/{playerCards.length}.
			</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each playerCards as card}
					<button
						style="cursor: {!$savedStores.allCardsDisplaySwitch ? 'pointer' : 'default'}"
						data-card-id={card.resourceId}
						on:click={(e) => {
							if (!$savedStores.allCardsDisplaySwitch) {
								handleClick(e, card);
							}
						}}
					>
						<RenderedCard
							{card}
							origin={'allCards'}
							customCardSize={responsiveCardSize}
							displayMode={$savedStores.allCardsDisplaySwitch}
							cardName={selectedPlayerCardName}
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
