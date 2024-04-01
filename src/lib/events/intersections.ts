import type { Time } from './types'

export function isBetween(eventTimes: Time[], start: Date, end: Date): boolean {
	return eventTimes.some((time) => !(time.start > end || (time.end ?? time.start) < start))
}

interface TimeBounds {
	start: Date
	end: Date
}

export function mayIntersect(eventTimes: Time[], draftTimeBounds: TimeBounds[]): boolean {
	return draftTimeBounds.some((eTime) => isBetween(eventTimes, eTime.start, eTime.end))
}

export function getDraftTimeBounds(draftTimes: Time[]): TimeBounds[] {
	return draftTimes.map((time) => {
		const eStart = time.start
		const eEnd = new Date(time.end ?? time.start)
		eEnd.setHours(23)
		eEnd.setMinutes(59)
		eEnd.setSeconds(59)
		return { start: eStart, end: eEnd }
	})
}
