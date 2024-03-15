<script lang="ts">
	interface Props {
		date: string
		withDescription?: boolean
	}

	let { date, withDescription }: Props = $props()
	const dateFmt = new Date(date).toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
</script>

{withDescription ? 'Veröffentlicht: ' : ''}{dateFmt}
