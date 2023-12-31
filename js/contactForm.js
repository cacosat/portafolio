

// using (function() {})() is an Inmediately Invoked 
// Function Expression (IIFE) and allows to execute the 
// function upon being defined and creates a private scope
// for the code. This ensures it runs inmediately and 
// prevents confflicts with other scripts.
(function() {
    emailjs.init('6ZZnr0mA6cXVvLYbw'); // Account public key
})();

window.onload = function () {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function(event){
        event.preventDefault();
        // 5 digit ID to identify messages
        this.contact_id.value = Math.random() * 100000 | 0; 
        // random between [0,1] *100,000 and truncated to integer

        // send, through serviceID and with templateID, the `this`
        // of the form element (the content of the form)
        const serviceID = 'portfolio_gmail';
        const templateID = 'template_k7auu2n';
        emailjs.sendForm(serviceID, templateID, this)
            .then(function() {
                console.log('Enviado!');
                alert('Mensaje enviado!');
                form.reset();git 
            }, function(error) {
                console.log('Fallo el envío: ', error);
                alert(`Falló el envío (${error})`)
            });
    });
}