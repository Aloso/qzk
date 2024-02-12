export interface TimelyMessage {
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
