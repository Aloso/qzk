import type { Event, TimeVariant, WithSubmitter } from '$lib/events/types'

export interface FormValuesDescription {
	title: string
	descHtml: string
}

export interface FormValuesPlace {
	placeType: 'QZ' | 'PHYSICAL' | 'ONLINE'
	placeRoom: undefined | string
	placeName: string
	placeAddress: string
	placeUrl: string

	website: string
	pictureUrl: string
}

export interface FormValuesTime {
	time: FormTime[]
}

export interface FormTime {
	variant: TimeVariant
	start?: Date
	end?: Date
}

export interface FormValuesOrganisator {
	organizerName: string
	organizerEmail: string
	organizerPhone: string
	organizerWebsite: string
}

export interface FormValuesPersonalInfo {
	yourName: string
	yourEmail: string
	orgaNotes: string
}

export type FormValues = FormValuesDescription &
	FormValuesPlace &
	FormValuesTime &
	FormValuesOrganisator &
	FormValuesPersonalInfo

const emptyDefaults: FormValues = {
	title: '',
	descHtml: '',
	time: [{ variant: 'day' }],
	placeType: 'QZ',
	placeRoom: undefined,
	placeName: '',
	placeAddress: '',
	placeUrl: '',
	organizerName: '',
	organizerEmail: '',
	organizerPhone: '',
	organizerWebsite: '',
	website: '',
	pictureUrl: '',
	yourName: '',
	yourEmail: '',
	orgaNotes: '',
}

export function createEventPlanningDefaults() {
	let defaults = $state(emptyDefaults)

	return {
		get values() {
			return defaults
		},
		reset() {
			defaults = emptyDefaults
		},
		setToDraft(draft: Event & WithSubmitter) {
			defaults = {
				title: draft.title,
				descHtml: draft.descHtml,
				time: (draft.allTimes ?? draft.time).map(time => ({ ...time })),
				placeType: draft.place.room ? 'QZ' : draft.place.type,
				placeRoom: draft.place.room,
				placeName: draft.place.name,
				placeAddress: draft.place.address ?? '',
				placeUrl: draft.place.url ?? '',
				organizerName: draft.organizer?.name ?? '',
				organizerEmail: draft.organizer?.email ?? '',
				organizerPhone: draft.organizer?.phone ?? '',
				organizerWebsite: draft.organizer?.website ?? '',
				website: draft.website ?? '',
				pictureUrl: draft.pictureUrl ?? '',
				yourName: draft.submitter.name,
				yourEmail: draft.submitter.email,
				orgaNotes: draft.orgaNotes ?? '',
			}
		},
	}
}
