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
			document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' })
		}

		mobileNav.classList.toggle('extended')
	})
})()
