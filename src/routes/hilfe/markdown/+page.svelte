<section>
	<h1>Markdown-Hilfe</h1>

	<p>
		Markdown ist ein einfaches System, um Text zu formatieren. Damit kannst du Teile des Texts fett,
		kursiv oder durchgestrichen machen. Selbst Überschriften, Listen und Tabellen sind möglich.
	</p>

	<div class="toc">
		<p>Inhalt</p>
		<ul>
			<li><a href="#absaetze">Absätze</a></li>
			<li><a href="#fett-kursiv">Fett, kursiv</a></li>
			<li><a href="#links">Links</a></li>
			<li><a href="#listen">Listen</a></li>
			<li><a href="#ueberschriften">Überschriften</a></li>
			<li><a href="#trennlinien">Trennlinien</a></li>
			<li><a href="#zitate">Zitate</a></li>
			<li><a href="#durchgestrichen">Durchgestrichen</a></li>
			<li><a href="#feste-breite">Schrift mit fester Breite</a></li>
			<li><a href="#tabellen">Tabellen</a></li>
			<li><a href="#mehr-infos">Mehr Infos</a></li>
		</ul>
	</div>

	<h2 id="absaetze">Absätze</h2>

	<p>Absätze werden immer durch <b>2 Zeilenumbrüche</b> getrennt:</p>

	<pre>
Dies ist ein Absatz.

Dies ist der nächste Absatz.
Dieser Zeilenumbruch hat keine Auswirkungen.
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<p>Dies ist ein Absatz.</p>
		<p>Dies ist der nächste Absatz. Dieser Zeilenumbruch hat keine Auswirkungen.</p>
	</div>

	<h2 id="fett-kursiv">Fett, kursiv</h2>

	<p>
		Fetter Text wird mit <code>**</code> oder <code>__</code> umgeben. Kursiver Text wird mit nur 1
		<code>*</code> oder <code>_</code> umgeben.
	</p>

	<pre>
Hallo. **Dieser  Text ist fett**.

Und _das hier_ ist kursiv.
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<p>Hallo. <b>Dieser Text ist fett</b>.</p>
		<p>Und <i>das hier</i> ist kursiv.</p>
	</div>

	<h2 id="links">Links</h2>

	<p>Links sind etwas komplizierter:</p>

	<pre>
[Link Text](https://queereszentrumkassel.de)
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<p>
			<a href="https://queereszentrumkassel.de">Link Text</a>
		</p>
	</div>

	<p>
		Verlinke bitte nur zu vertrauenswürdigen Seiten. Vergiss nicht das <code>http:</code> oder
		<code>https:</code>, das ist wichtig!
	</p>

	<h2 id="listen">Listen</h2>

	<p>
		Nummerierte Listen werden mit <code>1.&nbsp;</code>, <code>2.&nbsp;</code>, usw. erstellt.
		Unsortierte Listen beginnen mit <code>-&nbsp;</code> oder mit <code>*&nbsp;</code>. Das
		Leerzeichen ist notwendig.
	</p>

	<pre>
* Dies ist
* eine Liste.

1. Und diese Liste
2. ist nummeriert.
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<ul>
			<li>Dies ist</li>
			<li>eine Liste.</li>
		</ul>
		<ol>
			<li>Und diese Liste</li>
			<li>ist nummeriert.</li>
		</ol>
	</div>

	<h2 id="ueberschriften">Überschriften</h2>

	<p>
		Überschriften beginnen mit einem oder mehreren <code>#</code> und einem Leerzeichen:
	</p>

	<pre>
# Überschrift 1
## Überschrift 2
### Überschrift 3
#### Überschrift 4
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<h1>Überschrift 1</h1>
		<h2>Überschrift 2</h2>
		<h3>Überschrift 3</h3>
		<h4>Überschrift 4</h4>
	</div>

	<h2 id="trennlinien">Trennlinien</h2>

	<p>
		Du kannst eine Trennlinie mit <code>---</code> oder <code>***</code> einfügen:
	</p>

	<pre>
Ein Absatz
---
Ein neuer Absatz
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<p>Ein Absatz</p>
		<hr />
		<p>Ein neuer Absatz</p>
	</div>

	<h2 id="zitate">Zitate</h2>

	<p>
		Zitate beginnen mit <code>&gt; </code>:
	</p>

	<pre>
> Dies ist ein schönes Zitat.
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<blockquote>Dies ist ein schönes Zitat.</blockquote>
	</div>

	<h2 id="durchgestrichen">Durchgestrichen</h2>

	<p>
		Durchgestrichener Text beginnt und endet mit <code>~~</code>:
	</p>

	<pre>
Der Termin findet um ~~17:30~~ **18:00** statt.
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<p>Der Termin findet um <strike>17:30</strike> <b>18:00</b> statt.</p>
	</div>

	<h2 id="feste-breite">Schrift mit fester Breite</h2>

	<p>
		Dafür muss über und unter dem Absatz <code>````</code> stehen.
	</p>
	<p>
		<b>Tipp</b>: Diese Art von Apostroph ist üblicherweise neben dem 'ß', dafür muss die Groß-Taste
		gedrückt sein. Bei den meisten Tastaturen erscheinen die Apostrophe erst, wenn du die Taste
		zweimal bzw. viermal drückst.
	</p>

	<pre>
````
Ein Absatz mit fester Breite
````
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<pre>
Ein Absatz mit fester Breite
</pre>
	</div>

	<p>Das funktioniert übrigens auch innerhalb eines Absatzes mit 1 oder 2 Apostrophen:</p>

	<pre>
In diesem Absatz steht `Text mit fester Breite`.
</pre>

	<div class="result">
		<p>In diesem Absatz steht <code>Text mit fester Breite</code>.</p>
	</div>

	<h2 id="tabellen">Tabellen</h2>

	<p>
		Tabellen bestehen aus Spalten, die durch senkrechte Striche (<code>|</code>) getrennt sind.
	</p>
	<p>Wichtig ist, dass nach der ersten Zeile lauter Bindestriche kommen:</p>

	<pre>
| Spalte 1 | Spalte 2 |
| -------- | -------- |
| Zelle 1  | Zelle 2  |
| Zelle 3  | Zelle 4  |
| Zelle 5  | Zelle 6  |
</pre>

	<p>Ergebnis:</p>

	<div class="result">
		<table>
			<thead>
				<tr>
					<td>Spalte 1</td>
					<td>Spalte 2</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Zelle 1</td>
					<td>Zelle 2</td>
				</tr>
				<tr>
					<td>Zelle 3</td>
					<td>Zelle 4</td>
				</tr>
				<tr>
					<td>Zelle 5</td>
					<td>Zelle 6</td>
				</tr>
			</tbody>
		</table>
	</div>

	<p>
		<b>Hinweis</b>: Wenn die senkrechten Linien nicht genau untereinander sind, ist das nicht weiter
		schlimm:
	</p>

	<pre>
| Spalte 1 | Spalte 2 |
| ------- | ----- |
| Diese Tabelle | sieht nicht ganz so ordentlich aus, |
| funktioniert | aber auch! |
  </pre>

	<div class="result">
		<table>
			<thead>
				<tr>
					<td>Spalte 1</td>
					<td>Spalte 2</td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Diese Tabelle</td>
					<td>sieht nicht ganz so ordentlich aus,</td>
				</tr>
				<tr>
					<td>funktioniert</td>
					<td>aber auch!</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2 id="mehr-infos">Mehr Infos</h2>

	<p>
		Es wird die Markdown-Syntax von GitHub verwendet, mit einem Unterschied: Die meisten
		HTML-Elemente werden nicht unterstützt. Umfassendere Informationen dazu findest Du
		<a
			href="https://docs.github.com/de/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
		>
			hier
		</a>.
	</p>
</section>

<style lang="scss">
	.toc {
		display: inline-block;
		width: auto;
		background-color: #ffe3f9;
		border-radius: 20px;
		padding: 0.5rem 1.5rem;

		a {
			text-decoration: none;
		}
	}

	pre {
		display: block;
		background-color: #eee;
		border-radius: 20px;
		padding: 1.5rem;
	}

	code {
		background-color: #ddd;
		padding: 0 4px;
		border-radius: 7px;
	}

	table {
		display: table;
		border-collapse: collapse;
		margin: 1em 0;

		td {
			border: 2px solid #ccc;
			padding: 0.7rem 1rem;
		}

		thead td {
			background-color: #eee;
			border-color: #bbb;
			font-weight: bold;
		}
	}

	blockquote {
		background-color: #fafafa;
		border-radius: 10px;
		padding: 1rem 1.5rem;
		margin: 1em 0;
		border: none;
		box-shadow: 7px 7px 0 var(--color-accent);
		font-style: italic;
	}

	.result {
		border-radius: 20px;
		padding: 0.2rem 1.5rem;
		border: 2px solid var(--color-theme);
		margin: 1rem 0;
	}
</style>
