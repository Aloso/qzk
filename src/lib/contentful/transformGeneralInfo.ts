import type { DateRange, GeneralInfo, GeneralInfoTransformed } from '$lib/data'

export function transformGeneralInfo(info: GeneralInfo): GeneralInfoTransformed {
	return {
		openingHours: {
			mon: info.openingHoursMon ? transformOpeningHours(info.openingHoursMon, 'Montag') : [],
			tue: info.openingHoursTue ? transformOpeningHours(info.openingHoursTue, 'Dienstag') : [],
			wed: info.openingHoursWed ? transformOpeningHours(info.openingHoursWed, 'Mittwoch') : [],
			thu: info.openingHoursThu ? transformOpeningHours(info.openingHoursThu, 'Donnerstag') : [],
			fri: info.openingHoursFri ? transformOpeningHours(info.openingHoursFri, 'Freitag') : [],
			sat: info.openingHoursSat ? transformOpeningHours(info.openingHoursSat, 'Samstag') : [],
			sun: info.openingHoursSun ? transformOpeningHours(info.openingHoursSun, 'Sonntag') : [],
		},
		specialOpeningHours: info.specialOpeningHours.map(transformSpecialOpeningHours),
		importantInfo: info.importantInfo,
	}
}

function transformOpeningHours(hours: string, context: string): DateRange[] {
	return hours
		.split(',')
		.map(s => s.trim())
		.filter(s => s !== '')
		.map(s => parseRange(s, context))
}

function parseRange(range: string, context: string): DateRange {
	const parts = range.split('-')
	if (parts.length !== 2) {
		throw new Error(
			`Allgemeine Informationen: Die Zeitangabe '${range}' für die Öffnungszeiten am ${context} ist ungültig. Erwartet wird ein Start- und Endzeitpunkt, z.B. '13-17' oder '13:15-17:45'.`,
		)
	}
	const [start, end] = parts.map(p => p.trim())
	return {
		from: start,
		to: end,
	}
}

function transformSpecialOpeningHours(dayAndHours: string): readonly [Date, DateRange[]] {
	const parts = dayAndHours.split(':', 2)
	if (parts.length !== 2) {
		throw new Error(
			`Allgemeine Informationen: Die besonderen Öffnungszeiten '${dayAndHours}' sind ungültig. Es fehlt ein Doppelpunkt.`,
		)
	}
	const [date, hours] = parts.map(p => p.trim())
	const [day, month, year] = date.split('.').map(n => Number(n.trim()))
	return [
		new Date(year, month - 1, day, 12),
		transformOpeningHours(hours, `${day}.${month}.${year}`),
	]
}
