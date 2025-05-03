;(() => {
	'use strict'

	const menuButton = document.getElementById('burger-menu-button')
	const mobileNav = document.getElementById('mobile-nav')

	if (menuButton == null || mobileNav == null) {
		console.warn('could not make mobile nav interactive, an element is null')
		return
	}

	menuButton.addEventListener('click', () => {
		if (mobileNav.classList.contains('collapsing') || mobileNav.classList.contains('hidden')) {
			mobileNav.classList.remove('hidden')
			mobileNav.classList.remove('collapsing')
		} else {
			mobileNav.classList.add('collapsing')
		}
	})

	mobileNav.addEventListener('transitionend', () => {
		if (mobileNav.classList.contains('collapsing')) {
			mobileNav.classList.add('hidden')
			mobileNav.classList.remove('collapsing')
		}
	})

	for (const anchor of mobileNav.querySelectorAll('a, .a')) {
		anchor.addEventListener('click', () => {
			mobileNav.classList.add('collapsing')
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

	for (const searchButton of document.querySelectorAll('[data-search-button]')) {
		searchButton.addEventListener('click', () => {
			window.postMessage({ type: 'search' })
		})
	}
})()
