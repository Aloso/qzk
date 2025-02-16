export function daysUntil(date: Date | number, reference?: Date | number): number {
	const ref = reference ? new Date(reference) : new Date()
	ref.setHours(0, 0, 0, 0)

	const target = new Date(date)
	target.setHours(0, 0, 0, 0)
	return Math.round(target.getTime() - ref.getTime()) / 1000 / 60 / 60 / 24
}
