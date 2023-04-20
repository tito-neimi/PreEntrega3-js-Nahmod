const listaProductos = [];

class producto {

  constructor(nombre, precio, id, img) {
    this.nombre = nombre;
    this.precio = precio;
    this.info = `${this.nombre} $${this.precio}`;
    this.cantidad = 1;
    this.precioUnidad = precio;
    this.id = id;
    this.img = img;

  }


  verInfo() {
    document.write(this.info);
  }

}


fetch('./scripts/productos.json')
.then ((response) => response.json())
.then(data => {
  data.forEach(valor =>{
    listaProductos.push(valor.id = new producto (valor.nombre, valor.precio, valor.id, valor.img))
  });
  crearProductos();
})

// listaProductos.push((termo = new producto("Termo", 2200, 0001, `./assets/termo.jpg`)));
// listaProductos.push((mate = new producto("Mate", 1800, 0002, `./assets/mate.jpg`)));
// listaProductos.push((yerba = new producto("Yerba", 500, 0003, `./assets/yerba.webp`)));
// listaProductos.push((bombilla = new producto("Bombilla", 1000, 0004, `./assets/bombilla.jpg`)));
// listaProductos.push((galletitas = new producto("Galletitas", 200, 0005, `./assets/galletitas.jpg`)));
// crearProductos();


const contenedorProductos = document.getElementById("listaProductos");


 function crearProductos() {

  listaProductos.forEach((Producto) => {
    const div = document.createElement("div");
    div.innerHTML = ` <img src="${Producto.img}" alt="Imagen de ${Producto.nombre}" class="productos__img">
                    <p class="infoProducto">${Producto.info} </p>
                     <button class="btn_producto" id= "btn__${Producto.id}"> Agregar al carrito </button>`;
    div.className = "productos"
    contenedorProductos.appendChild(div);
    const botonAgragar = document.getElementById(`btn__${Producto.id}`)
    botonAgragar.addEventListener('click', () => {
      agregarAlCarrito(Producto);
      actualizarCarrito();
    });

  });

 }

const h2 = document.getElementById("bienvenida_nombre")

//crear el carrito

var carrito = {
  items: JSON.parse(localStorage.getItem("Carrito")) || [],
  precioTotal: JSON.parse(localStorage.getItem("precioTotal")) || 0
}

const guardarLocal = (clave, valor) => { localStorage.setItem(clave, valor) };

//funcion para añadir los productos
function agregarAlCarrito(item) {
  let index = carrito.items.findIndex(a => a.id === item.id);
  if (index === -1) {
    carrito.items.push(item);
    carrito.precioTotal += item.precio;
    console.log(`Se agrego al carrito el item ${item.nombre}`);
  } else {
    carrito.items[index].cantidad += 1;
    carrito.items[index].precio += carrito.items[index].precioUnidad;
    carrito.precioTotal += carrito.items[index].precioUnidad;
    console.log(`La cantidad actual de ${item.nombre} es de ${carrito.items[index].cantidad}`);
  }

  Toastify({
    text: `${item.nombre} agregado al carrito`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },

  }).showToast();

  guardarLocal("Carrito", JSON.stringify(carrito.items))
  guardarLocal("precioTotal", JSON.stringify(carrito.precioTotal))
}

//funcion para eliminar los productos
function elimarDelCarrito(item) {
  const indexItem = carrito.items.indexOf(item);
  if (indexItem !== -1) {
    if (item.cantidad >= 2){
      carrito.precioTotal -= item.precioUnidad;
      item.precio -= item.precioUnidad;
      item.cantidad -= 1;
      console.log(`se elimino un ${item.nombre} y queda ${item.cantidad}`)
    }
    else if (item.cantidad = 1) {
        carrito.precioTotal -= item.precioUnidad;
        carrito.items.splice(indexItem, 1);
        console.log(`Se elimino del carrito el item ${item.nombre}`);

    }
  }

  Toastify({
    text: `${item.nombre} eliminado al carrito`,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "left",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #FF441C, #FBA61B)",
    },

  }).showToast();

  guardarLocal("Carrito", JSON.stringify(carrito.items))
  guardarLocal("precioTotal", JSON.stringify(carrito.precioTotal))
}


//declaro los elemento html a utilizar en el carrito
const contenedorCarrito = document.getElementById("carrito__productos")
const carritoTotal = document.getElementById("precioTotal")

//creo los elemento del carrito

function actualizarCarrito() {

  //esto vacia el carrito para despues poderlo llenar con los nuevos datos
  contenedorCarrito.innerHTML = "";

  //un loop para agregar uno por uno todos los prodcutos

  carrito.items.forEach (item => {
    const itemElement = document.createElement('div');
    const itemName = document.createElement('span');
    itemName.textContent = ` ${item.nombre} `;
    const itemPrice = document.createElement('span');
    itemPrice.textContent = `$${item.precio}`;
    const itemCantidad = document.createElement ('span')
    itemCantidad.textContent = `${item.cantidad}`
    const removeButton = document.createElement('button');
    removeButton.textContent = ' - ';
    removeButton.addEventListener('click', () => {
      elimarDelCarrito(item);
      actualizarCarrito();
    });
    const addbutton = document.createElement ('button');
    addbutton.textContent = ' + ';
    addbutton.addEventListener('click', () => {
      agregarAlCarrito(item);
      actualizarCarrito();
    });

    itemElement.appendChild(itemName);
    itemElement.appendChild(itemPrice);
    itemElement.appendChild(removeButton);
    itemElement.appendChild(itemCantidad);
    itemElement.appendChild(addbutton);
    contenedorCarrito.appendChild(itemElement);
    itemElement.className = "barra-producto";
  })


  //actualizar el precio total
  carritoTotal.textContent = `El precio total es de $${carrito.precioTotal}`;
}

actualizarCarrito();

