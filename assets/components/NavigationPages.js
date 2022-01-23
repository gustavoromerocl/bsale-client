class NavigationPages {
  constructor(){
    //Traer el template
    //Multiplicar el template
    //Conectar el endpoint con paginacion
    //pasarle los numeros de las paginas
    //Añadirle evento click y pasar emediante params el numero de la pagina
    this.template = document.getElementById('navigation-pages-template').content;
    this.fragment = document.createDocumentFragment();
    this.containerPages = document.querySelector('#navigation-pages');

    
    this.bindEvents();
    this.buildPages();
  }

  bindEvents = () => {}

  buildPages = async (page=0) => {
    const res = await fetch(`http://localhost:8080/api/products?page=${page}`);
    const data = await res.json();
    
    for (var index = 0 ; index < data.totalPages;) {
      ++index
      console.log(index);
      let label = this.template.querySelector('label');
      let input = this.template.querySelector('input');
      
      label.textContent = index;
      label.setAttribute('for', index);
      label.dataset.id = index;
      input.style.display = 'none';
      input.setAttribute('id', index);
      
      const clone = this.template.cloneNode(true);
      
      this.fragment.appendChild(clone);
    }
    this.containerPages.appendChild(this.fragment);
  }

/*   fetchPage = (page = 0) => {

    const res = await fetch(`http://localhost:8080/api/products?page=${page}`)  
  } */
}

(function(){
  new NavigationPages()
})()