<script>
	import { resourceMapStore } from '$lib/stores/sessionStores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { savedStores, collectedCardsStore, impossibleCardsStore } from '$lib/stores/savedStores';

	let activeHref = '/Versions';

	const navItems = [
		{ href: 'Versions', label: 'Kartenübersicht' },
		{ href: 'Batches/All', label: 'Batches' },
		{ href: 'allCardsFrom', label: 'Alle Karten von' },
		{ href: 'FAQ', label: 'FAQ' },
		{ href: 'Settings/CardSettings', label: 'Einstellungen' }
	];

	const variantOptions = [
		{ value: 'all', label: 'Alle Karten' },
		{ value: 'noBase', label: 'Keine Basic Karten' },
		{ value: 'onlyBest', label: 'Beste Version' },
		{ value: 'onlyBestSpecial', label: 'Beste Special-Version' }
	];

	function getIcon(name) {
		switch (name) {
			case 'instagram':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></svg>`;
			case 'youtube':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"/></svg>`;
			case 'discord':
				return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12"/></svg>`;
		}
		return '';
	}

	const socialLinks = [
		{
			name: 'JulianFGU',
			url: 'https://www.instagram.com/julianfgu/',
			icon: 'instagram'
		},
		{
			name: 'Entwickler',
			url: 'https://www.instagram.com/flo.kysr/',
			icon: 'instagram'
		}
	];

	const otherLinks = [
		{
			url: 'https://www.youtube.com/@JulianFGU',
			icon: 'youtube'
		},
		{
			url: 'https://discord.gg/f65x7YYQVU',
			icon: 'discord'
		}
	];

	const BIT = {
		all: 1,
		noBase: 2,
		onlyBest: 4,
		onlyBestSpecial: 8
	};

	function matchesVariant(entry, variant) {
		if (!entry) return false;
		if (variant === 'all') return true;
		const mask = BIT[variant] ?? 0;
		return (entry.m & mask) !== 0;
	}

	$: totalCount = (() => {
		const variant = $savedStores.displayedCardsVariant;
		const rm = $resourceMapStore?.data ?? {};
		return Object.values(rm).filter((e) => matchesVariant(e, variant)).length;
	})();

	$: collectedCount = (() => {
		const variant = $savedStores.displayedCardsVariant;
		const rm = $resourceMapStore?.data ?? {};
		const allCollected = [...$collectedCardsStore, ...$impossibleCardsStore];
		return allCollected.filter((rid) => matchesVariant(rm[rid], variant)).length;
	})();

	$: {
	const path = $page.url.pathname.toLowerCase();

	if (path.startsWith('/versions') || path.startsWith('/countries') || path.startsWith('/clubs') || path.startsWith('/leagues')) {
		activeHref = '/Versions'; 
	}
	else if (path.startsWith('/batches')) {
		activeHref = '/Batches/All';
	}
	else if (path.startsWith('/allCardsFrom')) {
		activeHref = '/allCardsFrom';
	}
	else if (path.startsWith('/faq')) {
		activeHref = '/FAQ';
	}
	else if (path.startsWith('/settings')) {
		activeHref = '/Settings/CardSettings';
	}
	else {
		activeHref = '/allCardsFrom';
	}
	}

	$: isShowCounts = ['/Versions', '/Leagues', '/Countries'].some((p) =>
		$page.url.pathname.startsWith(p)
	);

</script>

<div class="w-full text-white sticky top-0 z-50 left-0 flex contrast-125 md:px-4 p-2">
	<!-- lg display -->
	<div class="w-full lg:flex hidden justify-between items-center">
		<nav class="flex -space-x-1">
			{#each navItems as item, i}
				<a
					href={'/' + item.href}
					class=" bg-accent py-2 px-1
				       first:[clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%)]
				       [clip-path:polygon(0_0,calc(100%-10px)_0%,100%_50%,calc(100%-10px)_100%,0_100%,10px_50%)]
				       last:[clip-path:polygon(0_0,100%_0%,100%_100%,0_100%,10px_50%)]"
				>
					<span
						class={`text-base w-full font-b py-2 px-5
						${
							i === 0
								? '[clip-path:polygon(0_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,0_100%)]'
								: i === navItems.length - 1
									? '[clip-path:polygon(2px_0,100%_0%,100%_100%,2px_100%,10px_50%)]'
									: '[clip-path:polygon(2px_0,calc(100%-8px)_0%,100%_50%,calc(100%-8px)_100%,2px_100%,10px_50%)]'
						}
						${activeHref === '/' + item.href ? 'bg-accent text-baseC' : 'bg-baseC text-textC'}
					`}
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>

		<div class="flex -space-x-2 contrast-125">
			<div
				class="bg-accent text-2xl font-black p-1 pr-2 flex items-center [clip-path:polygon(0_0,100%_0%,calc(100%-16px)_50%,100%_100%,0_100%)]"
			>
				<div
					class="flex gap-1 bg-baseC text-textC pr-6 px-3 py-1 [clip-path:polygon(0_0,calc(100%-1px)_0%,calc(100%-15px)_50%,calc(100%-1px)_100%,0_100%)]"
				>
					<span>Gesammelt:</span>
				</div>
			</div>
			<div
				class="bg-accent text-2xl font-black p-1 flex items-center [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,0_50%)]"
			>
				<div
					class="flex gap-1 bg-baseC text-textC px-3 pl-6 py-1 [clip-path:polygon(16px_0,100%_0%,100%_100%,16px_100%,2px_50%)]"
				>
					<span>{collectedCount}</span>/<span>{totalCount}</span>
				</div>
			</div>
		</div>

		<div
			class="fixed top-20 -left-36 flex divide-x-2 bg-black/80 p-1 py-2 transition-all duration-300 hover:left-0"
		>
			<div class="flex gap-2 pr-5 p-2 flex-col">
				{#each socialLinks as link}
					<a
						href={link.url}
						target="_blank"
						class="flex items-center gap-2"
						rel="noopener noreferrer"
						>{@html getIcon(link.icon)}<span>{link.name}</span>
					</a>
				{/each}
			</div>
			<div class="flex gap-2 pr-5 p-2 flex-col pl-4">
				{#each otherLinks as link}
					<a
						href={link.url}
						target="_blank"
						class="flex items-center gap-2"
						rel="noopener noreferrer">{@html getIcon(link.icon)}</a
					>
				{/each}
			</div>
		</div>
	</div>
	<!-- mobile display -->
	<div class="flex lg:hidden flex-col w-full gap-2 relative">
		<select
			class="px-3 py-2 text-textC outline-none bg-baseC border-4 border-accent w-full appearance-none"
			on:change={(e) => goto(e.target.value)}
			bind:value={activeHref}
		>
			{#each navItems as item}
				<option value={'/' + item.href}>{item.label}</option>
			{/each}
		</select>
		<span class="absolute right-2 top-3 text-xl pointer-events-none">☰</span>

		{#if isShowCounts}
			<div class="flex gap-2 justify-between flex-row-reverse">
				<div
					class="flex max-w-1/2 bg-baseC text-sm md:text-xl text-textC py-2 px-2 border-2 md:border-4 border-accent gap-2"
				>
					<span class="block md:hidden">Ges:</span>
					<span class="hidden md:block">Gesammelt:</span>
					<div class="flex gap-1">
						<span>{collectedCount}</span> /
						<span>{totalCount}</span>
					</div>
				</div>

				<div class="flex relative">
					<select
						class="px-3 py-2 text-textC text-xs md:text-lg bg-baseC border-2 md:border-4 border-accent appearance-none focus:outline-none pr-8"
						bind:value={$savedStores.displayedCardsVariant}
					>
						{#each variantOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
					<span class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none md:text-lg"
						>☰</span
					>
				</div>
			</div>
		{/if}

		<div class="bg-black/70 fixed top-27 md:top-32 right-0">
			<div class="flex gap-2 pr-5 p-2 flex-col">
				{#each otherLinks as link}
					<a
						href={link.url}
						target="_blank"
						class="flex items-center gap-2"
						rel="noopener noreferrer"
						>{@html getIcon(link.icon)}
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
