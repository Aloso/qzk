import { error } from '@sveltejs/kit'

export async function verifyCaptcha(token: string, ip: string, platform: App.Platform) {
	const formData = new FormData()
	formData.append('secret', platform.env.TURNSTILE_SECRET_KEY)
	formData.append('response', token)
	formData.append('remoteip', ip)

	const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: formData,
		method: 'POST',
	})
	const outcome = await result.json()

	if (!outcome.success) {
		console.log(outcome)
		error(403, 'Turnstile captcha verification failed')
	}
}
