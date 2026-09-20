import { get } from 'svelte/store';
import { animationSettingsStore } from '$lib/stores/savedStores.js';

export function collectAnimation(card, btnEl) {
	const settings = get(animationSettingsStore);
	const rect = btnEl.getBoundingClientRect();

	const desiredH = window.innerHeight * 0.5;
	const scale = Math.max(1, desiredH / rect.height);
	const scaledW = rect.width * scale;
	const scaledH = rect.height * scale;

	const targetX = (window.innerWidth - scaledW) / 2;
	const targetY = (window.innerHeight - scaledH) / 2;

	const bgOverlay = document.createElement('div');
	Object.assign(bgOverlay.style, {
		position: 'fixed',
		inset: '0',
		zIndex: 50,
		pointerEvents: 'all',
		background: 'rgba(0,0,0,0.7)',
		opacity: '0',
		transition: 'opacity .3s ease'
	});
	document.body.appendChild(bgOverlay);
	requestAnimationFrame(() => (bgOverlay.style.opacity = '1'));

	const wrapper = document.createElement('div');
	Object.assign(wrapper.style, {
		position: 'fixed',
		top: '0',
		left: '0',
		width: `${rect.width}px`,
		height: `${rect.height}px`,
		zIndex: 100,
		pointerEvents: 'all',
		transformOrigin: 'top left',
		willChange: 'transform'
	});

	const colorClone = btnEl.cloneNode(true);
	const grayClone = btnEl.cloneNode(true);

	[colorClone, grayClone].forEach((clone) => {
		clone.querySelectorAll('*').forEach((el) => {
			el.classList.remove(
				'grayscale',
				'grayscale-100',
				'grayscale-200',
				'opacity-80',
				'brightness-50'
			);
			el.style.filter = 'none';
			el.style.opacity = '1';
		});
		Object.assign(clone.style, { position: 'absolute', inset: '0' });
	});

	Object.assign(grayClone.style, {
		filter: 'grayscale(1) drop-shadow(0 0 8px gold)',
		WebkitFilter: 'grayscale(1) drop-shadow(0 0 8px gold)',
		WebkitMaskImage:
			'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 60%)',
		maskImage:
			'linear-gradient(to right, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 60%)',
		WebkitMaskRepeat: 'no-repeat',
		maskRepeat: 'no-repeat',
		WebkitMaskSize: '200% 200%',
		maskSize: '200% 200%',
		WebkitMaskPosition: '0% 0%',
		maskPosition: '0% 0%'
	});

	wrapper.appendChild(colorClone);
	wrapper.appendChild(grayClone);
	document.body.appendChild(wrapper);

	const startX = rect.left;
	const startY = rect.top;

	wrapper
		.animate(
			[
				{ transform: `translate(${startX}px, ${startY}px) scale(1)` },
				{ transform: `translate(${targetX}px, ${targetY}px) scale(${scale})` }
			],
			{ duration: 600, easing: 'ease-in-out', fill: 'forwards' }
		)
		.finished
		.then(() => {

			const audio = new Audio(
				'https://cdn.jsdelivr.net/gh/Flo-Kayser/db_fut27cards/staticData/collect.mp3'
			);
			audio.volume = settings.soundVolume ?? 0.8;
			audio.play().catch(() => {});

			return grayClone
				.animate(
					[
						{ WebkitMaskPosition: '0% 0%', maskPosition: '0% 0%' },
						{ WebkitMaskPosition: '120% 0%', maskPosition: '120% 0%' }
					],
					{ duration: 800, easing: 'ease-out', fill: 'forwards' }
				)
				.finished;
		})
		.then(async () => {
			const delay = (settings.cardDisplayDuration ?? 1) * 1000;
			await new Promise((resolve) => setTimeout(resolve, delay));

			return wrapper
				.animate(
					[
						{ transform: `translate(${targetX}px, ${targetY}px) scale(${scale})` },
						{ transform: `translate(${startX}px, ${startY}px) scale(1)` }
					],
					{ duration: 600, easing: 'ease-in-out', fill: 'forwards' }
				)
				.finished;
		})
		.then(() => {
			bgOverlay.style.opacity = '0';
			setTimeout(() => bgOverlay.remove(), 300);
			wrapper.remove();
		});
}
