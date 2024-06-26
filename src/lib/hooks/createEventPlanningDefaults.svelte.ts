import type { Event, TimeVariant, WithSubmitter } from '$lib/events/types'

export interface FormValuesStep1 {
	title: string
	description: string

	placeType: 'QZ' | 'PHYSICAL' | 'ONLINE'
	placeRoom: undefined | string
	placeName: string
	placeAddress: string
	placeUrl: string

	website: string
	pictureUrl: string
}

export interface FormValuesStep2 {
	time: FormTime[]
}

export interface FormTime {
	variant: TimeVariant
	start?: Date
	end?: Date
}

export interface FormValuesStep3 {
	organizerName: string
	organizerEmail: string
	organizerPhone: string
	organizerWebsite: string
}

export interface FormValuesStep4 {
	yourName: string
	yourEmail: string
	orgaNotes: string
}

export type FormValues = FormValuesStep1 & FormValuesStep2 & FormValuesStep3 & FormValuesStep4

const emptyDefaults: FormValues = {
	title: '',
	description: '',
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
				description: draft.description,
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
