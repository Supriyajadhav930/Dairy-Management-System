document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // CONTACT CARD ANIMATION
    // ==============================

    const contactCard =
        document.querySelector(".contact-card");

    if (contactCard) {

        contactCard.style.opacity = "0";

        contactCard.style.transform =
            "translateY(15px)";


        setTimeout(function () {

            contactCard.style.transition =
                "opacity 0.5s ease, transform 0.5s ease";

            contactCard.style.opacity = "1";

            contactCard.style.transform =
                "translateY(0)";

        }, 100);

    }


    // ==============================
    // CONTACT ITEM ANIMATION
    // ==============================

    const contactItems =
        document.querySelectorAll(".contact-item");


    contactItems.forEach(function (item, index) {

        item.style.opacity = "0";

        item.style.transform =
            "translateX(-15px)";


        setTimeout(function () {

            item.style.transition =
                "opacity 0.4s ease, transform 0.4s ease";

            item.style.opacity = "1";

            item.style.transform =
                "translateX(0)";

        }, 250 + (index * 100));

    });

});