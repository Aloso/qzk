import { SMTP_HOST, SMTP_PASSWORD, SMTP_USERNAME } from '$app/env/private'

export async function createMailer() {
	const { WorkerMailer } = await import('worker-mailer')

	const mailer = await WorkerMailer.connect({
		credentials: {
			username: SMTP_USERNAME,
			password: SMTP_PASSWORD,
		},
		authType: 'plain',
		host: SMTP_HOST,
		port: 465,
		secure: true,
	})

	return mailer
}
