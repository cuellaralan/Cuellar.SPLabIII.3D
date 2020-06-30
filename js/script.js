//importo clase persona
import Anuncio_Auto from './entidades.js';
//obtengo referencias 
let info = document.getElementById('info'); //donde se muestra el spiner
let form = document.getElementById('form1');
let main = document.querySelector('main');
let divTabla = document.getElementById('divTabla');
let divFiltros = document.getElementById('divFiltros');
let divTrx = document.getElementById('divTrx');
let divroww = document.getElementById('roww');
let art3 = document.querySelector('#art3');
let art2 = document.querySelector('#art2');
let artf = document.querySelector('#artf');
let contTabla = document.querySelector('#contTabla'); 
//referencias formulario elementos
let id = document.querySelector('#txtId');
let titulo = document.querySelector('#txtTitulo');
let radioV = document.querySelector('#rdoVenta');
let radioA = document.querySelector('#rdoAlquiler');
let trans = document.querySelector('#selTrans')
let descrip = document.querySelector('#txtDescrip');
let precio = document.querySelector('#txtPrecio');
let baños = document.querySelector('#txtBaño');
let autos = document.querySelector('#txtautos');
let piezas = document.querySelector('#txtDormi');
let selTrx = document.querySelector('#selTrx')

window.addEventListener('load', traerPersonas);

main.addEventListener('click', (e) =>{
    let btnB = document.querySelector('#btnBaja');
    let btnG = document.querySelector('#btnGuarda');
    let btnC = document.querySelector('#btnCancela');

        console.log(e.target);
        if (e.target == divTabla || e.target == main || e.target == art2 || e.target == artf || e.target == art3 || e.target == contTabla || e.target == divroww) {
            // console.log('distinto de una fila' + e.target);
            btnB.setAttribute('class', 'ocultar');  
            btnG.setAttribute('class', 'ocultar');  
            btnC.setAttribute('class', 'ocultar');  
            cancela();
            //crear en el css la clase con propiedades display y block y setearlas a los botones en esta condición
        }
});

let formulario = document.forms[0];
let btnAlta = document.getElementById('btnAlta');
btnAlta.addEventListener('click', (e) =>{
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado');    
    //obtengo valores de formulario para dar de alta al anuncio
    let tittle = titulo.value;
    let transaction = trans.value; 
    let description = descrip.value;
    let price = precio.value;
    let bath = baños.value;
    let car = autos.value;
    let room = piezas.value;
    if (tittle != '' && transaction != '' && description != '' && price != 0 && bath != 0 && car != 0 && room != 0) {
        let nuevoAnuncio = new Anuncio_Auto(null, tittle, transaction, description, price, bath, car, room);
        console.log(nuevoAnuncio);
        altaPersona(nuevoAnuncio);
    } else {
        alert('existen datos vacíos');
    }
});
let btnBaja = document.querySelector('#btnBaja');
btnBaja.addEventListener('click', (e) => {
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado - Baja');   
    let valId = id.value;
    bajaPersona(valId); 
});

let btnCancela = document.querySelector('#btnCancela');
btnCancela.addEventListener('click', (e) => {
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado - cancela');   
    cancela();
});

let btnGuarda = document.querySelector('#btnGuarda');
btnGuarda.addEventListener('click', async (e) =>{
    e.preventDefault();//cancelamos el comportamiento por defecto
    console.log('submit cancelado - Modifica');   
    let idV = id.value;
    let tittle = titulo.value;
    let transaction = trans.value; 
    let description = descrip.value;
    let price = precio.value;
    let bath = baños.value;
    let car = autos.value;
    let room = piezas.value;
    let nuevoAnuncio = new Anuncio_Auto(idV, tittle, transaction, description, price, bath, car, room);
    console.log(nuevoAnuncio);
    modificaAnuncio(nuevoAnuncio);

});
//Traer personas
let img = document.createElement('img');
img.setAttribute('src', './img/spiner.gif');
img.setAttribute('alt', 'wait');

//filtro de seleccion de transacción

selTrx.addEventListener('change', (e) => {
    //mostrar de la lista de anuncios solo los que sean de la trx seleccionada
    let trxSel = e.target.value;
    filterAnu(trxSel);

});

function filterAnu(trxSel){
    console.log('aplicando filtros');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                while (divTabla.firstChild) {
                    divTabla.removeChild(divTabla.firstChild);
                }
                let respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message == 'Carga Exitosa') {
                    let listaPersonas = respuesta.data;
                    console.log(listaPersonas);
                    let nuevaLista = listaPersonas.filter(function (uno){
                        console.log(uno.transaccion);
                        console.log(trxSel);

                        return uno.transaccion == trxSel;
                    });
                    console.log(nuevaLista);
                    if(nuevaLista.length > 0){
                        generoTabla(nuevaLista);
                        promSel(nuevaLista);
                    }
                    else{
                        let promedio = document.getElementById('txtPromedio');
                        promedio.value = 'N/A';
                        while (divFiltros.firstElementChild) {
                            divFiltros.removeChild(divFiltros.firstChild);
                        }
                    }
                }
                else{
                    alert('no se pudo obtener los datos del servidor');
                } 
                console.log(respuesta.message);
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        } 
    }
    //si esta en la carpeta public no pongo http en la url
    xhr.open('GET','http://localhost:3000/traer');
    xhr.send();
}

function promSel(nuevaLista){
    //crear elemento promedio y mostrar valor
    let promedio = document.getElementById('txtPromedio');
    let suma = 0;
    // promedio.setAttribute('type' , 'number');
    // suma = nuevaLista.reduce(function(anterior, actual){
    //     console.log(anterior.precio + actual.precio);
    //     // return Number(anterior) + Number(actual.precio);
    //     return Number(anterior.precio) + Number(actual.precio);
    // });
    nuevaLista.forEach(uno =>{
        console.log(uno.precio);
        suma = Number(uno.precio) + Number(suma);
    });
    console.log(suma);
    promedio.value = suma / nuevaLista.length;
}

function traerPersonas()
{
    console.log('cargando');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                while (divTabla.firstChild) {
                    divTabla.removeChild(divTabla.firstChild);
                }
                // console.log(divFiltros.firstChild);
                let respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message == 'Carga Exitosa') {
                    let listaPersonas = respuesta.data;
                    console.log(listaPersonas);
                    generoTabla(listaPersonas);
                    let tabla = document.querySelector('table');
                    console.log(tabla);
                }
                else{
                    alert('no se pudo obtener los datos del servidor');
                } 
                console.log(respuesta.message);
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }        
    };
    //si esta en la carpeta public no pongo http en la url
    xhr.open('GET','http://localhost:3000/traer');
    xhr.send();
}



function altaPersona(anu)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText).message);
                traerPersonas();
                cancela();
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }    
    }
    // por post se pasa cabecera
    xhr.open('POST', 'http://localhost:3000/alta');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(anu));
}

function bajaPersona(parm)
{
    console.log('ide es :' + parm);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText));
                traerPersonas();
                cancela();
                //con todoOk se puede tomar decisiones como enviar un ALERT o agregar el item a la lista
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }    
    }
    // por post se pasa cabecera
    xhr.open('POST', 'http://localhost:3000/baja');
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send(`id=${parm}`);
    // xhr.setRequestHeader('content-type', 'application/json');
    // xhr.send(JSON.stringify(`id=${parm}`));
}

function modificaAnuncio(anu)
{
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                console.log(JSON.parse(xhr.responseText).todoOk);
                traerPersonas();
                cancela();
                //con todoOk se puede tomar decisiones como enviar un ALERT o agregar el item a la lista
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        }    
    }
    // por post se pasa cabecera
    xhr.open('POST', 'http://localhost:3000/modificar');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify(anu));
}

function generoTabla(lista)
{
    //elementos table y tbody
    console.log(lista.length);
    if(lista.length > 0){
        let tabla = document.createElement('table');
        let tbody = document.createElement('tbody');
        //tamaño de la lista
        let tamaño = lista.length;
        //se recibe una lista de objetos, en este caso personas
        //se debe recorrer la lista para obtener cada objeto y así
        //con el metodo Object.keys(listaPersonas[0])) obtendremos las claves
        //para crear los titulos de la tabla
        let arrayTitulos = Object.keys(lista[0]);
        let cantCampos = arrayTitulos.length;
        let existe = true; 
        if(! (divFiltros.firstElementChild))
        {
            existe = false;
        }
        //creo titulos
        let hileraT = document.createElement('tr');
        hileraT.setAttribute('class', 'tituloT');
        arrayTitulos.forEach(titulo => {
            let celdaT = document.createElement('td');
            let valorC = document.createTextNode(titulo);
            celdaT.appendChild(valorC);
            hileraT.appendChild(celdaT);
            //creo checkbox
            if(!existe)
            {
                let txtFiltro = document.createElement('label');
                let valorF = document.createTextNode(titulo);
                txtFiltro.appendChild(valorF);
                divFiltros.appendChild(txtFiltro);
                let filtro = document.createElement('input');
                filtro.setAttribute('type', 'checkbox');
                filtro.setAttribute('id', 'chk' + titulo);
                filtro.setAttribute('checked', 'true');
                // filtro.addEventListener('click', 'funcionesFiltros');
                filtro.addEventListener('click', funcionesFiltros);
                divFiltros.appendChild(filtro);
            }
        });
        //agrego titulos a la tabla 
        tbody.appendChild(hileraT);
        // Crea las celdas 
        for (var i = 0; i < tamaño; i++) {
            // Crea las hileras de la tabla
            var hilera = document.createElement("tr");
            //obtenemos los valores del objeto i de la lista
            let persona = Object.values(lista[i]);
            for (var j = 0; j < cantCampos; j++) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(persona[j]);
                celda.addEventListener('click', funcionesTabla);
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            } 
            // agrega la hilera al final de la tabla (al final del elemento tblbody)
            tbody.appendChild(hilera);
        }
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tbody);
        // appends <table> into <body>
        divTabla.appendChild(tabla);
        // modifica el atributo "border" de la tabla y lo fija a "2";
        // tabla.setAttribute("border", "2");
    }
    else{
        console.log(divFiltros.firstElementChild);
    }
}

function funcionesTabla()
{
    //obtengo referencia al nodo padre del elemento seleccionado
    let parent = this.parentNode;
    console.log(this.parentNode);
    //primer hijo
    let unHijo = parent.firstChild;
    console.log(unHijo);
    if (parent.hasChildNodes()) {
        // console.log(parent.childNodes);
        let childrens = parent.childNodes;
        console.log("nodos hijos = " + childrens.length);
        //obtengo cantidad de hijo
        let cantChild = childrens.length;
        for (let i = 0; i < cantChild; i++) {
            //muestro todos los hijos del nodo padre de la tabla
            let valor = unHijo.innerHTML;
            console.log(valor);
            unHijo = unHijo.nextSibling;
            switch (i) {
                case 0:
                    id.value = valor;
                    break;
                case 1:
                    titulo.value = valor;
                    break;
                case 2:
                    trans.value = valor;
                    break;
                case 3:
                    descrip.value = valor;
                    break;
                case 4:
                    precio.value = valor;

                    break;
                case 5:
                    baños.value = valor;

                    break;
                case 6:
                    autos.value = valor;
                    break;
                case 7:
                    piezas.value = valor;
                    break;
                default:
                    break;
            }
        }
    }
    //obtengo referencia a primer hijo y voy guardando las referencias a los hermanos siguientes
    //nextSibling me muestra el siguiente hermano, debo guardarlo en otra variable
    let btn1 = document.querySelector('#btnBaja');
    let btn2 = document.querySelector('#btnGuarda');
    let btn3 = document.querySelector('#btnCancela');
    // console.log(btn1);
    // if (btn1 == null) {
    //     console.log('creando elemento de tabla');
    //     let btnBaja = document.createElement('button');
    //     btnBaja.setAttribute('id', 'btnBaja');
    //     btnBaja.setAttribute('class', 'btn btn-primary');
    //     btnBaja.addEventListener('click', borra);
    //     let txtBaja = document.createTextNode('Baja')
    //     btnBaja.appendChild(txtBaja);
    //     let btnMod = document.createElement('button');
    //     btnMod.setAttribute('id', 'btnMod');
    //     btnMod.setAttribute('class', 'btn btn-primary');
    //     btnMod.addEventListener('click', modifica);
    //     let txtMod = document.createTextNode('Modifica');
    //     btnMod.appendChild(txtMod);
    //     // console.log(tabla);

    //     art3.appendChild(btnBaja);
    //     art3.appendChild(btnMod);
    // }
    // else {
        console.log('creando botones ocultos');
        btn1.setAttribute('class', 'btn btn-primary mostrar');
        btn2.setAttribute('class', 'btn btn-primary mostrar');
        btn3.setAttribute('class', 'btn btn-primary mostrar');
    // }
}


function funcionesFiltros()
{
    // let fSelect = this.id.substring(3, this.id.length);
    let fSelect = this.id;
    let fparent = this.parentNode;
    let fchildrens = fparent.childNodes;
    console.log(fchildrens);
    let fchecked = [];
    fchildrens.forEach( input => {
        let atrib = input.type;
        if (atrib == 'checkbox') {
            fchecked.push(input);
        }
    });
    console.log(fchecked);

    // console.log(listaPersonas);
    console.log('aplicando filtros');
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () =>{
        if (xhr.readyState == 4) {
            info.removeChild(img);
            if (xhr.status == 200) {
                while (divTabla.firstChild) {
                    divTabla.removeChild(divTabla.firstChild);
                }
                let respuesta = JSON.parse(xhr.responseText);
                if (respuesta.message == 'Carga Exitosa') {
                    let listaPersonas = respuesta.data;
                    console.log(listaPersonas);
                    let nuevaLista = mapTabla(listaPersonas, fchecked);
                    console.log(nuevaLista);
                    generoTabla(nuevaLista);
                    let tabla = document.querySelector('table');
                    console.log(tabla);
                }
                else{
                    alert('no se pudo obtener los datos del servidor');
                } 
                console.log(respuesta.message);
            } else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
        else{
            info.appendChild(img);
        } 
    }
    //si esta en la carpeta public no pongo http en la url
    xhr.open('GET','http://localhost:3000/traer');
    xhr.send();

}

function mapTabla(lista, sel)
{
    let ids = [];
    sel.forEach(uno =>{
        if (! (uno.checked)) {
            ids.push(uno.id.substring(3, uno.id.length));
        }
    });
    let listaFiltrada = lista.map(function (list, indice, array) {
        lista.forEach(uno => {
            let unoKeys = Object.keys(uno);
            // console.log(unoKeys);
            unoKeys.forEach(unkey => {
                for (let i = 0; i < ids.length; i++) {   
                    switch (unkey) {
                        case 'id':
                            if(unkey == ids[i]){
                                delete uno.id;
                            }
                            break;
                        case 'titulo':
                            if(unkey == ids[i]){
                                delete uno.titulo;
                            }
                            break;
                        case 'transaccion':
                            if(unkey == ids[i]){
                                delete uno.transaccion;
                            }
                            break;
                        case 'descripcion':
                            if(unkey == ids[i]){
                                delete uno.descripcion;
                            }                    break;
                        case 'precio':
                            if(unkey == ids[i]){
                                delete uno.precio;
                            }                    break;
                        case 'puertas':
                            if(unkey == ids[i]){
                                delete uno.puertas;
                            }                    break;
                        case 'kms':
                            if(unkey == ids[i]){
                                delete uno.kms;
                            }                    break;
                        case 'potencia':
                            if(unkey == ids[i]){
                                delete uno.potencia;
                            }
                            break;                                    
                        default:
                            break;
                    }
                }
            });
            // let cantCampos = unoKeys.length;
            // delete uno.potencia;
            console.log(uno);     
        });

        return list;
    })
    return listaFiltrada;
}

function modifica(per)
{
    console.log('hola modifica');
}

function borra(per)
{
    console.log('hola borra');
}

function cancela() {
    titulo.value = ' ';
    trans.value = ' ';
    descrip.value = ' ';
    precio.value = ' ';
    baños.value = ' ';
    autos.value = ' ';
    piezas.value = ' ';
    let btnB = document.querySelector('#btnBaja');
    let btnG = document.querySelector('#btnGuarda');
    let btnC = document.querySelector('#btnCancela');
    btnB.setAttribute('class', 'ocultar');
    btnG.setAttribute('class', 'ocultar');
    btnC.setAttribute('class', 'ocultar');  
}



