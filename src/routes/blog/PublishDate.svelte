<script lang="ts">
	interface Props {
		date: string
		withDescription?: boolean
	}

	let { date, withDescription } = $props<Props>()
	const dateFmt = new Date(date).toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
</script>

{withDescription ? 'Veröffenticht: ' : ''}{dateFmt}
