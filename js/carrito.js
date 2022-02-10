
//VALIDACIONES PARA EL CARRITO DE COMPRAS
const carrito          = document.querySelector('#carrito');
const listaCarrito     = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaProducto    = document.querySelector('#lista-producto');
const cartSubTotal = document.querySelector('#cart-total');
const cartIGV = document.querySelector('#cart-igv');
let productoCarrito    = [];



//GLOBALES
const btnComprar = document.querySelector('#btn-comprar');

const cartForm   = document.querySelector('#btn-comprar');
const formCart = document.querySelector('#form-cart');

//VARIABLES
const nombre    = document.querySelector('#nombre');
const email     = document.querySelector('#email');

// EXPRESIONES REGULARES
const regEx = {
    nombre:/^[a-zA-Z\ñ\Ñ\Á\É\Í\Ó\Ú\á\é\í\ó\ú\Ü\ü\s]{10,45}$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}



iniciarAPP();
cargarEventos();
function cargarEventos(){

    document.addEventListener('DOMContentLoaded',iniciarAPP);
    listaProducto.addEventListener('click', agregarProducto);
    carrito.addEventListener('click',eliminarProducto);
    vaciarCarritoBtn.addEventListener('click',vaciarCarrito);
    document.addEventListener('DOMContentLoaded',() => {
        productoCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    //VALIDAR FORMULARIO
    nombre.addEventListener('blur',validarFormulario);
    email.addEventListener('blur',validarFormulario);

    cartForm.addEventListener('click',procesarCompra);

};


//FUNCIÓN PARA AGREGAR CURSOS AL CARRITO
function agregarProducto(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const productoSeleccionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSeleccionado);
        const alert = document.querySelector('.alert')
        setTimeout(() =>{
            alert.classList.add('hide');
     },2000)
            alert.classList.remove('hide');
    }
}

//ELIMINAR PRODUCTO
function eliminarProducto(e){
    e.preventDefault();
    if(e.target.classList.contains('btn__delete')){
        //ELIMINAR POR EL ID
        const productoId = e.target.getAttribute('data-id');
        //ITERA EL CARRITO
        productoCarrito = productoCarrito.filter( producto => producto.id !== productoId);
        carritoHTML();
        //ALERTA
        const alert = document.querySelector('.delete')
        setTimeout(() =>{
          alert.classList.add('delete')
        },2000)
        alert.classList.remove('delete')
      } 
      // eliminarLocalStorage(productoId);
}

//FUNCIÓN PARA LEER LOS DATOS Y MOSTRARLO EN EL CARRITO
function leerDatosProducto(producto){
    // CREAR UN OBJETO CON LOS DATOS DEL PRODUCTO
    const productosInfo = {
        imagen:producto.querySelector('img').src,
        nombre:producto.querySelector('h3').textContent,
        precio:producto.querySelector('p').textContent,
        id:producto.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    //VALIDAR SI EL PRODUCTO YA EXISTE
    const productoExiste = productoCarrito.some( producto => producto.id === productosInfo.id);
    if(productoExiste){
        //ACTUALIZAMOS LA INFORMACIÓN
        const productos = productoCarrito.map(producto =>{
            if(producto.id === productosInfo.id){
                producto.cantidad++;
                return producto;
            }else{
                return producto
            }
        });
        //SE CREA UN NUEVO ARREGLO;
        productoCarrito = [...productos];
    }else{
        productoCarrito = [...productoCarrito, productosInfo];
    }
    //AGREGAR ELEMENTOS AL ARREGLO DEL CARRITO
    carritoHTML();     
}

function carritoHTML(){

    //LIMPIA EL HTML
    limpiarHTML();

    //AÑADE EL PRODUCTO AL CARRITO 
    productoCarrito.forEach( producto =>{
        const {imagen, nombre, precio, id, cantidad} = producto;
        const row = document.createElement('tr');
        row.innerHTML =`
        <td>
            <img src="${imagen}" alt="productos" width="100">
        </td>
        <td class="align-middle">${nombre}</td>
        <td class="align-middle">${precio}</td>
        <td class="align-middle">${cantidad}</td>
        <td class="align-middle">
            <a href="#" data-id="${id}" class="btn__delete"> Eliminar</a>
        </td>
        `
        ;
        listaCarrito.appendChild(row);
      });
      guardarLocalStorage();
      calcularMontoaPagar();

}
//CALCULAR EL SUBTOTAL
function calcularMontoaPagar(){
    let subTotal = 0;
    let igv = 0;
    let total = 0;
    let cantidad = 0;

    const cantProducto = document.querySelector('#cantidad'); //CANTIDAD
    const pagarTotal   = document.querySelector('#pagar'); //MODAL
    productoCarrito.forEach(producto => {
        //SUSTITUIMOS EL S/ POR UN STRING VACIO
        const precio = Number(producto.precio.replace('S/', ''));
        const precioIGV = Number(producto.precio.replace('S/',''));
        subTotal = subTotal + precio * producto.cantidad;
        igv = igv + 0.18 * precioIGV * producto.cantidad;
        total =  subTotal + igv;
        cantidad =  cantidad + producto.cantidad;

    });
    cartSubTotal.innerHTML = `S/${subTotal.toFixed(2)}`;
    cartIGV.innerHTML = `S/${igv.toFixed(2)}`;
    pagarTotal.value = `S/${total.toFixed(2)}`;
    cantProducto.value = `${cantidad}`;
}


//LIMPIAR EL HTML
function limpiarHTML(){
    while(listaCarrito.firstChild){
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}
function vaciarCarrito(e){
    e.preventDefault();
    productoCarrito = [];
    limpiarHTML();
    calcularMontoaPagar();
    vaciarLocalStorage();
    const alert = document.querySelector('.vaciar')
     setTimeout(() =>{
         alert.classList.add('vaciar')
     },2000)
     alert.classList.remove('vaciar')
     
}
function guardarLocalStorage(){
    localStorage.setItem('carrito',JSON.stringify(productoCarrito));
}

function vaciarLocalStorage(){
  localStorage.clear();
}


 //FUNCIONES FORMULARIO
function iniciarAPP(){
    btnComprar.disabled = true;
    btnComprar.classList.add('btn__desactive');
 }

//VALIDAR EL FORMULARIO
function validarFormulario(e){
    const errores = document.querySelector('.error')
    if(errores){
        errores.remove();
    }
     //VALIDAR TODO LOS CAMPOS SIN NINGUNA INFORMACIÓN
    if(e.target.value.length > 0){
        e.target.classList.remove('form__incorrecto')
        e.target.classList.add('form__correcto');
    }else{
        e.target.classList.remove('form__correcto')
        e.target.classList.add('form__incorrecto');
        mostrarMensaje('todos los campos son obligatorios')
    }
    //VALIDAR LOS CAMPOS POR CADA CAMPO 
    //VALIDAR NOMBRE CON EXPRECION REGULAR
    if(e.target.type === 'text'){
        if(regEx.nombre.test(e.target.value)){
            e.target.classList.remove('form__incorrecto');
            e.target.classList.add('form__correcto');
        }else{
            e.target.classList.add('form__incorrecto');
            e.target.classList.remove('form__correcto');
            mostrarMensaje('Ingrese nombre completo')
        }
    }
    //VALIDAR CORREO
    if(e.target.type === 'email'){
        if(regEx.email.test(e.target.value)){
            e.target.classList.remove('form__incorrecto');
            e.target.classList.add('form__correcto');
        }else{
            e.target.classList.add('form__incorrecto')
            e.target.classList.remove('form__correcto');
            mostrarMensaje('Ingrese correo electronico correctamente')
        }
    }
    if(regEx.nombre.test(nombre.value) && regEx.email.test(email.value)){
        btnComprar.disabled = false;
        btnComprar.classList.remove('btn__desactive')
    }else{
        btnComprar.disable =true;
    }
 }

function mostrarMensaje(mensaje){
     const mensajeError = document.createElement('p');
     mensajeError.textContent = mensaje;
     mensajeError.classList.add('form__mensaje-error', 'error');
     //MOSTRAR MENSAJE SI ES QUE EL CAMPO NO ESTA LLENO
     const error = document.querySelectorAll('p.error');
     if(error.length === 0){
         const cartDiv    = document.querySelector('#cart-totals')
         cartDiv.appendChild(mensajeError);
     }
 }

 //FUNCTIÓN MOSTRAR MENSAJE DE PAGO
function procesarCompra(e){
  e.preventDefault();
  
  const spinner = document.querySelector('#spinner');
  spinner.style.display ='flex';
  
    setTimeout(() => {
      spinner.style.display = 'none';
      listaCarrito.innerHTML = '';
      cartSubTotal.innerHTML = 'S/.0.00';
      cartIGV.innerHTML = 'S/.0.00';
      setTimeout(() =>{
        alertify.success('Gracias por su compra'); 
        vaciarLocalStorage();
        resetForm();
      },0)
    }, 3000);

}
function resetForm(){
    formCart.reset();
    iniciarAPP();
} 
