
function actualizeazaTabelSiTotal() {
    const listaServiciiElement = document.getElementById("services-list");
    const pretTotalElement = document.getElementById("total-price");
    
    let total = 0;
    let HTMLRanduri = "";


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


    if (HTMLRanduri === "") {
        HTMLRanduri = `<tr><td colspan="3" class="text-muted text-center">Niciun serviciu selectat</td></tr>`;
    }

    listaServiciiElement.innerHTML = HTMLRanduri;
    pretTotalElement.innerHTML = `<strong>${total} MDL</strong>`;

    return total;
}


document.querySelectorAll(".service-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", actualizeazaTabelSiTotal);
});


document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault(); 
    let nume = document.getElementById("name").value;
    let telefon = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let data = document.getElementById("date").value;
    let ora = document.getElementById("time").value;

    let serviciiSelectate = [];
    document.querySelectorAll(".service-checkbox:checked").forEach(checkbox => {
        serviciiSelectate.push(checkbox.getAttribute("data-name"));
    });

    let pretTotal = actualizeazaTabelSiTotal();

    
    if (serviciiSelectate.length === 0) {
        alert("Te rugăm să bifezi cel puțin un serviciu din cele de mai sus!");
        return;
    }

   
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
            document.getElementById("bookingForm").reset(); 
            actualizeazaTabelSiTotal(); 
            alert("Eroare la salvare: " + (data.error || "Eroare necunoscută."));
        }
    })
    .catch(err => {
        console.error("Eroare fetch:", err);
        alert("A apărut o problemă la comunicarea cu serverul.");
    });
});