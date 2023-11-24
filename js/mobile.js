const mobileIcon = document.querySelector('.nav-mobile');
const cvBtn = document.querySelector('.cv-btn');
const navItems = document.querySelector('.nav-items');
const mobileItems = document.querySelector('.items-mobile');
const navBar = document.querySelector('.nav-bar');
const blogBtns = document.querySelectorAll('.nav__blog');

mobileIcon.addEventListener('click', function(event) {
    // event.preventDefault();
    console.log('test');
    navBar.classList.toggle('nav-bar-active');
    mobileItems.classList.toggle('items-mobile-active');
    cvBtn.classList.toggle('cv-btn-inactive');
});


for (let i = 0; i < blogBtns.length; i++) {
    blogBtns[i].addEventListener('click', function(event) {
        alert('Sección aún no habilitada');
    });
}
