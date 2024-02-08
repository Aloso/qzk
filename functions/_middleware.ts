import mailChannelsPlugin from '@cloudflare/pages-plugin-mailchannels'

export const onRequest: PagesFunction = mailChannelsPlugin({
	personalizations: [
		{
			to: [{ name: 'Ludwig Stecher', email: 'ludwig.stecher@gmx.de' }],
		},
	],
	from: {
		name: 'Queeres Zentrum Kassel',
		// The domain of your `from` address must be the same as the domain you set up MailChannels Domain Lockdown for (detailed below)
		email: 'info@aloso.foo',
	},
	subject: ({ formData }: { formData: FormData }) => `[QZK Formular] ${formData.get('subject')}`,
	respondWith: () => {
		return new Response(
			`Thank you for submitting your enquiry. A member of the team will be in touch shortly.`,
		)
	},
})
