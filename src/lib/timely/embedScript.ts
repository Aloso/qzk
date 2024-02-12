// NOTE: This script is taken as-is from Time.ly, converted to TypeScript, type errors fixed, then turned into a module.
// However, it still fundamentally works the same, so I do not own this code.

declare global {
	interface Window {
		timelyOpenPopup?: (iframeUrl: string) => void
		timelyClosePopup?: () => void
		timelyOpenEvent?: (iFrameUrl: string, iFrameName: string) => void
		timelyPopupInitialized?: boolean
	}
}

interface Message {
	height?: number
	timelyFrame: string
	timelyFilters?: unknown
	timelyLoggedInUserData?: unknown
	timelySignOut?: number
	timelySpaceDetailsUrl?: string
	timelyCloseSpaceDetails?: boolean
	timelyFocusEvent?: boolean
	timelyUrlFragment: string
	timelyEventDetailsUrl?: string
	timelyDisplayPreference?: string
	timelyClosePopup?: string
	urlUpdates?: string
}

interface RunArgs {
	id: string
	src: string
	width?: number
	maxHeight: number
	embeddedFES?: string
	accessToken?: string
	insertBefore: Element
}

export function run({
	id,
	src,
	width,
	maxHeight,
	embeddedFES,
	accessToken,
	insertBefore,
}: RunArgs) {
	function insertElement(str: string, element: Element | null) {
		const div = document.createElement('div')
		div.innerHTML = str
		if (element) {
			// TODO: use element.before(div)
			element.parentNode!.insertBefore(div, element)
		} else {
			document.body.appendChild(div)
		}
	}

	const embeddedButtonStyles = `
.timely-embedded-fes-btn {
 color: #8089a7;
 background-color: transparent;
 padding: 5px;
 font-size: 14px;
 border-radius: 5px;
 border: 1px solid #8089a7;
 display: inline-block;
 font-family: Sans-serif;
 width: -webkit-fit-content;
 width: -moz-fit-content;
 width: fit-content;
 text-align: center;
 text-transform: uppercase;
 cursor: pointer;
}
`
	const iFrameStyles = `
.timely-frame {
 display: block;
 position: relative;
 width: 100%; /* TODO: use vw units */
 border: none;
 margin: 0px auto;
 transition: none;
}
.timely-button-focus-init:focus {
 background-color: transparent !important;
 text-decoration: none !important;
 outline: none !important;
 color: transparent !important;
}
.timely-frame:not(.timely-slider) {
 height: 400px;
}
`
	const eventDetailsStyles = `
.timely-iframe-popup-container {
 display: none;
 position: fixed;
 left: 0;
 top: 0;
 width: 100vw;
 z-index: 100000;
 text-align: center;
 overflow-y: auto;
 -webkit-overflow-scrolling: touch;
 background: rgba(0,0,0,0.5);
 scrollbar-width: none; /* Firefox and IE */
}
.timely-iframe-popup-container::-webkit-scrollbar {
 display: none; /* Chrome and Safari */
}
.timely-iframe-popup {
 width: 100vw;
 height: 100vh;
 margin: 0px auto;
 padding: 0px;
 border: none;
 overflow: hidden;
}
`

	function clearFilterParams(src: string, paramsRegex: Record<string, RegExp>) {
		for (const filter in paramsRegex) {
			if (location.hash.match(paramsRegex[filter]) && src.match(paramsRegex[filter])) {
				src = src.replace(paramsRegex[filter], '')
			}
		}

		return src
	}

	function addFilterParams(paramsRegex: Record<string, RegExp>) {
		let params = ''
		const filters: Record<string, RegExpMatchArray | null> = {}

		for (const filter in paramsRegex) {
			filters[filter] = location.hash.match(paramsRegex[filter])
		}

		for (const filter in filters) {
			if (location.hash.match(paramsRegex[filter]) && src.match(paramsRegex[filter])) {
				src = src.replace(paramsRegex[filter], '')
			}

			const filterMatch = filters[filter]
			if (filterMatch && filterMatch.length) {
				params += '&' + filterMatch[0]
			}
		}
		return params
	}

	function isCustomDomain(host: string) {
		return (
			host.indexOf('.time.ly') === -1 &&
			host.indexOf('.timely.fun') === -1 &&
			host.indexOf('localhost') === -1
		)
	}

	function getFrame(name: string): Window | undefined {
		// @ts-expect-error The type definitions for this are incomplete
		return window.frames[name]
	}

	const clientLocation = new URL(location.href)
	const baseSRC = new URL(src)

	const isValidOrigin = (event: MessageEvent) => {
		return clientLocation.origin == event.origin || baseSRC.origin == event.origin
	}

	// /* Change id of the script so we won't initialize it again */
	// const initializedEmbeds = document.querySelectorAll('iframe[id^="timely-iframe-embed-"]').length
	// timely_script.id = 'timely-iframe-embed-' + initializedEmbeds.toString()
	src += (src.includes('?') ? '&' : '?') + 'timely_id=' + id

	// Check if we had a login using SSO. If we had, the Saml will return a requestToken in the client's URL
	const requestTokenParam = clientLocation.searchParams.get('requestToken')
	const requestTokenParamVerifier = /[a-z0-9]+/gm
	if (requestTokenParam && requestTokenParamVerifier.test(requestTokenParam)) {
		// We need to append the requestToken from Saml to the iframe source, so we can perform the login via Saml
		src += (src.indexOf('?') > -1 ? '&' : '?') + 'requestToken=' + requestTokenParam
		// Update client's page URL to don't show the requestToken sent by Saml
		clientLocation.searchParams.delete('requestToken')
		top!.window.history.replaceState(null, '', clientLocation.href)
	}

	// When using SSO, a state is used to know if the action was triggered by the FES button
	const state = clientLocation.searchParams.get('state')
	const stateParamVerifier = /[a-z0-9]+/gm
	if (state && stateParamVerifier.test(state)) {
		src += (src.indexOf('?') > -1 ? '&' : '?') + 'state=' + state
		clientLocation.searchParams.delete('state')
		top!.window.history.replaceState(null, '', clientLocation.href)
	}

	const accessTokenVerifier = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/gm
	if (accessToken && accessTokenVerifier.test(accessToken)) {
		src += (src.indexOf('?') > -1 ? '&' : '?') + 'access_token=' + accessToken
		clientLocation.searchParams.delete('access_token')
		top!.window.history.replaceState(null, '', clientLocation.href)
	}

	if (embeddedFES) {
		// Add embedded FES button
		insertElement(
			'<button type="button" class="timely-embedded-fes-btn" onclick="window.timelyOpenPopup(\'' +
				src +
				'\')">' +
				embeddedFES +
				'</button>',
			insertBefore,
		)
	} else {
		// TODO: remove use of scrolling attribute, deprecated attribute
		const isTop = window.top === window.self
		const iFrameName = id
		const isSlider = src.indexOf('slider') > -1
		const iFrameClass = 'timely-frame' + (isSlider ? ' timely-slider' : '')

		let iFrameStyle = ''
		if (maxHeight > 0 || width) {
			iFrameStyle += 'style="'
			if (maxHeight > 0) {
				iFrameStyle += 'max-height:' + maxHeight + 'px;'
			}
			if (width) {
				iFrameStyle += 'width:' + width + ';'
			}
			iFrameStyle += '"'
		}

		const paramsRegex = {
			// Format: YYYY-MM-DD
			startDate: /start_date=(\d\d\d\d-\d\d-\d\d)/,
			endDate: /end_date=(\d\d\d\d-\d\d-\d\d)/,
			// Format: 123 or 123,124,125
			categories: /categories=((\d+),?)+/,
			tags: /tags=((\d+),?)+/,
			venues: /venues=((\d+),?)+/,
			organizers: /organizers=((\d+),?)+/,
			filterGroups: /filter_groups=((\d+),?)+/,
			filterGroupsByIds: /filter_groups_?\d+?=((\d+),?)+/,
			// Format: 123-12345 or 123-12345,222-222 (event id - instance id)
			ids: /ids=((\d+-\d+),?)+/,
		}

		src = clearFilterParams(src, paramsRegex)
		src += addFilterParams(paramsRegex)

		// Add main calendar frame
		insertElement(
			`<button id="timely-iframe-container" class="timely-button-focus-init"
				title=" " type="button"
				style="position: absolute !important; border: transparent !important; background-color: transparent !important; color: transparent !important;">Focus Button</button>
			<iframe id="${iFrameName}" title="${iFrameName}" name="${iFrameName}"
				sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-downloads"
				scrolling="${isTop ? 'no' : 'yes'}" src="${src}" class="${iFrameClass}" ${iFrameStyle}></iframe>`,
			insertBefore,
		)
	}

	// Add common CSS and iframe for ED just once
	if (!window.timelyPopupInitialized) {
		window.timelyPopupInitialized = true
		const eventiFrameName = id + '-event-popup'
		insertElement(
			`<div class="timely-iframe-popup-container" onclick="window.timelyClosePopup();">
						<iframe class="timely-iframe-popup" src="about:blank" id="${eventiFrameName}"
							name="${eventiFrameName}" title="${eventiFrameName}"
							sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-downloads"></iframe>
					</div>`,
			null,
		)

		const stylesheet = embeddedButtonStyles + iFrameStyles + eventDetailsStyles

		if (document.getElementsByTagName('head').length) {
			const styleElement = document.createElement('style')
			styleElement.appendChild(document.createTextNode(stylesheet))
			document.head.appendChild(styleElement)
		} else {
			insertElement('<style>' + stylesheet + '</style>', insertBefore)
		}

		window.addEventListener(
			'message',
			(triggeredEvent) => {
				if (!isValidOrigin(triggeredEvent)) {
					console.warn(`${baseSRC.origin} <--> ${triggeredEvent.origin}`)
					return
				}

				const message: Message = JSON.parse(JSON.stringify(triggeredEvent.data))
				const iFrame = document.querySelector(
					'.timely-frame:not(.timely-slider)',
				) as HTMLIFrameElement

				if (
					message.height &&
					document.getElementById(message.timelyFrame) &&
					!message.timelyFrame.includes('-space-popup')
				) {
					document.getElementById(message.timelyFrame)!.style.height =
						'calc(' + message.height + ')'
				}

				const timelyFrame = getFrame(message.timelyFrame)
				const timelyEventPopupFrame = getFrame(message.timelyFrame + '-event-popup')
				const timelySpacePopupFrame = getFrame(message.timelyFrame + '-space-popup')
				const timelyIframePopup = document.querySelector('.timely-iframe-popup') as
					| HTMLIFrameElement
					| undefined

				if (message.timelyFrame && timelyFrame) {
					try {
						timelyFrame.postMessage({ topWindow: location.href }, '*')
					} catch (error) {
						// ignore
					}
				}

				if (message.timelyFrame && timelyEventPopupFrame) {
					timelyEventPopupFrame.postMessage({ topWindow: location.href }, '*')
				}

				// what is this???
				// if (message.urlUpdates && document.getElementsByClassName('timely-script').length == 1) {
				// 	window.history.pushState({}, '', '#' + unescape(message.urlUpdates))
				// }

				if (message.urlUpdates) {
					window.history.pushState({}, '', '#' + unescape(message.urlUpdates))
				}

				if (message.timelyFilters) {
					if (iFrame.id) {
						getFrame(iFrame.id)!.postMessage({ timelyFilters: message.timelyFilters }, '*')
					}
				}

				if (message.timelyLoggedInUserData) {
					if (iFrame.id) {
						getFrame(iFrame.id)!.postMessage(
							{ timelyLoggedInUserData: message.timelyLoggedInUserData },
							'*',
						)
					}
				}

				if (message.timelySignOut) {
					if (iFrame.id) {
						getFrame(iFrame.id)!.postMessage({ timelySignOut: 1 }, '*')
					}
				}

				if (message.timelySpaceDetailsUrl) {
					const fragmentMatcher = /^#space=[0-9]+?(\?popup=1)?$/gm
					const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)
					let iFrameUrl =
						message.timelySpaceDetailsUrl +
						(message.timelySpaceDetailsUrl.indexOf('?') > -1 ? '&' : '?') +
						'timely_id=' +
						message.timelyFrame +
						'-space-popup'

					if (accessToken) {
						iFrameUrl += '&access_token=' + accessToken
					}

					if (timelyIframePopup!.src !== iFrameUrl) {
						window.timelyOpenPopup!(iFrameUrl)
						if (isTimelyUrlFragment) {
							window.history.pushState(
								{},
								'',
								location.pathname + unescape(message.timelyUrlFragment),
							)
						}
					}
				}

				if (message.timelyEventDetailsUrl) {
					const fragmentMatcher = /^#event=[a-z0-9-_]+(;instance=[0-9]{14})?(\?popup=1)?$/gm
					const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)
					let iFrameUrl =
						message.timelyEventDetailsUrl +
						(message.timelyEventDetailsUrl.indexOf('?') > -1 ? '&' : '?') +
						'timely_id=' +
						message.timelyFrame +
						'-event-popup'
					if (accessToken) {
						iFrameUrl += '&access_token=' + accessToken
					}
					if (timelyIframePopup!.src !== iFrameUrl) {
						if (message.timelyDisplayPreference === 'popup') {
							window.timelyOpenPopup!(iFrameUrl)
						} else if (message.timelyDisplayPreference === 'new_tab' && isTimelyUrlFragment) {
							window.open(message.timelyUrlFragment, '_blank')
							return
						} else if (message.timelyDisplayPreference === 'same_page') {
							window.timelyOpenEvent!(iFrameUrl, message.timelyFrame)
							return
						}

						if (!('timelyDisplayPreference' in message)) {
							window.timelyOpenPopup!(iFrameUrl)
						}

						if (isTimelyUrlFragment) {
							window.history.pushState(
								{},
								'',
								location.pathname + unescape(message.timelyUrlFragment),
							)
						}
					}
				}

				if (message.timelyClosePopup) {
					window.timelyClosePopup!()
					setTimeout(() => {
						const scrollX = window.pageXOffset || document.documentElement.scrollLeft
						const scrollY = window.pageYOffset || document.documentElement.scrollTop
						document.getElementById('timely-iframe-container')!.focus()
						window.scrollTo(scrollX, scrollY)
					})
				}

				if (message.timelyCloseSpaceDetails) {
					window.timelyClosePopup!()
				}

				if (message.timelyFocusEvent) {
					if (message.timelyFrame && timelyEventPopupFrame) {
						timelyEventPopupFrame.postMessage({ focusEvent: 1 }, '*')
					}
					if (message.timelyFrame && timelySpacePopupFrame) {
						timelySpacePopupFrame.postMessage({ focusSpace: 1 }, '*')
					}
				}
			},
			false,
		)

		// Send scroll events to the frame for the lazy load.
		let timely_scroll: number | null

		window.addEventListener(
			'scroll',
			() => {
				const timelyFrame = document.querySelector('.timely-frame:not(.timely-slider)') as
					| HTMLIFrameElement
					| undefined
				if (!timelyFrame || timelyFrame.src.indexOf('&range=today') > -1 || timely_scroll) {
					return
				}

				timely_scroll = setTimeout(() => {
					const scroll =
						(document.documentElement && document.documentElement.scrollTop) ||
						document.body.scrollTop

					if (scroll > document.body.offsetHeight / 2 - window.innerHeight) {
						const f = document.querySelector('.timely-frame:not(.timely-slider)')!.id
						getFrame(f)!.postMessage({ loadMore: 1 }, '*')
					}

					setTimeout(() => (timely_scroll = null), 500)
				}, 50) as unknown as number
			},
			false,
		)

		// Store the default body overflow style for restoring when ED is closed.
		const defaultBodyOverflow = window.getComputedStyle(document.body).getPropertyValue('overflow')

		const getIframePopupContainer = () =>
			document.querySelector('.timely-iframe-popup-container') as HTMLDivElement | undefined
		const getIframe = (id: string) => document.querySelector(id) as HTMLIFrameElement | undefined
		const getIframePopup = () => getIframe('.timely-iframe-popup')

		// Open popup
		window.timelyOpenPopup = function (iFrameUrl: string) {
			getIframePopupContainer()!.style.display = 'block'
			getIframePopup()!.src = iFrameUrl

			// Disable / Hide scrollbar of the main page when ED is open.
			document.body.style.overflow = 'hidden'
		}

		// Open event
		window.timelyOpenEvent = function (iFrameUrl: string, iFrameName: string) {
			getIframe(iFrameName)!.src = iFrameUrl
		}

		// Close popup
		window.timelyClosePopup = function () {
			getIframePopupContainer()!.style.display = 'none'
			getIframePopup()!.src = 'about:blank' // Hide popup iFrame

			/* Remove url fragment without causing page to jump */
			history.pushState('', document.title, window.location.pathname + window.location.search)

			// Restore the body overflow style
			document.body.style.overflow = defaultBodyOverflow
		}
	}

	const eventId = location.hash.match(/^#event=(\d+)(?=;instance|$)/)
	const eventSlug = location.hash.match(/^#event=([a-z0-9-_]+)/)

	/* Automatically open ED of the specified event */
	if (eventId || eventSlug) {
		const popup = location.href.match(/(\?|&)(popup=[1])/)
		const customLang = src.match(/(\?|&)(lang=[a-z]{2}-[A-Z]{2})/)

		let eventUrl = baseSRC.protocol + '//' + baseSRC.host
		if (!isCustomDomain(baseSRC.host)) {
			const afterSlash: string | undefined = baseSRC.pathname.split('/')[1]
			eventUrl += '/' + (afterSlash ?? '') // calendar uid
		}

		eventUrl += '/event/' + (eventId ? eventId[1] : eventSlug![1])

		const instanceHash = location.hash.match(/;instance=(\d+)/)
		if (instanceHash) {
			eventUrl += (eventId ? '/' : '?instance_id=') + instanceHash[1]
		}

		if (customLang) {
			eventUrl += (eventUrl.indexOf('?') > -1 ? '&' : '?') + customLang[2]
		}

		if (popup) {
			eventUrl += (eventUrl.indexOf('?') > -1 ? '&' : '?') + 'popup=1'
		}

		const requestToken = location.hash.match(/requestToken=[a-z0-9-_]+/)
		if (requestToken && requestToken.length > 0) {
			eventUrl += (eventUrl.indexOf('?') > -1 ? '&' : '?') + requestToken[0]
		}

		if (accessToken) {
			eventUrl += (eventUrl.indexOf('?') > -1 ? '&' : '?') + 'access_token=' + accessToken
		}

		setTimeout(() => {
			window.postMessage({ timelyFrame: id + '-details', timelyEventDetailsUrl: eventUrl }, '*')
			window.addEventListener('keydown', (event) => {
				if (event.code === 'Tab') {
					window.postMessage({ timelyFrame: id, timelyFocusEvent: 1 }, '*')
				}
			})
		}, 500)
	}
}
