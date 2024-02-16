import type { Event } from '$lib/events/types'

export interface FormValues {
	title: string
	description: string

	startDate: string
	startTime: string
	endDate: string
	endTime: string
	wholeDay: boolean

	placeType: 'QZ' | 'PHYSICAL' | 'ONLINE'
	placeRoom: undefined | string
	placeName: string
	placeAddress: string

	organizerName: string
	organizerEmail: string
	organizerPhone: string
	organizerWebsite: string

	website: string
	pictureUrl: string

	yourName: string
	yourEmail: string
}

const emptyDefaults: FormValues = {
	title: '',
	description: '',
	startDate: '',
	startTime: '',
	endDate: '',
	endTime: '',
	wholeDay: false,
	placeType: 'QZ',
	placeRoom: undefined,
	placeName: '',
	placeAddress: '',
	organizerName: '',
	organizerEmail: '',
	organizerPhone: '',
	organizerWebsite: '',
	website: '',
	pictureUrl: '',
	yourName: '',
	yourEmail: '',
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
		setToDraft(draft: Event) {
			defaults = {
				title: draft.title,
				description: draft.description,
				startDate: draft.time.start.split('T')[0],
				startTime: draft.time.start.split('T')[1] ?? '',
				endDate: draft.time.end?.split('T')[0] ?? '',
				endTime: draft.time.end?.split('T')[1] ?? '',
				wholeDay: !draft.time.start.includes('T'),
				placeType: draft.place.room ? 'QZ' : draft.place.type,
				placeRoom: draft.place.room,
				placeName: draft.place.name,
				placeAddress: draft.place.address ?? '',
				organizerName: draft.organizer?.name ?? '',
				organizerEmail: draft.organizer?.email ?? '',
				organizerPhone: draft.organizer?.phone ?? '',
				organizerWebsite: draft.organizer?.website ?? '',
				website: draft.website ?? '',
				pictureUrl: draft.pictureUrl ?? '',
				yourName: draft.submitter.name,
				yourEmail: draft.submitter.email,
			}
		},
	}
}
