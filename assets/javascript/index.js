const container = document.querySelector('#products');
const form = document.querySelector('.form-inline');
const load = document.querySelector('#cargando');
const container_categories = document.querySelector('.dropdown-menu');

let products = [];
let categories = [];

const fecthProductData = async function(){
  let response =   await fetch('https://bsale-challenge.herokuapp.com/api/products').then((res) => res.json())

  products = response;

  if (products) load.style.display = 'none';
  
  try{  
    products.map(({url_image, name, price}) => {
      //validamos que la imagen sea valida, para evitar hacer render de elementos incompletos
      if(url_image) createCard(url_image, name, price)
      
    });
  }
  catch(err){
    alert(err);
  }

}

/* Consume las categorias */
const fetchCategoriesData = async function() {
  let response =   await fetch('https://bsale-challenge.herokuapp.com/api/categories').then((res) => res.json())

  categories = response;

  try{
    categories.map(({id, name}) => {
      createCategory(name, name, id);
    })
  }catch(err){
    alert(err);
  }

}

//crea lo elementos necesarios en el dom con las clases de bootstrap
function createCard(url_image, title, price){
  //creando elementos
  let columnContainer = document.createElement('div');
  let cardContainer = document.createElement('div');
  let productImage = document.createElement('img');
  let infoContainer = document.createElement('div'); 
  let titulo = document.createElement('h5');
  let precio = document.createElement('p');

  //anidando los nodos
  container.appendChild(columnContainer);
  columnContainer.appendChild(cardContainer)
  cardContainer.appendChild(productImage);
  cardContainer.appendChild(infoContainer);
  infoContainer.appendChild(titulo);
  infoContainer.appendChild(precio);

  //agrando las clases de bootstrap
  container.classList.add('row','row-cols-1', 'row-cols-md-4', 'g-4');
  columnContainer.classList.add('col');
  cardContainer.style.width = '18rem';
  cardContainer.style.marginRight = '1rem';
  cardContainer.classList.add('card');
  productImage.classList.add('card-img-top');
  infoContainer.classList.add('card-body');
  titulo.classList.add('card-title');
  precio.classList.add('card-text');

  //se carga la imagen y se pasa la info de titulo y precio consumidos desde el api de node
  productImage.src = url_image;
  titulo.innerHTML = title;
  precio.innerHTML = price;
}


/* Creando categorias */
function createCategory(for_label, id_input, id){
  let li = document.createElement('li');
  let form = document.createElement('form');
  let label = document.createElement('label');
  let input = document.createElement('input');

  label.classList.add('dropdown-item');
  label.setAttribute('for', for_label);
  label.innerHTML = for_label;
  input.setAttribute('id', id_input);
  input.style.display = 'none';
  input.type = 'submit';

  container_categories.appendChild(li);
  li.appendChild(form);
  form.appendChild(label);
  form.appendChild(input);

  /* Se añade listener a los form */
  form.addEventListener('submit', async function(ev){
    ev.preventDefault();
    let data = await fetch(`https://bsale-challenge.herokuapp.com/api/categories/${id}`).then((res) => res.json())

    try{
      if(data){
        container.innerHTML = '';
        data.map(({url_image, name, price}) => {
          if(url_image) createCard(url_image, name, price)
        });
      }
      else{
      container.innerHTML = '<p>No se encontraron coincidencias</p>';
      }
    }catch(err){
      alert(err);
    }
  })
}

/* Listener del buscador */
form.addEventListener('submit', async function(ev){
  ev.preventDefault();
  let inputValue = document.getElementById('search').value.toLowerCase();

  let data = await fetch(`https://bsale-challenge.herokuapp.com/api/products/${inputValue}`).then((res) => res.json());
  try{
    if(inputValue){
      container.innerHTML = '';
      data.map(({url_image, name, price}) => {
        if(url_image) createCard(url_image, name, price)
      });
    }
    else{
    container.innerHTML = '<p>No se encontraron coincidencias</p>';
    }
  }catch(err){
    alert(err);
  }

});

(function(){
  fecthProductData();
  fetchCategoriesData();
})();