import fs from 'node:fs'

import adapterCloudflare from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { createClient } from './telegram/client.js'
import dotenv from 'dotenv'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: vitePreprocess(),

	kit: {
		env: {
			publicPrefix: 'VITE_PUBLIC_',
		},

		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapterCloudflare({
			routes: {
				include: ['/', '/api/*', '/admin', '/admin/*'],
				exclude: [],
			},
		}),

		prerender: isDev
			? undefined
			: {
					async handleHttpError(event) {
						await initClient()
						if (event.status === 500) {
							try {
								const errors = fs.readFileSync('.sveltekit-errors.txt', { encoding: 'utf-8' })
								fs.rmSync('.sveltekit-errors.txt')
								if (!(errors in messageCache)) {
									messageCache.add(errors)
									const lines = [...new Set(errors.split('\n'))]
									await client?.sendMessage(process.env.TELEGRAM_NOTIFICATION_RECIPIENT, {
										message: `[QZK BOT]\n${lines.join('\n')}`,
									})
								}
								throw new Error(`Http error occurred: ${event.message}`)
							} catch {
								// do nothing
							}
						}
						await client?.sendMessage(process.env.TELEGRAM_NOTIFICATION_RECIPIENT, {
							message: `[QZK BOT] Beim Bauen der Anwendung ist ein Fehler aufgetreten: ${event.status}
Pfad: ${event.path}
Ursprungsseite: ${event.referrer}
Art: ${event.referenceType}
Fehlermeldung: ${event.message}`,
						})
						throw new Error(`Http error occurred: ${event.message}`)
					},
					async handleMissingId(input) {
						await initClient()
						await client?.sendMessage(process.env.TELEGRAM_NOTIFICATION_RECIPIENT, {
							message: `[QZK BOT] Beim Bauen der Anwendung ist ein Fehler aufgetreten: ID fehlt
id: ${input.id}
Pfad: ${input.path}
Ursprungsseiten: ${input.referrers}
Art: ${input.referenceType}
Fehlermeldung: ${input.message}`,
						})
						throw new Error(`ID missing: ${input.message}`)
					},
					async handleEntryGeneratorMismatch(event) {
						await initClient()
						await client?.sendMessage(process.env.TELEGRAM_NOTIFICATION_RECIPIENT, {
							message: `[QZK BOT] Beim Bauen der Anwendung ist ein Fehler aufgetreten: Ein Eintrag stimmt nicht mit der Route überein, aus der er erzeugt wurde
generatedFromId: ${event.generatedFromId}
matchedId: ${event.matchedId}
Eintrag: ${event.entry}
Fehlermeldung: ${event.message}`,
						})
						throw new Error(`Http error occurred: ${event.message}`)
					},
				},
	},
}

/** @type {import("telegram").TelegramClient} */
let client
let messageCache = new Set()

async function initClient() {
	if (!client && process.env.TELEGRAM_API_ID) {
		dotenv.config()
		client = await createClient({
			apiId: +process.env.TELEGRAM_API_ID,
			apiHash: process.env.TELEGRAM_API_HASH,
			stringSession: process.env.TELEGRAM_STRING_SESSION,
			phoneNumber: process.env.TELEGRAM_PHONE_NUMBER,
			password: process.env.TELEGRAM_PASSWORD,
		})
	}
}

export default config
