;(() => {
	'use strict'

	const menuButton = document.getElementById('burger-menu-button')
	const mobileNav = document.getElementById('mobile-nav')

	if (menuButton == null || mobileNav == null) {
		console.warn('could not make mobile nav interactive, an element is null')
		return
	}

	menuButton.addEventListener('click', () => {
		if (document.scrollingElement && document.scrollingElement.scrollTop !== 0) {
			// document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' })
		}

		mobileNav.classList.toggle('extended')
	})

	for (const anchor of mobileNav.querySelectorAll('a, .a')) {
		anchor.addEventListener('click', () => {
			mobileNav.classList.toggle('extended')
		})
	}

	/** @type {HTMLElement | null} */
	let extGroup = null

	for (const extender of document.querySelectorAll('[data-nav-extender]')) {
		extender.addEventListener('click', () => {
			const group = extender.parentElement.parentElement
			if (extGroup) {
				if (extGroup !== group) {
					extGroup.classList.toggle('extended')
					extGroup = group
				} else {
					extGroup = null
				}
			} else {
				extGroup = group
			}
			group.classList.toggle('extended')
		})
	}

	async function startSearch() {
		if (!window.__searchInitialized) {
			await new Promise(resolve => {
				window.addEventListener('message', function onMessage({ data }) {
					if (data && typeof data === 'object' && data.type === 'search-initialized') {
						window.removeEventListener('message', onMessage)
						resolve(undefined)
					}
				})
			})
		}
		window.postMessage({ type: 'search' })
	}
	for (const searchButton of document.querySelectorAll('[data-search-button]')) {
		searchButton.addEventListener('click', startSearch)
	}
})()
