import { defineParams } from '@sveltejs/kit/params'
import z from 'zod'

export const params = defineParams({
	donationTab: z.enum(['auswahl', 'paypal', 'ueberweisung', 'monatlich']),
})
