<script lang="ts">
	import type { FeedbackV1 } from '../../api/feedback/v1/+server'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()

	let items = $derived(
		data.feedback.map(f => ({
			id: f.id,
			time: new Date(f.created),
			data: JSON.parse(f.jsonData) as FeedbackV1,
			notes: f.notes,
		})),
	)

	let happinessAvg = $derived(avg(items))
	const oneMonthAgo = new Date()
	oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
	let happinessAvg30 = $derived(avg(items.filter(it => it.time > oneMonthAgo)))

	function avg(values: { data: { emotion: number } }[]) {
		if (values.length === 0) {
			return '–'
		}
		return (values.map(it => it.data.emotion).reduce((a, b) => a + b) / items.length + 3).toFixed(2)
	}
</script>

<div>
	<h1>Feedback</h1>

	<p>Durchschnittliche Zufriedenheit: <b>{happinessAvg}</b> / 5</p>
	<p>Durchschnittliche Zufriedenheit (30 Tage): <b>{happinessAvg30}</b> / 5</p>

	<div class="table-wrapper">
		<table>
			<thead>
				<tr>
					<th>Zeitpunkt</th>
					<th>Zufriedenheit</th>
					<th>Antwort</th>
					<th>Notiz</th>
				</tr>
			</thead>
			<tbody>
				{#each items as item (item.id)}
					<tr>
						<td>{item.time.toLocaleDateString('de')}</td>
						<td>{item.data.emotion + 3}</td>
						<td style="white-space: pre-wrap">{item.data.textResponse}</td>
						<td>{item.notes}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style lang="scss">
	.table-wrapper {
		overflow: auto;
	}

	table {
		border-collapse: collapse;
		display: table;
		width: 100%;
	}

	thead {
		background-color: #eee;
	}

	td,
	th {
		padding: 0.3rem 0.6rem;
		border: 1px solid #0003;
		text-align: start;
	}
</style>
