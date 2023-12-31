const leftArrow = document.querySelector('.prev-btn');
const rightArrow = document.querySelector('.next-btn');
const carrousel = document.querySelector('.carrousel');
const card = document.querySelector('.card'); // selects first card
const cardCollection = [...carrousel.children]; // HTMLCollection to Array

// getComputedStyle() makes an array of objects with all styles
const carrouselStyles = getComputedStyle(carrousel);
const cardWidth = card.offsetWidth + parseInt(carrouselStyles.gap); // gap gives '48px'

function scrollCarrousel (event) {
    if (event.target === rightArrow || 
        event.target === rightArrow.childNodes[1]) { //checks click on img within container
        carrousel.scrollLeft += cardWidth;
    } else if (event.target === leftArrow || 
        event.target === leftArrow.childNodes[1]) {
        carrousel.scrollLeft -= cardWidth;
    }
}

// function to handle scrolling

rightArrow.addEventListener('click', function (event) {
    scrollCarrousel(event);
});

leftArrow.addEventListener('click', function (event) {
    scrollCarrousel(event);
});