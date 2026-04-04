type Env = App.Platform['env']

export async function createMailer(env: Env) {
	const { WorkerMailer } = await import('worker-mailer')

	const mailer = await WorkerMailer.connect({
		credentials: {
			username: env.SMTP_USERNAME,
			password: env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: env.SMTP_HOST,
		port: 465,
		secure: true,
	})

	return mailer
}
