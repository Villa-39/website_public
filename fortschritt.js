/*
 * Fortschrittsbalken: liest die Zahlen aus fortschritt.json.
 * Zum Aktualisieren nur "aktuell" und "stand" in fortschritt.json ändern.
 */
(function () {
    'use strict';

    var box = document.getElementById('fund');
    if (!box) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function euro(value) {
        return Math.round(value).toLocaleString('de-DE') + ' €';
    }

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    /*
     * Meilensteine: Striche im Hauptbalken + ausklappbare Einzelbalken.
     * Jeder Meilenstein ist ein Abschnitt mit der Größe "betrag"; die Abschnitte
     * werden der Reihe nach aufgefüllt. Volle Abschnitte werden grau ("Geschafft!").
     */
    function buildMilestones(list, current, goal) {
        if (!Array.isArray(list) || !list.length) return;

        var items = [];
        var start = 0;
        list.forEach(function (m) {
            var size = Number(m.betrag);
            if (!m.titel || !(size > 0)) return;
            items.push({
                title: m.titel,
                size: size,
                start: start,
                progress: Math.max(0, Math.min(size, current - start))
            });
            start += size;
        });
        if (!items.length) return;

        // Striche im Hauptbalken (nur innerhalb des Zwischenziels)
        var track = box.querySelector('.fund-track');
        items.forEach(function (item) {
            var end = item.start + item.size;
            if (end >= goal) return;
            var tick = el('span', 'fund-tick');
            tick.style.left = (end / goal * 100) + '%';
            track.appendChild(tick);
        });

        // Ausklappbereich
        var toggle = el('button', 'inline-link fund-toggle', 'Meilensteine anzeigen');
        toggle.type = 'button';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'fundMilestones');

        var panel = el('div', 'ms-panel');
        panel.id = 'fundMilestones';
        var inner = el('div', 'ms-inner');
        var ol = el('ol', 'ms-list');
        var rows = items.map(function (item) {
            var li = el('li', 'ms-item');
            var head = el('div', 'ms-head');
            head.appendChild(el('span', 'ms-title', item.title));
            head.appendChild(el('span', 'ms-amount', euro(item.size)));
            var bar = el('div', 'ms-track');
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-label', item.title);
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', String(item.size));
            bar.setAttribute('aria-valuenow', String(item.progress));
            var full = item.progress >= item.size;
            bar.setAttribute('aria-valuetext', full ? 'geschafft' : euro(item.progress) + ' von ' + euro(item.size));
            var fill = el('div', 'ms-fill');
            bar.appendChild(fill);
            var stamp = el('span', 'ms-stamp', 'Geschafft!');
            stamp.setAttribute('aria-hidden', 'true');
            li.appendChild(head);
            li.appendChild(bar);
            li.appendChild(stamp);
            ol.appendChild(li);
            return { li: li, fill: fill, item: item, full: full };
        });
        inner.appendChild(ol);
        panel.appendChild(inner);

        var note = box.querySelector('.fund-note');
        note.insertAdjacentElement('afterend', panel);
        note.insertAdjacentElement('afterend', el('p', 'fund-toggle-wrap')).appendChild(toggle);

        var timers = [];
        var STEP = 800; // Dauer, bis ein Abschnitt gefüllt ist

        function reset() {
            timers.forEach(clearTimeout);
            timers = [];
            rows.forEach(function (row) {
                row.li.classList.remove('is-done', 'is-stamped');
                row.fill.style.transition = 'none';
                row.fill.style.width = '0';
            });
        }

        function play() {
            reset();
            void panel.offsetWidth; // Rücksetzen erzwingen, damit die Animation neu startet
            var delay = 250;
            rows.forEach(function (row) {
                var pct = row.item.progress / row.item.size * 100;
                if (reduceMotion) {
                    row.fill.style.width = pct + '%';
                    if (row.full) row.li.classList.add('is-done', 'is-stamped');
                    return;
                }
                var duration = pct > 0 ? STEP : 0;
                row.fill.style.transition = 'width ' + duration + 'ms cubic-bezier(.22,.61,.36,1) ' + delay + 'ms';
                row.fill.style.width = pct + '%';
                if (row.full) {
                    timers.push(setTimeout(function () { row.li.classList.add('is-done'); }, delay + duration));
                    timers.push(setTimeout(function () { row.li.classList.add('is-stamped'); }, delay + duration + 150));
                }
                delay += duration;
            });
        }

        toggle.addEventListener('click', function () {
            var open = panel.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.textContent = open ? 'Meilensteine ausblenden' : 'Meilensteine anzeigen';
            if (open) setTimeout(play, 150);
        });
    }

    fetch('fortschritt.json')
        .then(function (res) {
            if (!res.ok) throw new Error('fortschritt.json nicht gefunden');
            return res.json();
        })
        .then(function (data) {
            var current = Number(data.aktuell);
            var goal = Number(data.ziel);
            if (!(goal > 0) || !(current >= 0)) return;

            var percent = Math.min(100, current / goal * 100);
            var nowEl = box.querySelector('.fund-now');
            var goalEl = box.querySelector('.fund-goal');
            var fill = box.querySelector('.fund-fill');
            var track = box.querySelector('.fund-track');
            var dateEl = box.querySelector('.fund-date');

            goalEl.textContent = euro(goal);
            nowEl.textContent = euro(reduceMotion ? current : 0);
            track.setAttribute('aria-valuemax', String(goal));
            track.setAttribute('aria-valuenow', String(current));
            track.setAttribute('aria-valuetext', euro(current) + ' von ' + euro(goal));

            if (data.stand && dateEl) {
                var date = new Date(data.stand + 'T00:00:00');
                if (!isNaN(date)) {
                    dateEl.textContent = 'Stand: ' + date.toLocaleDateString('de-DE', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    });
                }
            }

            box.hidden = false;

            buildMilestones(data.meilensteine, current, goal);

            function play() {
                fill.style.width = percent + '%';
                if (reduceMotion) return;
                var start = null;
                var duration = 1400;
                function step(ts) {
                    if (start === null) start = ts;
                    var t = Math.min(1, (ts - start) / duration);
                    var eased = 1 - Math.pow(1 - t, 3);
                    nowEl.textContent = euro(current * eased);
                    if (t < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            }

            if (reduceMotion || !('IntersectionObserver' in window)) {
                play();
                return;
            }
            var observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    play();
                }
            }, { threshold: 0.5 });
            observer.observe(box);
        })
        .catch(function () { /* Ohne Daten bleibt der Balken einfach ausgeblendet. */ });
})();
