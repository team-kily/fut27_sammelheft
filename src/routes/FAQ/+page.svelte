<script>
	const faq = [
		{
			q: 'Was ist das FUT Sammelheft?',
			a: 'Das FUT Sammelheft ist eine digitale Sammelalbum für EA Sports FC 27 Ultimate Team. Hier kannst du alle verfügbaren FUT-Karten virtuell sammeln, anzeigen und sortieren – ganz ohne Spielzugriff.'
		},
		{
			q: 'Wie funktioniert das Sammeln von Karten?',
			a: 'Im Sammelheft kannst du nach Spielern, Versionen, Ligen, Nationen oder Clubs suchen, durch Antippen oder Anklicken Karten als gesammelt markieren und deinen automatisch gezählten Fortschritt jederzeit in der Kopfzeile verfolgen.'
		},
		{
			q: 'Was kann ich tun, wenn ich mich zwischen zwei Karten entscheiden muss?',
			a: 'Wenn du dich zwischen zwei Spielern oder verschiedenen Versionen eines Spielers entscheiden musst, kannst du die Karte als „Impossible/Unmöglich“ markieren: Öffne die Übersicht mit allen Karten, tippe oder klicke unten rechts auf den Button, wähle im Menü „Karte als unmöglich markieren“ und tippe anschließend auf die gewünschte Karte – sie erhält ein „Impossible“-Banner und wird im Zähler wie gesammelt gewertet, sodass dein Fortschritt trotzdem vollständig bleibt.'
		},
		{
			q: 'Die Karten werden bei mir zu groß oder zu klein angezeigt, was kann ich tun?',
			a: 'In der Kartenansicht kannst du unten rechts den Button antippen oder klicken und anschließend den Slider verwenden, um die Kartengröße ganz nach deinen Wünschen anzupassen.'
		},
		{
			q: 'Was bedeuten die Filter „Alle Karten“, „Keine Basis-Karten“, „Nur beste Version“ und „Nur beste Spezialversion“ im Sammelheft?',
			a: 'Die Filter „Alle Karten“, „Keine Basis-Karten“, „Nur beste Version“ und „Nur beste Spezialversion“ legen fest, welche Karten im Sammelheft erscheinen: "Alle Karten" zeigt sämtliche Karten, "Keine Basis-Karten" blendet Basis-Gold-, Silber- und Bronze-Karten aus und berücksichtigt nur Spezial- oder Upgrade-Versionen, "Nur beste Version" zeigt für jede Spieler-ID ausschließlich die höchstbewertete Variante, und "Nur beste Spezialversion" funktioniert wie „Nur beste Version“, schließt jedoch Basisvarianten vollständig aus.'
		},
		{
			q: 'Wie oft wird die Karten-Datenbank aktualisiert?',
			a: 'Die Karten-Datenbank wird täglich zwischen 19 Uhr und 19:30 Uhr aktualisiert, um neue Karten und Versionen hinzuzufügen. In unserem Discord gibt es dazu auch immer die passenden Updates.'
		},
		{
			q: 'Was passiert wenn man ein anderes Gerät oder einen anderen Browser nutzt?',
			a: 'Deine Sammlung wird lokal in deinem Browser gespeichert. Wenn du ein anderes Gerät oder einen anderen Browser verwendest, ist deine Sammlung dort nicht verfügbar. Du kannst jedoch eine Sicherungskopie deiner Sammlung erstellen und diese auf dem neuen Gerät oder Browser wiederherstellen. Gehe dazu in die Einstellungen und wähle "Sicherungskopie". Dort kannst du deine Sammlung exportieren und später wieder importieren.'
		},
		{
			q: 'Ich habe meinen Fortschritt verloren, was kann ich tun?',
			a: 'Wenn du eine Sicherungskopie exportiert hast, kannst du es über „Einstellungen → Sicherheitskopie“ einfach importieren. Ohne Sicherungskopie kann der lokale Speicher leider nicht wiederhergestellt werden.'
		},
		{
			q: 'Kann ich meine Sammlung sichern?',
			a: 'Ja, du kannst jederzeit eine Sicherungskopie deiner Sammlung erstellen und diese später wiederherstellen. So verlierst du nie deinen Fortschritt. Gehe dazu in die Einstellungen und wähle "Sicherungskopie". Dort kannst du deine Sammlung exportieren und später wieder importieren.'
		},
		{
			q: 'Ist das Sammelheft kostenlos?',
			a: 'Ja, die Nutzung des FUT Sammelhefts ist komplett kostenlos. Es gibt keine versteckten Kosten oder In-App-Käufe.'
		},
		{
			q: 'Ist das FUT Sammelheft ein offizielles EA-Produkt?',
			a: 'Nein. Das Sammelheft ist ein Projekt, welches im Rahmen des "Alle Karten Sammeln"- Projekts von Julian entstanden ist und steht in keiner Verbindung zu EA Sports oder EA Sports FC.'
		},
		{
			q: 'Muss ich mich registrieren?',
			a: 'Nein, eine Registrierung ist nicht erforderlich. Du kannst das FUT Sammelheft sofort und ohne Anmeldung nutzen. Deine Sammlung wird lokal in deinem Browser gespeichert.'
		},
		{
			q: 'Gibt es das FUT Sammelheft als App?',
			a: 'Nein, momentan leider noch nicht, aber das FUT Sammelheft ist als Webanwendung optimiert und funktioniert auf allen Geräten, einschließlich Smartphones und Tablets. Einfach den Link auf deinem Home-Bildschirm speichern für den schnellen Zugriff.'
		},
		{
			q: 'Welche Browser werden unterstützt?',
			a: 'Das FUT Sammelheft funktioniert am besten in modernen Browsern wie Google Chrome, Mozilla Firefox, Microsoft Edge und Safari. Stelle sicher, dass dein Browser auf dem neuesten Stand ist für die beste Erfahrung.'
		},
		{
			q: 'Warum haben manche Spieler kein Gesicht auf der Karte?',
			a: 'Bei einigen Karten können Porträts fehlen oder eine falsche Flagge angezeigt werden. Das liegt an internen Datenkonflikten innerhalb unserer eigenen Datenbank. Wir arbeiten kontinuierlich daran, diese Unstimmigkeiten zu korrigieren, damit alle Karten korrekt dargestellt werden.'
		},
		{
			q: 'Wo finde ich Hilfe oder Support?',
			a: 'Bei Fragen oder Problemen kannst du uns über unseren Discord-Server im entsprechenden Kanal kontaktieren. Wir und die immer weiter wachsende Community helfen dir gerne weiter!'
		}
	];
	let openIndex = null;

	function toggle(idx) {
		openIndex = openIndex === idx ? null : idx;
	}
</script>

<div class="w-[95%] md:max-w-3xl mx-auto mt-4 md:mt-20 bg-black/70 p-6 text-white">
	<h1 class="text-xl md:text-3xl font-bold mb-6">Häufig gestellte Fragen (FAQ)</h1>

	{#each faq as item, i}
		<div class="border-b border-gray-300 py-4">
			<button
				on:click={() => toggle(i)}
				class="w-full flex gap-4 items-center text-left text-base md:text-xl font-semibold"
			>
				<span
					class="text-gray-500 transition-transform duration-300"
					style="transform: rotate({openIndex === i ? 90 : 0}deg);"
				>
					▶
				</span>
				<span>{item.q}</span>
			</button>

			{#if openIndex === i}
				<p class="mt-3 text-sm transition-all duration-300">
					{item.a}
				</p>
			{/if}
		</div>
	{/each}
	<div class="mt-6 text-base md:text-lg font-semibold flex flex-col gap-2">
		<span
			>Habt ihr noch weitere Fragen? Besucht gerne unseren <a
				href="https://discord.gg/f65x7YYQVU"
				target="_blank"
				class="underline"
				rel="noopener noreferrer">Discord-Server</a
			>.
		</span>
		<span>Dort wird euch sicherlich geholfen! Wir freuen uns auf euch!</span>
	</div>
	<h4 class="mt-4 font-bold justify-center flex gap-4 text-xl w-full">
        ~
		<a href="https://www.instagram.com/julianfgu/" target="_blank">Julian</a> und
		<a href="https://www.instagram.com/flo.kysr/" target="_blank">Flo</a>
        ~
	</h4>
</div>
