
window.onload = function() {
    // change bi-circle to bi-circle-fill on hover
    toggleCircleIcons();

    // while mouse down on the icon, toggle the fs-3 class
    growIconOnClick();

    // make all cards equal height
    makeCardsEqualHeight();

    // add border-success class on hover
    cardBorderOnHover();
};

function toggleCircleIcons() {
    const icons = document.querySelectorAll('.bi-circle');

    icons.forEach(icon => {
        icon.addEventListener('mouseover', function() {
            this.classList.remove('bi-circle');
            this.classList.add('bi-circle-fill');
        });

        icon.addEventListener('mouseout', function() {
            this.classList.remove('bi-circle-fill');
            this.classList.add('bi-circle');
        });
    });
}

function growIconOnClick() {
    const icons = document.querySelectorAll('.bi-circle, .bi-circle-fill');
    icons.forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.add('fs-4');
            setTimeout(() => {
                this.classList.remove('fs-4');
            }, 500); // Toggle back after 1 second
        });
    });
}

function makeCardsEqualHeight() {
    const cards = document.querySelectorAll('.card');
    let maxHeight = 0;

    // Reset heights
    cards.forEach(card => {
        card.style.height = 'auto';
    });

    // Find the maximum height
    cards.forEach(card => {
        if (card.offsetHeight > maxHeight) {
            maxHeight = card.offsetHeight;
        }
    });

    // Set all cards to the maximum height
    cards.forEach(card => {
        card.style.height = maxHeight + 'px';
    });
}

function cardBorderOnHover() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.classList.add('border-success');
            // add to card-header as well
            const header = this.querySelector('.card-header');
            if (header) {
                header.classList.add('border-success');
            }
        });

        card.addEventListener('mouseout', function() {
            this.classList.remove('border-success');
            // remove from card-header as well
            const header = this.querySelector('.card-header');
            if (header) {
                header.classList.remove('border-success');
            }
        });
    });
}