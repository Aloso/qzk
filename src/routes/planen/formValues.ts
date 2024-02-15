export interface FormValues {
	title: string
	description: string

	startDate: string
	startTime: string
	endDate: string
	endTime: string
	wholeDay: boolean

	placeType: 'QZ' | 'PHYSICAL' | 'ONLINE'
	placeRoom: undefined | 'room 1' | 'room 2' | 'room3'
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
