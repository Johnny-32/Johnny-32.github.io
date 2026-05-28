// ZAPISYWANIE WARTOSCI Z WYSZUKIWANIA Z INDEX.HTML 
document.addEventListener("DOMContentLoaded", () => {
    const przyciskWyszukiwanie = document.getElementById("przycisk-wyszukiwanie");
    const inputWyszukiwanie = document.getElementById("input-wyszukiwanie");

    przyciskWyszukiwanie.addEventListener("click", (e) => {
        // Zapobiegamy domyślnemu wysłaniu formularza, które przeładowałoby index.html
        e.preventDefault();

        // Zapisujemy wybraną wartość w localStorage
        localStorage.setItem("zapisaneMiejsce", inputWyszukiwanie.value);

        // Przekierowujemy użytkownika bezpośrednio do sekcji formularza na planner.html
        window.location.href = "planner.html#formularz-sekcja";
    });


    // WYŚWIETLANIE I FILTROWANIE LISTY WYPRAW
    let output = document.getElementById("lista-wybranych-miejsc");
    let listaWypraw = JSON.parse(localStorage.getItem("listaWypraw")) || [];
    let inputFiltrujWyprawy = document.getElementById("input-filtruj-wyprawy");

    function renderujTabele(filtrTekst = "") {
        if (!output) return;
        output.innerHTML = "";

        if (listaWypraw.length === 0) {
            output.innerHTML += "<p class='text-center'>Twoja lista wypraw jest pusta</p>";
            return;
        }

        let regex = new RegExp(filtrTekst, "i");
        let table = `
        <table class="table align-middle table-hover mt-3">
            <thead>
                <tr>
                    <th>Nazwa wyprawy</th>
                    <th>Miejsce</th>
                    <th>Data rozpoczęcia</th>
                    <th>Data zakończenia</th>
                    <th>Rodzaj transportu</th>
                    <th>Uwagi</th>
                    <th>Akcje</th>
                </tr>
            </thead>
            <tbody>
        `;

        let znalezionoPasujaceWyprawy = false;

        for (let i = 0; i < listaWypraw.length; i++) {
            if (!regex.test(listaWypraw[i].nazwaWyprawy)) {
                continue;
            }

            znalezionoPasujaceWyprawy = true;
            table += `
            <tr>
                <td>${listaWypraw[i].nazwaWyprawy}</td>
                <td>${listaWypraw[i].miejsce}</td>
                <td>${listaWypraw[i].dataRozpoczecia}</td>
                <td>${listaWypraw[i].dataZakonczenia}</td>
                <td>${listaWypraw[i].rodzajTransportu}</td>
                <td>${listaWypraw[i].uwagi}</td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <button type="button" class="btn btn-sm btn-primary edytujWyprawe flex-grow-1" data-index="${i}">Edytuj</button>
                        <button type="button" class="btn btn-sm btn-danger usunWyprawe flex-grow-1" data-index="${i}">Usuń</button>
                    </div>
                </td>
            </tr>
        `;
        }

        table += "</tbody></table>";

        if (znalezionoPasujaceWyprawy) {
            output.innerHTML = table;
        } else {
            output.innerHTML = "<p>Brak wypraw pasujących do kryteriów wyszukiwania.</p>";
        }
    }

    // Wywołanie po wejściu na stronę: 
    if (output) {
        renderujTabele();
    }

    // Przy każdym kliknięciu klawisza zachodzi filtrowanie
    if (inputFiltrujWyprawy) {
        inputFiltrujWyprawy.addEventListener("keyup", () => {
            renderujTabele(inputFiltrujWyprawy.value);
        });
    }


    //USUWANIE WSZYSTKICH WYPRAW
    let usunWszystkieWyprawy = document.getElementById("usunWszystkieWyprawy");

    usunWszystkieWyprawy.addEventListener("click", () => {
        if (confirm("Czy na pewno chcesz usunąć wszystkie wyprawy?")) {
            localStorage.removeItem("listaWypraw");
            listaWypraw = [];
            renderujTabele();
        }
    });


    output.addEventListener("click", function (event) {
        // USUWANIE WYBRANEJ WYPRAWY
        if (event.target.classList.contains("usunWyprawe")) {
            const index = Number(event.target.getAttribute("data-index"));
            usunProdukt(index);
        }

        // EDYTOWANIE WYBRANEJ WYPRAWY
        if (event.target.classList.contains("edytujWyprawe")) {
            const index = Number(event.target.getAttribute("data-index"));
            edytujProdukt(index);
        }
    });

    function usunProdukt(i) {
        if (confirm("Usunąć ten produkt z koszyka?")) {
            listaWypraw.splice(i, 1);
            localStorage.setItem("listaWypraw", JSON.stringify(listaWypraw));
            const filtr = inputFiltrujWyprawy ? inputFiltrujWyprawy.value : "";
            renderujTabele(filtr);
        }
    }

    function edytujProdukt(i) {
        localStorage.setItem("edytujIndeks", i);
        window.location.href = "planner.html#formularz-sekcja";
    }


    // CAROUSEL
    const carouselKontener = document.getElementById("carousel-kontener");

    function pobierzZdjeciaDlaMiejsca(wybraneMiejsce) {
        if (!carouselKontener) return;

        fetch("js/galeria.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Nie udało się pobrać pliku JSON");
                }
                return response.json();
            })
            .then(dane => {
                const zdjecia = dane[wybraneMiejsce];

                if (zdjecia && zdjecia.length > 0) {
                    renderujKaruzele(zdjecia);
                } else {
                    document.getElementById("karuzela-wskazniki").innerHTML = "";
                    document.getElementById("karuzela-slajdy").innerHTML = `
                    <div class="text-center text-muted">
                        Brak dostępnych zdjęć dla tego miejsca
                    </div>
                `;

                    carouselKontener.classList.remove("d-none");
                }
            })
            .catch(error => {
                console.error("Błąd podczas ładowania galerii:", error);

                document.getElementById("karuzela-wskazniki").innerHTML = "";
                document.getElementById("karuzela-slajdy").innerHTML = `
                <div class="text-center text-danger">
                    Wystąpił błąd podczas ładowania zdjęć
                </div>
            `;

                carouselKontener.classList.remove("d-none");
            });
    }

    if (inputWyszukiwanie) {
        pobierzZdjeciaDlaMiejsca(inputWyszukiwanie.value);

        inputWyszukiwanie.addEventListener("change", (e) => {
            pobierzZdjeciaDlaMiejsca(e.target.value);
        });
    }

    function renderujKaruzele(tablicaZdjec) {
        const kontenerWskaznikow = document.getElementById("karuzela-wskazniki");
        const kontenerSlajdow = document.getElementById("karuzela-slajdy");

        if (!kontenerWskaznikow || !kontenerSlajdow) return;

        let wskaznikiHTML = "";
        let slajdyHTML = "";

        for (let i = 0; i < tablicaZdjec.length; i++) {
            let url = tablicaZdjec[i];
            let klasaAktywna = i === 0 ? "active" : "";
            let atrybutBiezacy = i === 0 ? 'class="active" aria-current="true"' : "";

            wskaznikiHTML += `
                <button type="button" data-bs-target="#carousel-kontener" data-bs-slide-to="${i}" class="${klasaAktywna}" ${atrybutBiezacy}></button>
            `;

            slajdyHTML += `
                <div class="carousel-item ${klasaAktywna}">
                    <img src="${url}" class="d-block w-100 rounded" style="object-fit: cover; height: 400px;" alt="Slajd">
                </div>
            `;
        }

        kontenerWskaznikow.innerHTML = wskaznikiHTML;
        kontenerSlajdow.innerHTML = slajdyHTML;

        carouselKontener.classList.remove("d-none");
        if (typeof bootstrap !== 'undefined') {
            bootstrap.Carousel.getOrCreateInstance(carouselKontener).to(0);
        }
    }
});
