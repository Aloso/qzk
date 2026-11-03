import data, { type DonationsInfo } from '#lib/contentful/data.js'

export const prerender = true

export async function load(): Promise<DonationsInfo['fields']> {
	return data.donations.fields
}
