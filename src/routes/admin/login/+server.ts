import { verifyCredentials } from '#backend/events/http.js'

export async function POST({ request }): Promise<Response> {
	const formData = await request.formData()
	const credentials = {
		user: formData.get('user') as string,
		password: formData.get('password') as string,
	}

	if (!credentials.user || !credentials.password || !verifyCredentials(credentials)) {
		return new Response(null, {
			status: 303,
			headers: {
				Location: '/admin?m=loginFailed',
			},
		})
	}

	const cookieString = btoa(`${credentials.user}@${credentials.password}`).replaceAll('=', '')

	return new Response(null, {
		status: 303,
		headers: {
			Location: '/admin?m=loginSuccessful',
			'Set-Cookie': `_qzkCred=${cookieString}; HttpOnly; Secure; SameSite=Strict; Path=/`,
		},
	})
}
