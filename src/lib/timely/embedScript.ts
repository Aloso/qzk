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
	insertBefore: Element
}

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

function clearFilterParams(src: string, paramsRegex: Record<string, RegExp>) {
	for (const filter in paramsRegex) {
		if (location.hash.match(paramsRegex[filter]) && src.match(paramsRegex[filter])) {
			src = src.replace(paramsRegex[filter], '')
		}
	}

	return src
}

function getFrame(name: string): Window | undefined {
	// @ts-expect-error The type definitions for this are incomplete
	return window.frames[name]
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

function messageEventListener(isValidOrigin: (event: MessageEvent) => boolean, baseSRC: URL) {
	return (triggeredEvent: MessageEvent) => {
		if (!isValidOrigin(triggeredEvent)) {
			console.warn(`${baseSRC.origin} <--> ${triggeredEvent.origin}`)
			return
		}

		console.debug(triggeredEvent.origin, triggeredEvent.data)

		const message: Message = JSON.parse(JSON.stringify(triggeredEvent.data))
		const iFrame = document.querySelector('.timely-frame:not(.timely-slider)') as HTMLIFrameElement

		const messageTimelyFrame = document.getElementById(message.timelyFrame)
		if (message.height && messageTimelyFrame && !message.timelyFrame.includes('-space-popup')) {
			messageTimelyFrame.style.height = 'calc(' + message.height + ')'
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

		if (message.urlUpdates) {
			window.history.pushState({}, '', '#' + unescape(message.urlUpdates))
		}

		if (iFrame.id) {
			if (message.timelyFilters) {
				getFrame(iFrame.id)!.postMessage({ timelyFilters: message.timelyFilters }, '*')
			}

			if (message.timelyLoggedInUserData) {
				getFrame(iFrame.id)!.postMessage(
					{ timelyLoggedInUserData: message.timelyLoggedInUserData },
					'*',
				)
			}

			if (message.timelySignOut) {
				getFrame(iFrame.id)!.postMessage({ timelySignOut: 1 }, '*')
			}
		}

		if (message.timelySpaceDetailsUrl) {
			const iFrameUrl = new URL(message.timelySpaceDetailsUrl)
			iFrameUrl.searchParams.set('timely_id', message.timelyFrame + '-space-popup')

			if (timelyIframePopup!.src !== iFrameUrl.href) {
				window.timelyOpenPopup!(iFrameUrl.href)

				const fragmentMatcher = /^#space=[0-9]+?(\?popup=1)?$/gm
				const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)
				if (isTimelyUrlFragment) {
					const urlNew = location.pathname + unescape(message.timelyUrlFragment)
					window.history.pushState({}, '', urlNew)
				}
			}
		}

		if (message.timelyEventDetailsUrl) {
			const fragmentMatcher = /^#event=[a-z0-9-_]+(;instance=[0-9]{14})?(\?popup=1)?$/gm
			const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)
			const iFrameUrl =
				message.timelyEventDetailsUrl +
				(message.timelyEventDetailsUrl.indexOf('?') > -1 ? '&' : '?') +
				'timely_id=' +
				message.timelyFrame +
				'-event-popup'

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
					window.history.pushState({}, '', location.pathname + unescape(message.timelyUrlFragment))
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
	}
}

export function run({ id, src, insertBefore }: RunArgs) {
	const paramsRegex = {
		// Format: YYYY-MM-DD
		startDate: /start_date=(\d{4}-\d\d-\d\d)/,
		endDate: /end_date=(\d{4}-\d\d-\d\d)/,
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

	const clientLocation = new URL(location.href)
	const baseSRC = new URL(src)
	baseSRC.searchParams.set('timely_id', id)

	const isValidOrigin = (event: MessageEvent) => {
		return clientLocation.origin == event.origin || baseSRC.origin == event.origin
	}

	src = clearFilterParams(baseSRC.href, paramsRegex)
	src += addFilterParams(paramsRegex)

	// Add main calendar frame
	// TODO: remove use of scrolling attribute, deprecated attribute
	insertElement(
		`<button id="timely-iframe-container" class="timely-button-focus-init"
			title=" " type="button"
			style="position: absolute !important; border: transparent !important; background-color: transparent !important; color: transparent !important;">Focus Button</button>
		<iframe id="${id}" name="${id}"
			sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-downloads"
			scrolling="${window.top === window.self ? 'no' : 'yes'}" src="${src}" class="timely-frame"></iframe>`,
		insertBefore,
	)

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

		const styleElement = document.createElement('style')
		styleElement.appendChild(
			document.createTextNode(embeddedButtonStyles + iFrameStyles + eventDetailsStyles),
		)
		document.head.appendChild(styleElement)

		window.addEventListener('message', messageEventListener(isValidOrigin, baseSRC), false)

		// Send scroll events to the frame for the lazy load.
		let timely_scroll: NodeJS.Timeout | null

		window.addEventListener(
			'scroll',
			() => {
				const timelyFrame = document.querySelector('.timely-frame:not(.timely-slider)') as
					| HTMLIFrameElement
					| undefined
				if (!timelyFrame || timelyFrame.src.includes('&range=today') || timely_scroll) {
					return
				}

				timely_scroll = setTimeout(() => {
					const scroll = document.documentElement?.scrollTop ?? document.body.scrollTop

					if (scroll > document.body.offsetHeight / 2 - window.innerHeight) {
						const f = document.querySelector('.timely-frame:not(.timely-slider)')!.id
						getFrame(f)!.postMessage({ loadMore: 1 }, '*')
					}

					setTimeout(() => (timely_scroll = null), 500)
				}, 50)
			},
			false,
		)

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
			document.body.style.overflow = ''
		}
	}

	const eventId = location.hash.match(/^#event=(\d+)(?=;instance|$)/)
	const eventSlug = location.hash.match(/^#event=([a-z0-9-_]+)/)

	/* Automatically open ED of the specified event */
	if (eventId || eventSlug) {
		const popup = location.href.match(/(\?|&)(popup=[1])/)

		const afterSlash: string | undefined = baseSRC.pathname.split('/')[1]
		const eventUrl = new URL(baseSRC.href)
		eventUrl.hash = ''
		eventUrl.search = ''
		eventUrl.pathname = `${afterSlash ?? ''}/event/${eventId ? eventId[1] : eventSlug![1]}`

		const instanceHash = location.hash.match(/;instance=(\d+)/)
		if (instanceHash) {
			if (eventId) {
				eventUrl.pathname += '/' + instanceHash[1]
			} else {
				eventUrl.searchParams.set('instance_id', instanceHash[1])
			}
		}

		eventUrl.searchParams.set('lang', 'de-DE')
		if (popup) {
			eventUrl.searchParams.set('popup', '1')
		}

		const requestToken = location.hash.match(/requestToken=([a-z0-9-_]+)/)
		if (requestToken && requestToken.length > 0) {
			eventUrl.searchParams.set('requestToken', requestToken[1])
		}

		setTimeout(() => {
			window.postMessage(
				{ timelyFrame: `${id}-details`, timelyEventDetailsUrl: eventUrl.href },
				'*',
			)
			window.addEventListener('keydown', (event) => {
				if (event.code === 'Tab') {
					window.postMessage({ timelyFrame: id, timelyFocusEvent: 1 }, '*')
				}
			})
		}, 500)
	}
}
