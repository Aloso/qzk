import { STRIPE_SECRET_KEY } from '$app/env/private'
import { error } from '@sveltejs/kit'
import Stripe from 'stripe'
import z from 'zod'

const schema = z.object({
	provider: z.enum(['stripe', 'paypal']),
	session_id: z.string(),
})

export interface DonationResult {
	stickerOrdered: boolean
	interval: 'once' | 'month' | 'year'
	name?: string
	address?: {
		city: string | null
		country: string | null
		line1: string | null
		line2: string | null
		postal_code: string | null
		state: string | null
	}
}

export async function load({ request }): Promise<DonationResult> {
	const params = new URL(request.url).searchParams
	const data = schema.parse({
		provider: params.get('provider'),
		session_id: params.get('session_id'),
	})

	if (data.provider !== 'stripe') {
		error(400, 'Provider not yet supported')
	}

	const stripeClient = new Stripe(STRIPE_SECRET_KEY)
	const session = await stripeClient.checkout.sessions.retrieve(data.session_id, {
		expand: ['customer', 'payment_intent', 'line_items'],
	})
	if (session.payment_status !== 'paid') {
		error(400, 'Die Transaktion ist unvollständig')
	}

	const recurring = session.line_items?.data[0].price?.recurring?.interval
	const interval = recurring === 'year' ? 'year' : recurring === 'month' ? 'month' : 'once'

	return {
		stickerOrdered: session.metadata?.sticker_ordered === 'true',
		interval,
		name: session.customer_details?.individual_name ?? undefined,
		address: session.customer_details?.address ?? undefined,
	}
}
