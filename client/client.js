console.log("hello world");

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL = 'http://localhost:5000/slats';
const slatsElement = document.querySelector('.slats');

loadingElement.style.display = 'none';

listAllSlats();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
   
    const slat = {
        name,
        content
    };
    form.style.display = '';
    loadingElement.style.display = '';
    

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(slat),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdSlat => {
        form.reset();
        setTimeout(() => { 
            form.style.display = ''; 
        }, 3000);
        listAllSlats();   
      });
});

function listAllSlats(){
    slatsElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(slats => {
            console.log(slats);
            slats.reverse();
            slats.forEach(slat => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = slat.name;

                const contents = document.createElement('p')
                contents.textContent = slat.content;

                const date = document.createElement('small')
                date.textContent = new Date(slat.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                slatsElement.appendChild(div);

            });
            loadingElement.style.display = 'none';
        });
}

