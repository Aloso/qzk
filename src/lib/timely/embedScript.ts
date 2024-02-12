// NOTE: This script is taken as-is from Time.ly, converted to TypeScript, type errors fixed, then turned into a module.
// However, it still fundamentally works the same, so I do not own this code.

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

let timelyPopupInitialized = false

const getIframePopupContainer = () =>
	document.querySelector('.timely-iframe-popup-container') as HTMLDivElement | undefined
const getIframe = (id: string) => document.querySelector(id) as HTMLIFrameElement | undefined
const getIframePopup = () => getIframe('.timely-iframe-popup')

function timelyOpenPopup(iFrameUrl: string) {
	getIframePopupContainer()!.style.display = 'block'
	getIframePopup()!.src = iFrameUrl

	// Disable / Hide scrollbar of the main page when ED is open.
	document.body.style.overflow = 'hidden'
}

function timelyOpenEvent(iFrameUrl: string, iFrameName: string) {
	getIframe(iFrameName)!.src = iFrameUrl
}

function timelyClosePopup() {
	getIframePopupContainer()!.style.display = 'none'
	getIframePopup()!.src = 'about:blank' // Hide popup iFrame

	/* Remove url fragment without causing page to jump */
	history.pushState('', document.title, window.location.pathname + window.location.search)

	// Restore the body overflow style
	document.body.style.overflow = ''
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

const paramsRegex = [
	// Format: YYYY-MM-DD
	/start_date=(\d{4}-\d\d-\d\d)/,
	/end_date=(\d{4}-\d\d-\d\d)/,
	// Format: 123 or 123,124,125
	/categories=((\d+),?)+/,
	/tags=((\d+),?)+/,
	/venues=((\d+),?)+/,
	/organizers=((\d+),?)+/,
	/filter_groups=((\d+),?)+/,
	/filter_groups_?\d+?=((\d+),?)+/,
	// Format: 123-12345 or 123-12345,222-222 (event id - instance id)
	/ids=((\d+-\d+),?)+/,
]

function clearFilterParamsIn(src: string, hash: string, regExps: RegExp[]) {
	for (const regExp of regExps) {
		if (regExp.test(hash) && regExp.test(src)) {
			src = src.replace(regExp, '')
		}
	}
	return src
}

function hashFiltersToSearchString(hash: string, regExps: RegExp[]) {
	let params = ''

	for (const regExp of regExps) {
		const filterMatch = hash.match(regExp)
		if (filterMatch) {
			params += '&' + filterMatch[0]
		}
	}
	return params
}

function getFrame(name: string): Window | undefined {
	// @ts-expect-error The type definitions for this are incomplete
	return window.frames[name]
}

function messageEventListener(isValidOrigin: (event: MessageEvent) => boolean, baseSRC: URL) {
	return (triggeredEvent: MessageEvent) => {
		if (!isValidOrigin(triggeredEvent)) {
			console.warn(`${baseSRC.origin} <--> ${triggeredEvent.origin}`)
			return
		}

		const message: Message = JSON.parse(JSON.stringify(triggeredEvent.data))

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

		if (message.timelySpaceDetailsUrl) {
			const iFrameUrl = new URL(message.timelySpaceDetailsUrl)
			iFrameUrl.searchParams.set('timely_id', message.timelyFrame + '-space-popup')

			if (timelyIframePopup!.src !== iFrameUrl.href) {
				timelyOpenPopup(iFrameUrl.href)

				const fragmentMatcher = /^#space=[0-9]+?(\?popup=1)?$/gm
				const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)
				if (isTimelyUrlFragment) {
					const urlNew = location.pathname + unescape(message.timelyUrlFragment)
					window.history.pushState({}, '', urlNew)
				}
			}
		}

		if (message.timelyEventDetailsUrl) {
			handleEventDetailsOpen(message)
		}

		if (message.timelyClosePopup || message.timelyCloseSpaceDetails) {
			timelyClosePopup()
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
	const clientLocation = new URL(location.href)
	const baseSRC = new URL(src)
	baseSRC.searchParams.set('timely_id', id)

	const isValidOrigin = (event: MessageEvent) => {
		return clientLocation.origin == event.origin || baseSRC.origin == event.origin
	}

	src =
		clearFilterParamsIn(baseSRC.href, location.hash, paramsRegex) +
		hashFiltersToSearchString(location.hash, paramsRegex)

	// Add main calendar frame
	// TODO: remove use of scrolling attribute, deprecated attribute
	insertElement(
		`<button id="timely-iframe-container" class="timely-button-focus-init" type="button"
			style="position: absolute !important; border: transparent !important; background-color: transparent !important; color: transparent !important;">Focus Button</button>
		<iframe id="${id}" name="${id}"
			sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-downloads"
			src="${src}" class="timely-frame"></iframe>`,
		insertBefore,
	)

	// Add common CSS and iframe for ED just once
	if (!timelyPopupInitialized) {
		timelyPopupInitialized = true
		insertElement(
			`<div class="timely-iframe-popup-container" onclick="window.timelyClosePopup();">
						<iframe class="timely-iframe-popup" src="about:blank" id="${id}-event-popup" name="${id}-event-popup"
							sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-downloads"></iframe>
					</div>`,
			null,
		)

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

function handleEventDetailsOpen(message: Message) {
	if (!message.timelyEventDetailsUrl) return

	const fragmentMatcher = /^#event=[a-z0-9-_]+(;instance=[0-9]{14})?(\?popup=1)?$/gm
	const isTimelyUrlFragment = fragmentMatcher.test(message.timelyUrlFragment)

	const iframeUrl = new URL(message.timelyEventDetailsUrl)
	iframeUrl.searchParams.set('timely_id', `${message.timelyFrame}-event-popup`)

	const iframePopup = document.querySelector('.timely-iframe-popup') as
		| HTMLIFrameElement
		| undefined

	if (iframePopup!.src !== iframeUrl.href) {
		if (message.timelyDisplayPreference === 'popup') {
			timelyOpenPopup(iframeUrl.href)
		} else if (message.timelyDisplayPreference === 'new_tab' && isTimelyUrlFragment) {
			window.open(message.timelyUrlFragment, '_blank')
			return
		} else if (message.timelyDisplayPreference === 'same_page') {
			timelyOpenEvent(iframeUrl.href, message.timelyFrame)
			return
		}

		if (!('timelyDisplayPreference' in message)) {
			timelyOpenPopup(iframeUrl.href)
		}

		if (isTimelyUrlFragment) {
			window.history.pushState({}, '', location.pathname + unescape(message.timelyUrlFragment))
		}
	}
}
