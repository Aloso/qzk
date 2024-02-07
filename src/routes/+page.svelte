<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import type { Item } from '$lib/contentful/types'
	import type { StaticPage } from '$lib/data'

	export let data: Item<StaticPage>
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<section>
	<!--
	<RichText data={data.fields.content} width={900} />
	-->
	<div class="fonts">
		<div class="font-desc">Work Sans, Asap</div>
		<h1 class="work-sans">Willkommen beim Queeren Zentrum Kassel</h1>
		<h2 class="work-sans">Ein paar Worte über Spenden</h2>
		<p class="asap">
			Damit unser Zentrum funktionieren kann, brauchen wir dringend <b>Geld- und Sachspenden</b>.
			Wenn du oder Menschen aus deinem Umfeld etwas beitragen könnt, dann freuen wir uns sehr.
			Überweist gerne den Betrag auf unser Konto <i>mit dem Verwendungszweck "Spende"</i> oder schreibt
			uns, wie ihr uns die Sachspenden zukommen lassen könnt.
		</p>
		<p class="asap">
			Selbstverständlich könnt ihr dafür auch eine Spendenbescheinigung bekommen. Die könnt ihr bei
			uns anfragen oder hier herunterladen und gemeinsam mit dem Kontoauszug beim Finanzamt
			einreichen.
		</p>

		<hr />
		<div class="font-desc">Bitter, Asap</div>
		<h1 class="bitter">Willkommen beim Queeren Zentrum Kassel</h1>
		<h2 class="bitter">Ein paar Worte über Spenden</h2>
		<p class="asap">
			Damit unser Zentrum funktionieren kann, brauchen wir dringend <b>Geld- und Sachspenden</b>.
			Wenn du oder Menschen aus deinem Umfeld etwas beitragen könnt, dann freuen wir uns sehr.
			Überweist gerne den Betrag auf unser Konto <i>mit dem Verwendungszweck "Spende"</i> oder schreibt
			uns, wie ihr uns die Sachspenden zukommen lassen könnt.
		</p>
		<p class="asap">
			Selbstverständlich könnt ihr dafür auch eine Spendenbescheinigung bekommen. Die könnt ihr bei
			uns anfragen oder hier herunterladen und gemeinsam mit dem Kontoauszug beim Finanzamt
			einreichen.
		</p>

		<hr />
		<div class="font-desc">Petrona, Lato</div>
		<h1 class="petrona">Willkommen beim Queeren Zentrum Kassel</h1>
		<h2 class="petrona">Ein paar Worte über Spenden</h2>
		<p class="lato" style="font-size: 112%;">
			Damit unser Zentrum funktionieren kann, brauchen wir dringend <b>Geld- und Sachspenden</b>.
			Wenn du oder Menschen aus deinem Umfeld etwas beitragen könnt, dann freuen wir uns sehr.
			Überweist gerne den Betrag auf unser Konto <i>mit dem Verwendungszweck "Spende"</i> oder schreibt
			uns, wie ihr uns die Sachspenden zukommen lassen könnt.
		</p>
		<p class="lato" style="font-size: 112%;">
			Selbstverständlich könnt ihr dafür auch eine Spendenbescheinigung bekommen. Die könnt ihr bei
			uns anfragen oder hier herunterladen und gemeinsam mit dem Kontoauszug beim Finanzamt
			einreichen.
		</p>

		<hr />
		<div class="font-desc">Laila, Nunito</div>
		<h1 class="laila">Willkommen beim Queeren Zentrum Kassel</h1>
		<h2 class="laila">Ein paar Worte über Spenden</h2>
		<p class="nunito">
			Damit unser Zentrum funktionieren kann, brauchen wir dringend <b>Geld- und Sachspenden</b>.
			Wenn du oder Menschen aus deinem Umfeld etwas beitragen könnt, dann freuen wir uns sehr.
			Überweist gerne den Betrag auf unser Konto <i>mit dem Verwendungszweck "Spende"</i> oder schreibt
			uns, wie ihr uns die Sachspenden zukommen lassen könnt.
		</p>
		<p class="nunito">
			Selbstverständlich könnt ihr dafür auch eine Spendenbescheinigung bekommen. Die könnt ihr bei
			uns anfragen oder hier herunterladen und gemeinsam mit dem Kontoauszug beim Finanzamt
			einreichen.
		</p>

		<hr />
	</div>
</section>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,400;0,600;1,400;1,600&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Andika:ital,wght@0,400;0,700;1,400;1,700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Laila:wght@300;400;500;600;700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,700;1,400;1,700&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');
	@import url('https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600;700&display=swap');

	h1 {
		font-size: 2.8rem;
	}

	hr {
		margin: 8rem 0;
	}

	.font-desc {
		font-size: 0.9rem;
		margin: -7.6rem 0 7.6rem auto;
		color: #777;

		&:first-of-type {
			margin-top: 0.5rem;
		}
	}

	.font-desc:not(.no-before)::before {
		content: 'Schriftarten: ';
	}

	.gowun-dodum {
		font-family: Gowun Dodum;
	}

	.asap {
		font-family: Asap;
	}

	.petrona {
		font-family: Petrona;
	}
	h1.petrona {
		font-weight: 500;
	}
	h2.petrona {
		font-weight: 600;
	}

	.lato {
		font-family: Lato;
	}

	.laila {
		font-family: Laila;
	}
	h1.laila {
		font-weight: 400;
	}
	h2.laila {
		font-weight: 500;
	}

	.andika {
		font-family: Andika;
	}

	.sora {
		font-family: Sora;
	}
	h1.sora {
		font-weight: 400;
	}
	h2.sora {
		font-weight: 500;
	}

	.nunito {
		font-family: Nunito;
	}

	.work-sans {
		font-family: Work Sans;
	}

	h1.work-sans {
		font-weight: 500;
	}
	h2.work-sans {
		font-weight: 600;
	}
	.bitter {
		font-family: Bitter;
	}

	h1.bitter {
		font-weight: 500;
	}
	h2.bitter {
		font-weight: 600;
	}
</style>
