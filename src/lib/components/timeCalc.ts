export function daysUntil(date: Date | number, reference?: Date | number): number {
	const ref = reference ? new Date(reference) : new Date()
	ref.setHours(0, 0, 0, 0)

	const target = new Date(date)
	target.setHours(0, 0, 0, 0)
	return Math.round(target.getTime() - ref.getTime()) / 1000 / 60 / 60 / 24
}

interface CalendarDay {
	day: number
	month: number
	year: number
}

export function getCalendarDays(
	showDate: Date,
	month: number,
	year: number,
	firstDayOfWeek: 1 | 7,
): CalendarDay[] {
	const firstDayOfMonth = new Date(showDate)
	firstDayOfMonth.setMonth(month)
	firstDayOfMonth.setFullYear(year)
	firstDayOfMonth.setDate(1)
	firstDayOfMonth.setHours(12, 0, 0, 0)

	const firstWeekDay = (firstDayOfMonth.getDay() + 6) % 7
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const daysInPrevMonth = new Date(year, month, 0).getDate()

	const daysOffset =
		firstDayOfWeek === 7 ? -firstWeekDay : (firstWeekDay === 0 ? -6 : 1) - firstWeekDay

	return Array.from({ length: 42 }).map((_, i) => {
		const absNumber = i + daysOffset
		if (absNumber < 1) {
			// This day is in the previous month
			// '0' means one day before the 1st, i.e. the last day of the prev month
			return {
				day: daysInPrevMonth + absNumber,
				month: (month + 11) % 12,
				year: month === 0 ? year - 1 : year,
			}
		} else if (absNumber > daysInMonth) {
			// This day is in the next month
			return {
				day: absNumber - daysInMonth,
				month: (month + 1) % 12,
				year: month === 11 ? year + 1 : year,
			}
		}
		return { day: absNumber, month, year, isCurrentMonth: true }
	})
}
