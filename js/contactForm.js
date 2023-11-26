

// using (function() {})() is an Inmediately Invoked 
// Function Expression (IIFE) and allows to execute the 
// function upon being defined and creates a private scope
// for the code. This ensures it runs inmediately and 
// prevents confflicts with other scripts.
(function() {
    emailjs.init('6ZZnr0mA6cXVvLYbw'); // Account public key
})();

window.onload = function () {
    document.getElementById('contact-form').addEventListener('submit', function(event){
        event.preventDefault();
        // 5 digit ID to identify messages
        this.id.value = Math.random() * 100000 | 0; 
        // random between [0,1] *100,000 and truncated to integer
        
        emailjs.sendForm('portfolio_gmail', 'template_k7auu2n', this)
            .then(function() {
                console.log('Enviado!');
            }, function(error) {
                console.log('Fallo el envío: ', error);
            });
    });
}