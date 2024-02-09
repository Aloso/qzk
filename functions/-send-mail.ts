// import { createTransport } from 'nodemailer'

// const transporter = createTransport({
// 	host: process.env.SMTP_HOST,
// 	port: +(process.env.SMTP_PORT ?? '465'),
// 	secure: process.env.SMTP_SECURE === 'true',
// 	auth: {
// 		user: process.env.SMTP_USER,
// 		pass: process.env.SMTP_PASS,
// 	},
// })

// export const onRequest: PagesFunction = async (context) => {
// 	let emailContext = ''

// 	try {
// 		const formData = await context.request.formData()
// 		const email = getStringField(formData, 'email')
// 		const content = getStringField(formData, 'content')
// 		const subject = getStringField(formData, 'subject')
// 		const backLink = getStringField(formData, 'backLink')
// 		emailContext = getStringField(formData, 'context')

// 		if (!isValidEmailContext(emailContext)) {
// 			error('"context" is invalid')
// 		}

// 		const emailSanitized = escapeHtml(email)
// 		const subjectSanitized = escapeHtml(subject)
// 		const contentSanitized = escapeHtml(content)

// 		const textStyles =
// 			'style="font-family: Helvetica Neue, Arial, Verdana, sans-serif; font-size: 14px"'
// 		const htmlMessage = `
// 	<!DOCTYPE html>
// 	<html lang="de">
// 	<head>
// 		<meta charset="utf-8" />
// 		<title>${subjectSanitized}</title>
// 	</head>
// 	<body>
// 		<p ${textStyles}><b>Nachricht von ${emailSanitized} ans Queere Zentrum:</b></p>
// 		<p ${textStyles}>${contentSanitized
// 			.split('\n\n')
// 			.join(`</p>\n<p ${textStyles}>`)
// 			.replaceAll('\n', '<br>\n')
// 			.replaceAll('  ', ' &nbsp;')}</p>
// 	</body>
// 	</html>`

// 		const info = await transporter.sendMail({
// 			from: '"Ludwig Stecher" <ludwig.stecher@gmx.de>',
// 			to: 'ludwig.stecher@gmx.de', // comma separated list of receivers
// 			replyTo: email,
// 			subject: `[${emailContext}] ${subject}`,
// 			text: `Nachricht von ${email} ans Queere Zentrum:\n\n${content}`,
// 			html: htmlMessage,
// 		})

// 		console.log('Message sent: %s', info.messageId)

// 		return redirect(
// 			'Deine Nachricht wurde zugestellt.',
// 			buildUrl('/email/gesendet', { context: emailContext, backLink }),
// 		)
// 	} catch (error: unknown) {
// 		console.error(error)

// 		if (error instanceof ResponseError) {
// 			return redirect(
// 				error.message,
// 				buildUrl('/email/error', { message: error.message, context: emailContext }),
// 			)
// 		} else {
// 			return internalError(error instanceof Error ? error.message : 'An unknown error occurred')
// 		}
// 	}
// }

// class ResponseError extends Error {
// 	public constructor(message: string) {
// 		super(message)
// 	}
// }

// function error(message: string, cause?: unknown): never {
// 	const error = new ResponseError(message)
// 	error.cause = cause
// 	throw error
// }

// function redirect(message: string, Location: string): Response {
// 	return new Response(message, {
// 		status: 307,
// 		statusText: 'Temporary Redirect',
// 		headers: { Location },
// 	})
// }

// function internalError(message: string): Response {
// 	return new Response(message, {
// 		status: 500,
// 		statusText: 'Internal Server Error',
// 	})
// }

// function getStringField(formData: FormData, field: string): string {
// 	const value = formData.get(field) ?? error(`"${field}" field missing`)

// 	if (value instanceof File || !value) {
// 		error(`"${field}" field empty or invalid`)
// 	}

// 	return value
// }

// function buildUrl(path: string, params: Record<string, string>): string {
// 	let url = path
// 	if (params) {
// 		let isFirst = true
// 		for (const [key, value] of Object.entries(params)) {
// 			url += isFirst ? '?' : '&'
// 			url += encodeURIComponent(key)
// 			url += '='
// 			url += encodeURIComponent(value)
// 			isFirst = false
// 		}
// 	}

// 	return url
// }

// type EmailContext = 'CONTACT_FORM' | 'EVENT'

// function isValidEmailContext(context: string): context is EmailContext {
// 	return ['CONTACT_FORM', 'EVENT'].includes(context)
// }

// function escapeHtml(str: string): string {
// 	const map: Record<string, string> = {
// 		'&': '&amp;',
// 		'<': '&lt;',
// 		'>': '&gt;',
// 		'"': '&quot;',
// 		"'": '&#39;',
// 	}
// 	return str.replace(/[&<>"']/g, (s) => map[s])
// }
