<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		template: string
		placeholder: Snippet<[string, string | undefined]>
	}

	type Part = string | { type: string; content?: string }

	let { template, placeholder }: Props = $props()

	let parts = $derived(makeParts(template))

	function makeParts(template: string) {
		const parts: Part[] = []

		const regex = /<(\/?)(\w*)(\/?)>/g
		let res: RegExpExecArray | null
		let lastIndex = 0
		let openTag: string | undefined = undefined

		while ((res = regex.exec(template)) !== null) {
			const textPart = template.slice(lastIndex, res.index)

			const isClosing = res[1].length > 0
			const tagName = res[2]
			const isSelfClosing = res[3].length > 0
			if (isClosing && isSelfClosing) {
				throw new Error('invalid template')
			}

			if (isClosing) {
				if (tagName !== openTag) {
					throw new Error('unmatched closing tag in template')
				}
				parts.push({ type: tagName, content: textPart })
				openTag = undefined
			} else if (isSelfClosing) {
				if (textPart.length > 0) parts.push(textPart)
				parts.push({ type: tagName })
			} else {
				if (openTag) {
					throw new Error('nested tags are not supported')
				}
				if (textPart.length > 0) parts.push(textPart)
				openTag = tagName
			}
			lastIndex = regex.lastIndex
		}

		if (openTag) {
			throw new Error('unmatched opening tag in template')
		}

		if (lastIndex < template.length) {
			parts.push(template.slice(lastIndex))
		}

		return parts
	}
</script>

{#each parts as part (part)}
	{#if typeof part === 'string'}
		{part}
	{:else}
		{@render placeholder(part.type, part.content)}
	{/if}
{/each}
