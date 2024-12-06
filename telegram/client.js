import { TelegramClient } from 'telegram'
import { StringSession } from 'telegram/sessions/index.js'

/**
 * @typedef {{
		apiId: number
		apiHash: string
		stringSession: string
		phoneNumber: string
		password: string
	}} ClientOptions
 */

export async function createClient(/** @type {ClientOptions} */ options) {
	const client = new TelegramClient(
		new StringSession(options.stringSession),
		options.apiId,
		options.apiHash,
		{ connectionRetries: 5 },
	)

	await client.start({
		phoneNumber: options.phoneNumber,
		async password() {
			return options.password
		},
		async phoneCode() {
			return (await makeReadline()).question('Please enter the code you received: ')
		},
		onError: err => console.error(err),
	})

	return client
}

async function makeReadline() {
	const { default: readline } = await import('node:readline')
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	return {
		async question(/** @type {string} */ query) {
			return new Promise((/** @type {(answer: string) => void} */ resolve) =>
				rl.question(query, resolve),
			)
		},
	}
}
