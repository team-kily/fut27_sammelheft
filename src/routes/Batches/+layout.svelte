<script>
	export let children;
	import { page } from '$app/stores';
    import { goto } from '$app/navigation';

	const navItems = [
		{ href: '/Batches/All', label: 'Offizielle Batches' },
		{ href: '/Batches/TOTW', label: 'Alle TOTWs' },
		{ href: '/Batches/Presets', label: 'Inoffizielle Batches' }

	];

    $: activeHref = 
		navItems.find((item) => $page.url.pathname.includes(item.href))?.href

</script>

<div class="flex lg:px-20 py-2 lg:py-10">
	<div
		class="hidden lg:flex flex-col w-full p-2 backdrop:blur-2xl bg-white/30"
	>
		<nav class="flex text-textC px-4 w-full justify-around">
			{#each navItems as item}
				<a
					href={item.href}
					class="p-2 m-1 hover:bg-accent hover:text-baseC hover:translate-y-2 hover:brightness-125 font-bold transition-all duration-300 w-1/4 text-center"
					class:bg-accent={$page.url.pathname === item.href}
					class:translate-y-2={$page.url.pathname === item.href}
				>
					{item.label}
				</a>
			{/each}
		</nav>
		<div class="text-white p-4">
			{@render children()}
		</div>
	</div>
	<div class="lg:hidden w-full p-4 flex flex-col gap-4">
		<div class="relative">
			<select
				bind:value={activeHref}
				on:change={(e) => goto(e.target.value)}
				class="px-3 py-2 text-textC font-black outline-none bg-accent w-full appearance-none"
			>
				{#each navItems as item}
					<option value={item.href}>{item.label}</option>
				{/each}
			</select>
			<span
				class="absolute top-1/2 transform -translate-y-1/2 text-textC text-xl right-1 flex items-center pr-2 pointer-events-none"
				>☰</span
			>
		</div>
		<div class="relative bg-white/30 backdrop:blur-2xl p-4 text-white">
			{@render children()}
		</div>
	</div>
</div>
