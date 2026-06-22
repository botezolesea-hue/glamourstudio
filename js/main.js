document.addEventListener("DOMContentLoaded", () => {

    console.log("main.js s-a încărcat");

    // === 1. ANIMAȚIE NUMERE ===
    const counters = document.querySelectorAll(".counter-number");

    const startCounters = () => {
        counters.forEach(counter => {

            if (counter.classList.contains("started")) return;

            counter.classList.add("started");

            const updateCounter = () => {
                const target = Number(counter.getAttribute("data-target"));
                const count = Number(counter.innerText);
                const increment = target / 100;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };

            updateCounter();
        });
    };

    const section = document.querySelector(".counter");

    if (section) {
        window.addEventListener("scroll", () => {
            const top = section.getBoundingClientRect().top;

            if (top < window.innerHeight - 100) {
                startCounters();
            }
        });
    }


    // === 2. FORMULAR PROGRAMARE ===
    const bookingForm = document.getElementById("bookingForm");
    const serviceSelect = document.getElementById("service");
    const priceSpan = document.getElementById("price");

    if (serviceSelect && priceSpan) {

        const updatePriceOnScreen = () => {
            priceSpan.innerText = serviceSelect.value || "0";
        };

        serviceSelect.addEventListener("change", updatePriceOnScreen);
        updatePriceOnScreen();
    }

    if (bookingForm) {

        bookingForm.addEventListener("submit", (e) => {

            e.preventDefault();

            console.log("Buton apăsat");

            const selectedOption =
                serviceSelect.options[serviceSelect.selectedIndex];

            const formData = {
                nume: document.getElementById("name").value,
                telefon: document.getElementById("phone").value,
                email: document.getElementById("email").value,
                serviciu: selectedOption.text,
                data: document.getElementById("date").value,
                ora: document.getElementById("time").value
            };

            console.log(formData);

            fetch("api/addProgramare.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.text())
            .then(result => {

                console.log("Răspuns PHP:", result);

                let data;

                try {
                    data = JSON.parse(result);
                }
                catch (err) {
                    alert("PHP nu a returnat JSON valid.");
                    console.error(result);
                    return;
                }

                if (data.success) {

                    alert("Programarea a fost înregistrată cu succes!");

                    bookingForm.reset();

                    if (priceSpan) {
                        priceSpan.innerText = "0";
                    }

                } else {

                    alert("Eroare: " + data.error);

                }

            })
            .catch(error => {

                console.error(error);

                alert("Eroare la conectarea cu serverul.");

            });

        });

    }


    // === 3. FILTRARE SERVICII ===
    const filterButtons = document.querySelectorAll(".filter-btn");
    const serviceItems = document.querySelectorAll(".service-item");

    if (filterButtons.length > 0 && serviceItems.length > 0) {

        filterButtons.forEach(button => {

            button.addEventListener("click", () => {

                const filterValue = button.getAttribute("data-filter");

                serviceItems.forEach(item => {

                    if (
                        filterValue === "all" ||
                        item.classList.contains(filterValue)
                    ) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }

                });

            });

        });

    }

});


// === LIGHTBOX ===

function openImg(element) {

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");

    if (lightbox && lightboxImg) {
        lightboxImg.src = element.src;
        lightbox.style.display = "flex";
    }

}

function closeImg() {

    const lightbox = document.getElementById("lightbox");

    if (lightbox) {
        lightbox.style.display = "none";
    }
}
