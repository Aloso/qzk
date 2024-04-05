import type { Time } from './types'

export function getInBetween(eventTimes: Time[], start: number, end: number): Time[] {
	return eventTimes.filter(time => !(+time.start > end || +(time.end ?? time.start) < start))
}

export function isBetween(eventTimes: Time[], start: Date, end: Date): boolean {
	return eventTimes.some(time => !(time.start > end || (time.end ?? time.start) < start))
}

interface TimeBounds {
	start: Date
	end: Date
}

export function mayIntersect(eventTimes: Time[], draftTimeBounds: TimeBounds[]): boolean {
	return draftTimeBounds.some(eTime => isBetween(eventTimes, eTime.start, eTime.end))
}

export function getDraftTimeBounds(draftTimes: Time[]): TimeBounds[] {
	return draftTimes.map(time => {
		const eStart = time.start
		const eEnd = new Date(time.end ?? time.start)
		eEnd.setHours(23, 59, 59, 999)
		return { start: eStart, end: eEnd }
	})
}

export function getEndOfTime(time: Time): number {
	const d = new Date(time.end ?? time.start)
	if (!time.end || time.variant === 'day-range') {
		d.setHours(23, 59, 59, 999)
	}
	return d.getTime()
}
