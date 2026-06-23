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
        HTMLRanduri = `
            <tr>
                <td colspan="3" class="text-muted text-center">
                    Niciun serviciu selectat
                </td>
            </tr>
        `;
    }

    if (listaServiciiElement) {
        listaServiciiElement.innerHTML = HTMLRanduri;
    }

    if (pretTotalElement) {
        pretTotalElement.innerHTML = `<strong>${total} MDL</strong>`;
    }

    return total;
}

document.addEventListener("DOMContentLoaded", () => {

    const checkboxes = document.querySelectorAll(".service-checkbox");

    if (checkboxes.length > 0) {

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", actualizeazaTabelSiTotal);
        });

        actualizeazaTabelSiTotal();
    }

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {

        bookingForm.addEventListener("submit", function (e) {

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
                alert("Te rugăm să selectezi cel puțin un serviciu!");
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
                    throw new Error("Răspuns server invalid.");
                }
                return res.json();
            })

            .then(data => {

                if (data.success) {

                    alert("Programarea a fost salvată cu succes!");

                    bookingForm.reset();

                    actualizeazaTabelSiTotal();

                } else {

                    alert("Eroare la salvare: " + (data.error || "Eroare necunoscută."));

                }

            })

            .catch(err => {

                console.error(err);

                alert("A apărut o problemă la comunicarea cu serverul.");

            });

        });

    }

    const counters = document.querySelectorAll(".counter-number");
    const counterSection = document.querySelector(".counter");

    if (counterSection && counters.length > 0) {

        const animateCounters = () => {

            counters.forEach(counter => {

                const target = parseInt(counter.dataset.target);
                const duration = 2000;
                const increment = target / (duration / 16);

                let current = 0;

                const updateCounter = () => {

                    current += increment;

                    if (current < target) {

                        counter.innerText = Math.floor(current);

                        requestAnimationFrame(updateCounter);

                    } else {

                        counter.innerText = target;

                    }

                };

                updateCounter();

            });

        };

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    animateCounters();

                    observer.unobserve(counterSection);

                }

            });

        }, {
            threshold: 0.3
        });

        observer.observe(counterSection);

    }

});