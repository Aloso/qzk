import { formDataText } from '$lib/server/events/http'
import { escapeHtml } from '$lib/utils/sanitize.js'
import { error } from '@sveltejs/kit'

export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const { WorkerMailer } = await import('worker-mailer')

	// Connect to SMTP server
	const mailer = await WorkerMailer.connect({
		credentials: {
			username: platform.env.SMTP_USERNAME,
			password: platform.env.SMTP_PASSWORD,
		},
		authType: 'plain',
		host: platform.env.SMTP_HOST,
		port: 465, // try 587 if this fails
		secure: true,
	})

	const formData = await request.formData()
	const subject = formDataText(formData, 'subject') ?? error(400, 'Missing subject')
	const email = formDataText(formData, 'email') ?? error(400, 'Missing email')
	const body = formDataText(formData, 'body') ?? error(400, 'Missing body')
	const redirect = formDataText(formData, 'redirect')

	if (!email.includes('@')) error(400, 'Invalid email address')

	const nameBeforeAt = email.split('@')[0]
	const displayName = `${nameBeforeAt} via website`

	const htmlBody = body
		.split('\n\n')
		.map(
			p => `<p style="font-size:16px;margin:0 0 14px 0;white-space:pre-wrap">${escapeHtml(p)}</p>`,
		)
		.join('\n')

	// Send email
	await mailer.send({
		from: { name: displayName, email: 'contact@queereszentrumkassel.de' },
		to: { name: 'Queeres Zentrum Kassel', email: platform.env.CONTACT_FORM_RECIPIENT },
		reply: { email },
		subject: subject,
		text: `${body}\n\nDiese E-Mail wurde von ${email} mit dem Kontaktformular auf queereszentrumkassel.de versendet.`,
		html: `<!DOCTYPE html>
<html>
<body style="font-family: Segoe UI, Roboto, sans-serif; font-size: 14px;">
	${htmlBody}
	<div style="opacity: 0.7; margin: 28px 0 0 0">Diese E-Mail wurde von <b>${escapeHtml(email)}</b> mit dem Kontaktformular auf queereszentrumkassel.de versendet.</div>
</body>
</html>`,
	})

	if (redirect) {
		return Response.redirect(redirect, 303)
	} else {
		return new Response(null, { status: 201 }) // Created
	}
}
