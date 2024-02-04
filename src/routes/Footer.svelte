<footer>
	<div class="footer-inner">
		<div class="link-section">
			<div class="title">Queeres Zentrum Kassel</div>
			<a href="/">Aktuelles</a>
			<a href="/blog">Blog</a>
			<a href="/mitgliedschaft">Mitgliedschaft und Spenden</a>
			<a href="/kontakt">Kontakt</a>
		</div>
		<div class="link-section">
			<div class="title">Informationen</div>
			<a href="/ueber-uns">Über Uns</a>
			<a href="/selbstverstaendnis">Selbstverständnis</a>
			<a href="/awareness-konzept">Awarenesskonzept</a>
		</div>
		<div class="link-section">
			<div class="title">Rechtliches</div>
			<a href="/impressum">Impressum</a>
			<a href="/datenschutz">Datenschutz</a>
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		border-top: 3px solid #ffd5f9;
		background-color: #ffe7fc;
		margin-top: 4rem;
		padding-bottom: 2rem;
	}

	.footer-inner {
		display: flex;
		gap: 4rem;
		padding: 1rem;
		margin: 0 auto;
		max-width: 70rem;
		box-sizing: border-box;
		flex-wrap: wrap;
	}

	footer a {
		font-weight: 500;
		text-decoration: none;
		color: var(--color-theme);
	}

	.link-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.title {
		margin: 0.5rem 0;
		opacity: 0.8;
	}
</style>
