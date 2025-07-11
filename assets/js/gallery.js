document.addEventListener("DOMContentLoaded", () => {
	let previousCount = 0;

	function optimizeGalleryLayout() {
		const grid = document.querySelector(".gallery-grid");
		if (!grid) return;

		const items = [...grid.querySelectorAll(".gallery-item")];
		const count = items.length;
		if (count === 0) return;

		if (count === previousCount && grid.classList.contains("optimized-layout"))
			return;
		previousCount = count;

		// Update item count class (e.g., items-4)
		grid.classList.remove(
			...[...grid.classList].filter((c) => c.startsWith("items-"))
		);
		grid.classList.add(`items-${count}`);

		// Skip applying layout classes on mobile
		if (window.innerWidth <= 768) return;

		// Get layout and apply classes
		const layout = getLayout(count);
		layout.forEach((className, index) => {
			if (items[index] && className) {
				items[index].classList.add(className);
			}
		});

		grid.classList.add("optimized-layout");
	}

	function getLayout(count) {
		const baseLayouts = {
			1: ["fullwidth"],
			2: ["square", "square"],
			3: ["tall", "square", "tall"],
			4: ["tall", "wide", "tall", "wide"],
			5: ["tall", "regular", "wide", "tall", "wide"],
			6: ["tall", "regular", "square", "tall", "regular", "square"],
			7: ["tall", "regular", "square", "regular", "wide", "regular", "regular"],
			8: [
				"tall",
				"wide",
				"regular",
				"square",
				"regular",
				"tall",
				"wide",
				"regular",
			],
			9: [
				"tall",
				"wide",
				"wide",
				"regular",
				"square",
				"regular",
				"regular",
				"tall",
				"wide",
			],
			10: [
				"fullwidth",
				"square",
				"wide",
				"tower",
				"regular",
				"regular",
				"wide",
				"regular",
				"wide",
				"regular",
			],
			11: [
				"fullwidth",
				"tower",
				"wide",
				"regular",
				"tall",
				"regular",
				"regular",
				"square",
				"regular",
				"regular",
				"regular",
			],
			12: [
				"fullwidth",
				"tower",
				"wide",
				"regular",
				"tall",
				"regular",
				"regular",
				"banner",
				"regular",
				"wide",
				"regular",
				"regular",
			],
			13: [
				"fullwidth",
				"square",
				"wide",
				"tall",
				"regular",
				"tower",
				"regular",
				"wide",
				"regular",
				"regular",
				"regular",
				"wide",
				"regular",
			],
			14: [
				"fullwidth",
				"square",
				"wide",
				"tall",
				"regular",
				"tower",
				"regular",
				"wide",
				"regular",
				"tall",
				"regular",
				"square",
				"regular",
				"regular",
			],
		};

		if (baseLayouts[count]) return baseLayouts[count];

		const layout = [...baseLayouts[14]];
		const extra = count - 14;
		const cycles = Math.floor(extra / 14);
		const remainder = extra % 14;

		for (let i = 0; i < cycles; i++) {
			layout.push(...baseLayouts[14]);
		}

		if (remainder) {
			layout.push(...baseLayouts[remainder]);
		}

		return layout;
	}

	// Initial layout
	optimizeGalleryLayout();

	// Debounced resize handler
	let resizeTimer;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			requestAnimationFrame(optimizeGalleryLayout);
		}, 150);
	});

	// Mutation observer for dynamic content
	const galleryContainer = document.querySelector("#gallery .container");
	if (galleryContainer) {
		const observer = new MutationObserver(() => {
			requestAnimationFrame(optimizeGalleryLayout);
		});
		observer.observe(galleryContainer, { childList: true, subtree: true });
	}
});
