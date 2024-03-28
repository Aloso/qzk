import type { Event, EventCommon, Time, WireEvent, WireTime } from './types'

export function wire2event<E extends EventCommon>(event: WireEvent & E): Event & E {
	const times = Array.isArray(event.time) ? event.time : [event.time]
	return {
		...event,
		time: times.map(wire2time),
	}
}

export function event2wire<E extends EventCommon>(event: Event & E): WireEvent & E {
	return {
		...event,
		time: event.time.map(time2wire),
	}
}

function wire2time(time: WireTime): Time {
	const hasStartTime = time.start.includes('T')
	const start = new Date(time.start)
	const end = time.end ? new Date(time.end) : undefined

	return { hasStartTime, start, end }
}

function time2wire(time: Time): WireTime {
	return {
		start: formatDate(time.start, time.hasStartTime),
		end: time.end ? formatDate(time.end, time.hasStartTime) : undefined,
	}
}

function formatDate(date: Date, includeTime: boolean) {
	const str = date.toISOString()
	return includeTime ? str : str.split('T')[0]
}
