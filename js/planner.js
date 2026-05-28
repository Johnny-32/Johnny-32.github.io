document.addEventListener("DOMContentLoaded", () => {

    //UZUPEŁNIANIE POLA MIEJSCE FORMULARZA Z WYSZUKIWARKI Z INDEX.HTML
    const zapisaneMiejsce = localStorage.getItem("zapisaneMiejsce");
    const miejsceFormularza = document.getElementById("miejsce");

    if (zapisaneMiejsce && miejsceFormularza) {
        // Mapujemy wartości z selecta na ładniejsze nazwy dla użytkownika
        let ladnaNazwa = zapisaneMiejsce;
        if (zapisaneMiejsce === "rzym") ladnaNazwa = "Rzym";
        else if (zapisaneMiejsce === "lazurowe-wybrzeze") ladnaNazwa = "Lazurowe Wybrzeże";
        else if (zapisaneMiejsce === "ateny") ladnaNazwa = "Ateny";
        else if (zapisaneMiejsce === "barcelona") ladnaNazwa = "Barcelona";

        // Wpisujemy wartość do pola tekstowego
        miejsceFormularza.value = ladnaNazwa;

        // Czyścimy localStorage, żeby po zwykłym odświeżeniu planner.html formularz znów był pusty
        localStorage.removeItem("zapisaneMiejsce");
    }

    // EDYTOWANIE DANEJ WYPRAWY
    const zapiszWyprawe = document.getElementById("zapisz-wyprawe");

    let editIndeks = JSON.parse(localStorage.getItem("edytujIndeks")) ?? -1;

    let listaWypraw = JSON.parse(localStorage.getItem("listaWypraw")) || [];
    const wyprawaDoEdycji = listaWypraw[editIndeks];

    if (wyprawaDoEdycji) {
        document.getElementById("nazwa-wyprawy").value = wyprawaDoEdycji.nazwaWyprawy;
        document.getElementById("miejsce").value = wyprawaDoEdycji.miejsce;
        document.getElementById("data-rozpoczecia").value = wyprawaDoEdycji.dataRozpoczecia;
        document.getElementById("data-zakonczenia").value = wyprawaDoEdycji.dataZakonczenia;
        document.getElementById("formularz-wyprawy")['rodzaj-transportu'].value = wyprawaDoEdycji.rodzajTransportu;
        document.getElementById("ubezpieczenie").value = wyprawaDoEdycji.ubezpieczenie;
        document.getElementById("przewodnik").value = wyprawaDoEdycji.przewodnik;
        document.getElementById("uwagi").value = wyprawaDoEdycji.uwagi;

        zapiszWyprawe.textContent = "Zaktualizuj wyprawę";
    }

    // Czyścimy localStorage natychmiast po wczytaniu, aby zwykłe odświeżenie strony 
    // nie blokowało formularza w trybie edycji. Zmienna `editIndeks` wciąż pamięta numer!
    localStorage.removeItem("edytujIndeks");

    // === KONIEC NOWEGO KODU ===

    //ZAPISYWANIE WYNIKU FORMULARZA DO LOCAL STORAGE PO KLIKNIĘCIU PRZYCISKU
    zapiszWyprawe.addEventListener("click", (e) => {
        e.preventDefault();

        const nazwaWyprawy = document.getElementById("nazwa-wyprawy").value;
        const miejsce = document.getElementById("miejsce").value;
        const dataRozpoczecia = document.getElementById("data-rozpoczecia").value;
        const dataZakonczenia = document.getElementById("data-zakonczenia").value;
        const rodzajTransportu = document.querySelector('input[name="rodzaj-transportu"]:checked').value;
        const ubezpieczenie = document.getElementById("ubezpieczenie").value;
        const przewodnik = document.getElementById("przewodnik").value;
        const uwagi = document.getElementById("uwagi").value;

        let wyprawa = {
            nazwaWyprawy,
            miejsce,
            dataRozpoczecia,
            dataZakonczenia,
            rodzajTransportu,
            ubezpieczenie,
            przewodnik,
            uwagi
        };

        // Pobieramy świeżą listę przed zapisem
        listaWypraw = JSON.parse(localStorage.getItem("listaWypraw")) || [];

        if (editIndeks >= 0) {
            listaWypraw[editIndeks] = wyprawa;
            editIndeks = -1;
            alert("Wyprawa została zaktualizowana");
        } else {
            listaWypraw.push(wyprawa);
            alert("Wyprawa została dodana pomyślnie");
        }

        localStorage.setItem("listaWypraw", JSON.stringify(listaWypraw));
        window.location.href = "index.html#wybrane-miejsca";
    });
});