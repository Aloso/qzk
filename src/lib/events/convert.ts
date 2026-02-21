import type { EventDto, TimeDto } from '$lib/server/events/event'
import type { Event, EventCommon, Time, TimeVariant } from './types'

export function wire2event<E>(event: EventDto & E): Event & E
export function wire2event(event: EventDto): Event {
	return { ...event, times: event.times.map(wire2time) }
}

export function event2wire<E extends EventCommon>(event: Event & E): EventDto {
	return { ...event, times: event.times.map(time2wire) }
}

export function wire2time(time: TimeDto): Time {
	const hasStartTime = time.start.includes('T')
	const hasEndTime = time.end?.includes('T') ?? false
	const variant: TimeVariant = hasEndTime
		? 'time-range'
		: hasStartTime
			? 'time'
			: time.end
				? 'day-range'
				: 'day'

	const start = new Date(time.start)
	const end = time.end ? new Date(time.end) : undefined

	return { variant, start, end } as Time
}

function time2wire(time: Time): TimeDto {
	return {
		start: formatDate(time.start, time.variant === 'time' || time.variant === 'time-range'),
		end: time.end ? formatDate(time.end, time.variant === 'time-range') : undefined,
	}
}

function formatDate(date: Date, includeTime: boolean) {
	const str = date.toISOString()
	return includeTime ? str : str.split('T')[0]
}
