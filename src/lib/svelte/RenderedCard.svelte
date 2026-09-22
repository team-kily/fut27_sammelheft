<script>
	export let card,
		origin = 'default',
		displayMode = false,
		customCardSize,
		cardName;
	import {
		cardSizeStore,
		collectedCardsStore,
		impossibleCardsStore,
		missedCardsStore,
		cardSettingsStore,
		totsRedStore,
		totsBothStore
	} from '$lib/stores/savedStores';
	import { versionIndexStore } from '$lib/stores/sessionStores';
	import PlayStylesHelper from './Helper/PlayStylesHelper.svelte';

	const fallbackImg = 'https://cdn.easysbc.io/fc27/players/240333.png';
	const baseWidth = 180;

	$: cardWidth = origin === 'default' ? $cardSizeStore : customCardSize;
	$: cardHeight = Math.round((cardWidth * 400) / 320);
	$: scale = cardWidth / baseWidth;

	let isGoalkeeper =
		card?.preferredPosition === 'GK' ||
		card?.preferredPosition === 'TH' ||
		card?.preferredPosition === 'TW';

	const attributeLabels = {
		TW: ['DIV', 'HAN', 'KIC', 'REF', 'SPD', 'POS'],
		notTW: ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY']
	};
	$: labels = attributeLabels[isGoalkeeper ? 'TW' : 'notTW'];
	$: version = $totsRedStore.includes(card.resourceId)
		? $versionIndexStore?.versions?.[127]
		: ($versionIndexStore?.versions?.[card?.versionId] ?? {});

	let dynamicPos = card?.hasDynamicImage;
	function checkRealSize(e) {
		const img = e.currentTarget;
		const ratio = img.naturalHeight / img.naturalWidth;
		if (ratio < 1.3 && ratio > 0.7) {
			dynamicPos = false;
		} else {
			dynamicPos = true;
		}
	}

	function handleError(e) {
		e.currentTarget.src = `https://cdn.easysbc.io/fc27/players/${card.assetId}.png`;
	}

	$: primaryColor = version?.details?.primaryColor;
	$: secondaryColor = version?.details?.secondaryColor;
	$: tertiaryColor = version?.details?.tertiaryColor;

	$: isCollected = $collectedCardsStore.includes(card.resourceId);
	$: isImpossible = $impossibleCardsStore.includes(card.resourceId);
	$: isMissed = $missedCardsStore.includes(card.resourceId);
	$: shouldGray = (!isCollected || isImpossible || isMissed) && displayMode === false;
</script>

{#if card}
	<div class="card relative" style="width:{cardWidth}px; height:{cardHeight}px;">
		{#if isMissed}
			<div
				class="z-50 grayscale-0 absolute top-0 left-0 brightness-90 -rotate-10"
				style="width:{cardWidth * 0.6}px;"
			>
				<img src="/SVG/missed.svg" alt="Missed" />
			</div>
		{/if}

		<div
			class="flex items-center justify-center relative *:absolute contrast-100"
			class:contrast-50={isImpossible}
			class:grayscale-100={shouldGray}
			style="width:{baseWidth}px;
		       height:{(baseWidth * 400) / 320}px;
		       transform:scale({scale});
		       transform-origin: top left;
               color: {primaryColor};"
		>
			<!-- Impossible Label -->
			{#if isImpossible}
				<div class="top-13 -left-6 z-50 px-10 rounded -rotate-50 bg-black/80 text-white/60">
					Impossible
				</div>
			{/if}

			<!-- Card Background -->
			{#if $totsBothStore.includes(card.resourceId)}
				<img
					src={$versionIndexStore?.versions?.[127]?.details?.url}
					alt="TOTS Champions"
					class="pointer-events-none absolute w-full h-full object-fill"
				/>
				<img
					src={version?.details?.url}
					alt="TOTS"
					class="mask-diagonal pointer-events-none w-full h-full object-fill"
				/>

			<style>
          .mask-diagonal {
              -webkit-mask-image: linear-gradient(135deg, transparent 50%, black 50%);
              mask-image: linear-gradient(135deg, transparent 50%, black 50%);
              -webkit-mask-size: 100% 100%;
              mask-size: 100% 100%;
              -webkit-mask-repeat: no-repeat;
              mask-repeat: no-repeat;
          }
			</style>
			{:else}
				<img src={version?.details?.url} class="w-full h-full object-fill" alt="" />
			{/if}
			<!-- Player Image -->
			<img
				src={`https://cdn.easysbc.io/fc27/players/${card.resourceId}.png`}
				alt=""
				on:load={checkRealSize}
				on:error={(e) => {
					handleError(e);
				}}
				class={`max-w-full max-h-full object-contain ${dynamicPos ? '-top-2.5 left-0' : 'top-2.5 left-5 scale-70'}`}
			/>
			<!-- Rating and Pos -->
			<div class="top-[18%] left-[15%] flex flex-col items-center -space-y-2 font-b">
				<span class="text-[20px]">{card.rating}</span>
				<span class=" text-[10px]">{card.preferredPosition}</span>
			</div>
			<!-- Name  -->
			<div class="top-[64%] left-1/2 -translate-x-1/2 whitespace-nowrap font-b">
				{origin !== 'allCards' ? card.cardName : cardName}
			</div>
			<!-- Attributes -->
			<div class="flex justify-between w-[70%] top-[74%] left-1/2 -translate-x-1/2">
				{#each card?.attributes as attribute, i}
					<div class="flex flex-col items-center tracking-[-.5px]">
						<span class="text-[9px] font-b leading-1.5">{labels[i]}</span>
						<span class="text-[13px] font-b">{attribute}</span>
					</div>
				{/each}
			</div>
			<!-- Nation Club and League -->
			<div class="flex gap-1 top-[84.5%] left-1/2 -translate-x-1/2 justify-center items-center">
				<img
					src={`https://cdn.easysbc.io/fc27/countries/${card?.countryId}.png`}
					alt="."
					class="w-4.5 scale-y-[.95] text-[0px]"
				/>
				<img
					src={`https://cdn.easysbc.io/fc27/leagues/dark/${card?.leagueId}.png`}
					alt="."
					class="h-4 text-[0px]"
					on:error={(e) => {
						const img = e.currentTarget;
						img.src = `https://cdn.easysbc.io/fc27/leagues/${card?.leagueId}.png`;
						img.onerror = null;
					}}
				/>

				{#if card?.clubId !== 112658}
					<img
						src={`https://cdn.easysbc.io/fc27/clubs/dark/${card?.clubId}.png`}
						alt="."
						class="h-4 text-[0px]"
						on:error={(e) => {
							const img = e.currentTarget;
							img.src = `https://cdn.easysbc.io/fc27/clubs/${card?.clubId}.png`;
							img.onerror = null;
						}}
					/>
				{/if}
			</div>
			<!-- PlayStyles -->
			{#if $cardSettingsStore.showPlaystyles}
				<div
					class={`absolute left-[4.5%] flex flex-col gap-0.5 ${
						card?.playStylesPlus?.length === 1
							? 'top-[54%]'
							: card?.playStylesPlus?.length === 2
								? 'top-[44%]'
								: card?.playStylesPlus?.length === 3
									? 'top-[42%]'
									: card?.playStylesPlus?.length === 4
										? 'top-[40%]'
										: card?.playStylesPlus?.length === 5
											? 'top-[36%]'
											: 'top-[30%]'
					}`}
				>
					{#each card?.playStylesPlus as playStylePlusId}
						{#if $totsBothStore.includes(card.resourceId)}
							<PlayStylesHelper
								playStyleId={playStylePlusId}
								lineColor={$versionIndexStore?.versions?.[127]?.details?.secondaryColor}
								bgColor={$versionIndexStore?.versions?.[127]?.details?.primaryColor}
								class="size-5"
							/>
							{:else }
						<PlayStylesHelper
							playStyleId={playStylePlusId}
							lineColor={secondaryColor}
							bgColor={primaryColor}
							class="size-5"
						/>
							{/if}
					{/each}
				</div>
			{/if}
			<!-- Alternative Position -->
			{#if $cardSettingsStore.showAlternativePositions}
				<div class="top-[25%] right-[4%] flex flex-col gap-0.75 items-center">
					{#each card?.possiblePositions.filter((pos) => pos !== card?.preferredPosition) as position}
						<div
							style={`color: ${primaryColor}; background-color: ${secondaryColor}`}
							class="w-5 rounded border items-end flex justify-center text-center text-[7px] p-1 pt-1.25 leading-0 scale-y-125"
						>
							{position}
						</div>
					{/each}
				</div>
			{/if}
			<!-- Weak Foot and Skill Moves -->
			{#if $cardSettingsStore.showWeakFootAndSkillMoves}
				<div class="top-[59.5%] right-[4%] flex flex-col gap-0.75 items-center">
					<div
						style={`color: ${primaryColor}; background-color: ${secondaryColor}`}
						class="w-5 rounded border items-end flex justify-center text-center text-[7px] p-1 pt-1.25 leading-0 scale-y-125"
					>
						{card.preferredFoot.split('')[0]}
					</div>
					<div
						style={`color: ${primaryColor}; background-color: ${secondaryColor}`}
						class="w-5 rounded border items-center flex justify-center text-[7px] scale-y-105"
					>
						<span class="h-full items-center flex">{card?.skillMoves}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							class="size-1.5"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								d="m12 16.102l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293t.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064z"
							/></svg
						>
						<span>{card?.weakFoot}</span>
					</div>
				</div>
			{/if}
			<!-- SBC Icon -->
			{#if card?.sbcPrice && $cardSettingsStore.showLogosForSBC}
				<div class="absolute right-2 w-8 top-[84%]">
					<img
						src={`https://raw.githubusercontent.com/Flo-Kayser/db_fut27cards/refs/heads/main/staticData/sbcIcon.png`}
						alt="O"
					/>
				</div>
			{/if}
			<!-- OBJ Icon -->
			{#if card?.isObjective && $cardSettingsStore.showLogosForSBC}
				<div class="absolute right-2 w-8 top-[84%]">
					<img
						src={`https://raw.githubusercontent.com/Flo-Kayser/db_fut27cards/refs/heads/main/staticData/objIcon.png`}
						alt="O"
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}
