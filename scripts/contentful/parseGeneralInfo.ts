import { GeneralInfo } from './types'

export interface DateRange {
	from: string
	to: string
}

export interface GeneralInfoTransformed {
	openingHours: {
		mon: DateRange[]
		tue: DateRange[]
		wed: DateRange[]
		thu: DateRange[]
		fri: DateRange[]
		sat: DateRange[]
		sun: DateRange[]
	}
	specialOpeningHours: {
		date: string
		hours: DateRange[]
	}[]
	importantInfo?: string[]
}

export function getGeneralInfo(info: GeneralInfo): GeneralInfoTransformed {
	return {
		openingHours: info.openingHours.regular,
		specialOpeningHours: info.openingHours.special,
		importantInfo: info.importantInfo,
	}
}
