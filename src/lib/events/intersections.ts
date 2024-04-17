import type { Time } from './types'

export function getInBetween(eventTimes: Time[], start: number, end: number): Time[] {
	return eventTimes.filter(time => !(+time.start > end || +(time.end ?? time.start) < start))
}

export function isBetween(eventTimes: Time[], start: Date, end: Date): boolean {
	return eventTimes.some(time => !(time.start > end || (time.end ?? time.start) < start))
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
	return !(aStart > bEnd || aEnd < bStart)
}

export function getEndOfTime(time: Time): number {
	const d = new Date(time.end ?? time.start)
	if (!time.end || time.variant === 'day-range') {
		d.setHours(23, 59, 59, 999)
	}
	return d.getTime()
}

export function narrowTimesToDraft(times: Time[], draftTimes: Time[]): Time[] {
	return times.filter(time =>
		draftTimes.some(draftTime =>
			overlaps(time.start, getMaxEnd(time), draftTime.start, getMaxEnd(draftTime)),
		),
	)
}

function getMaxEnd(time: Time): Date {
	const end = new Date(time.end ?? time.start)
	if (time.variant !== 'time-range') {
		end.setHours(23, 59, 59, 999)
	}
	return end
}
