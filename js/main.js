// Funcție care calculează prețul în timp real și modifică tabelul din pagină
function actualizeazaTabelSiTotal() {
    const listaServiciiElement = document.getElementById("services-list");
    const pretTotalElement = document.getElementById("total-price");
    
    let total = 0;
    let HTMLRanduri = "";

    // Colectăm toate checkbox-urile active
    document.querySelectorAll(".service-checkbox:checked").forEach(checkbox => {
        const numeServiciu = checkbox.getAttribute("data-name");
        const pretServiciu = parseFloat(checkbox.value) || 0;

        total += pretServiciu;

        HTMLRanduri += `
            <tr>
                <td>${numeServiciu}</td>
                <td class="text-muted">Glamour Experience</td>
                <td class="fw-bold">${pretServiciu} MDL</td>
            </tr>
        `;
    });

    // Afișăm un placeholder vizual dacă nu s-a selectat nimic
    if (HTMLRanduri === "") {
        HTMLRanduri = `<tr><td colspan="3" class="text-muted text-center">Niciun serviciu selectat</td></tr>`;
    }

    listaServiciiElement.innerHTML = HTMLRanduri;
    pretTotalElement.innerHTML = `<strong>${total} MDL</strong>`;

    return total;
}

// Adăugăm eveniment de tip "change" pe fiecare căsuță pentru actualizare dinamică
document.querySelectorAll(".service-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", actualizeazaTabelSiTotal);
});

// Evenimentul principal de trimitere a formularului (Submit)
document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Oprim reîncărcarea nativă a paginii

    let nume = document.getElementById("name").value;
    let telefon = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let data = document.getElementById("date").value;
    let ora = document.getElementById("time").value;

    // Colectăm numele serviciilor selectate pentru a fi trimise ca array
    let serviciiSelectate = [];
    document.querySelectorAll(".service-checkbox:checked").forEach(checkbox => {
        serviciiSelectate.push(checkbox.getAttribute("data-name"));
    });

    let pretTotal = actualizeazaTabelSiTotal();

    // Verificare împotriva trimiterilor fără servicii bifate
    if (serviciiSelectate.length === 0) {
        alert("Te rugăm să bifezi cel puțin un serviciu din cele de mai sus!");
        return;
    }

    // Expedierea datelor prin Fetch API
    fetch("api/programari.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nume: nume,
            telefon: telefon,
            email: email,
            servicii: serviciiSelectate,
            data: data,
            ora: ora,
            pret: pretTotal
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Răspuns server invalid HTTP");
        }
        return res.json();
    })
    .then(data => {
        if (data.success) {
            alert("Programarea a fost salvată cu succes!");
            document.getElementById("bookingForm").reset(); // Curățăm câmpurile text/date
            actualizeazaTabelSiTotal(); // Resetăm tabelul vizual înapoi la 0 MDL
        } else {
            alert("Eroare la salvare: " + (data.error || "Eroare necunoscută."));
        }
    })
    .catch(err => {
        console.error("Eroare fetch:", err);
        alert("A apărut o problemă la comunicarea cu serverul.");
    });
});