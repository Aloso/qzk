import { STRIPE_SECRET_KEY } from '$app/env/private'
import { error, redirect } from '@sveltejs/kit'
import Stripe from 'stripe'
import z from 'zod'

const schema = z.object({
	interval: z.enum(['once', 'month', 'year']),
	amount: z.int().min(1).max(10_000),
})

export async function POST({ request }): Promise<Response> {
	const formData = await request.formData()
	const paymentInfo = schema.parse({
		interval: formData.get('interval'),
		amount: Number(formData.get('amount')),
	})

	const stripeClient = new Stripe(STRIPE_SECRET_KEY)
	const session = await stripeClient.checkout.sessions.create({
		mode: paymentInfo.interval === 'once' ? 'payment' : 'subscription',
		ui_mode: 'hosted_page',
		success_url:
			'https://queereszentrumkassel.de/spende/erfolg?provider=stripe&session_id={CHECKOUT_SESSION_ID}',
		cancel_url: 'https://queereszentrumkassel.de/spende',
		line_items: [
			{
				price_data: {
					currency: 'eur',

					recurring:
						paymentInfo.interval === 'once'
							? undefined
							: { interval: paymentInfo.interval, interval_count: 1 },
					unit_amount: paymentInfo.amount * 100,
					product_data: {
						name: 'Spende an das Queere Zentrum Kassel',
						description:
							'Unterstütze unsere Arbeit – inklusive optionalem Glitzer-Sticker im Anschluss!',
						images: ['https://queereszentrumkassel.de/logo-colorful.png'],
					},
				},
				quantity: 1,
			},
		],
		allow_promotion_codes: false,
		submit_type: 'donate',
		origin_context: 'web',
	})

	if (!session.url) {
		error(400, 'Fehler beim Starten der Zahlung')
	}

	redirect(303, session.url, { external: true })
}
