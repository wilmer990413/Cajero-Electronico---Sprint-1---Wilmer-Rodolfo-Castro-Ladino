const usuarios = [
    {
        nombre: "Wilmer Rodolfo Castro Ladino",
        numeroDeDocumento: "123",
        password: "123",
        tipoDeUsuario: "1"
    },
    {
        nombre: "Clementina Alvarez Hernandez",
        numeroDeDocumento: "456",
        password: "456",
        tipoDeUsuario: "2"
    },
    {
        nombre: "Pedro Pablo Leon Perez",
        numeroDeDocumento: "789",
        password: "789",
        tipoDeUsuario: "2"
    }
];

const dineroDisponible = [
    {
        denominacion: 100000,
        cantidad: 0,
    },
    {
        denominacion: 50000,
        cantidad: 0,
    },
    {
        denominacion: 20000,
        cantidad: 0,
    },
    {
        denominacion: 10000,
        cantidad: 0,
    },
    {
        denominacion: 5000,
        cantidad: 0,
    },
];

function comprobarCredenciales (datosUsuario) {
    let buscarUsuario = encontrarUsuario(datosUsuario);
    while (!buscarUsuario) {
        alert("Error: ¡El usuario ingresado no existe o la contraseña es incorrecta!");
        datosUsuario = pedirDatos();
        buscarUsuario = encontrarUsuario(datosUsuario);
    }
    return buscarUsuario;
};

function pedirDatos () {
    const numeroDeDocumento = prompt("Ingresa tu número de documento: ");
    const password = prompt("Ingresa tu contraseña: ");   
    return {
        numeroDeDocumento,
        password,
    };
};

function encontrarUsuario (datosUsuario) {
    return usuarios.find(
        (usuario) => usuario.numeroDeDocumento === datosUsuario.numeroDeDocumento &&
        usuario.password === datosUsuario.password
    );
};

function cargarDinero () {
    alert("El administador va a depositar dinero");
    let dineroEnCajero = 0;
    dineroDisponible.forEach((billete) => {
        const cantidadBilletes = Number(prompt(
            `Por favor ingrese la cantidad de billetes de ${billete.denominacion} a depositar: `
        ));
        billete.cantidad += cantidadBilletes;
        const totalPorDenominacion = billete.denominacion * billete.cantidad;
        dineroEnCajero += totalPorDenominacion;
        console.log(
            `Ingreso: ${billete.cantidad} billetes de ${billete.denominacion} pesos. Cantidad total denominación: ${totalPorDenominacion} pesos.`
        );
    });
    console.log(`El total del dinero que actualmente hay en el cajero es de: ${dineroEnCajero}`);
    lanzarCajero();
};

function lanzarCajero (){
    let datosUsuario = pedirDatos();
    const iniciarSesion = comprobarCredenciales(datosUsuario);
    if (iniciarSesion) {
        alert(`Bienvenido, ${iniciarSesion.tipoDeUsuario === "1"? "Administrador": "Cliente" } ${iniciarSesion.nombre}`);
        if (iniciarSesion.tipoDeUsuario === "1") {
            cargarDinero();
        } else {
            retirarDinero();
        }
    }else {
        alert("Imposible iniciar sesion");
    }
};

function retirarDinero () {
    let totalDineroCajero = 0;
    dineroDisponible.forEach((billete) => {
        totalDineroCajero +=  billete.denominacion * billete.cantidad;
    });
    console.log("Total de dinero que tiene el cajero: " +totalDineroCajero);
    if(totalDineroCajero === 0){
        console.log("Cajero en mantenimiento, vuelva pronto.");
        lanzarCajero();
    } else if (totalDineroCajero > 0) {
        let cantidadARetirar = Number(prompt("Ingresa la cantidad de dinero que deseas retirar: "));
        console.log("La cantidad que el cliente quiere retirar es: " + cantidadARetirar);
        if (cantidadARetirar <= totalDineroCajero) {
            const dineroAEntregar = [];
            dineroDisponible.forEach((billete)=>{
                const billetesNecesarios = Math.floor(cantidadARetirar / billete.denominacion);
                if(billetesNecesarios > 0){
                    if(billetesNecesarios <= billete.cantidad){
                        dineroAEntregar.push({
                            denominacion: billete.denominacion,
                            cantidad: billetesNecesarios,
                        });
                        cantidadARetirar -= billete.denominacion * billetesNecesarios;
                        billete.cantidad -= billetesNecesarios;
                    }else{
                        dineroAEntregar.push({
                            denominacion: billete.denominacion,
                            cantidad: billete.cantidad,
                        });
                        cantidadARetirar -= billete.denominacion * billete.cantidad;
                        billete.cantidad = 0;
                    }
                }
            });
            mostrarBilletes("Billetes Entregados", dineroAEntregar);
            mostrarBilletes("Billetes Dispomibles", dineroDisponible);
            lanzarCajero();
        } else if (cantidadARetirar > totalDineroCajero) {
            alert("El cajero no tiene suficiente dinero para entregarle al cliente.");
            lanzarCajero();
        }
    }
};

function mostrarBilletes (mensaje, array) {
    console.log(mensaje);
    array.forEach((billete) => {
        console.log(`Denominacion: ${billete.denominacion} - Cantidad: ${billete.cantidad}`);
    });
}

////////////////////////////////////////// CAJERO POR HTML  ////////////////////////////////////////////////////////////

const consola = document.getElementById("consola");

function loginUser (){
    const numeroDeDocumento = document.getElementById("numeroDeDocumento").value;
    const password = document.getElementById("password").value;
    const datosUsuario = {
        numeroDeDocumento: numeroDeDocumento,
        password: password,
    };
    const findUser = encontrarUsuario(datosUsuario);
    if (!findUser) {
        alert("Error: ¡El usuario ingresado no existe o la contraseña es incorrecta!");
        limpiarLogin();
    } else {
        alert(`Bienvenido, ${findUser.tipoDeUsuario === "1"? "Administrador": "Cliente" } ${findUser.nombre}`);
        if (findUser.tipoDeUsuario === "1") {
            limpiarLogin();
            mostrarElemento("articleLogin","none");
            mostrarElemento("articleVarios", "flex");
            alert("El administador va a depositar dinero");
            mostrarElemento("articleConsole", "flex");
            cambiarTextoElemento('mensajeVarios',`Por favor ingrese la cantidad de billetes de ${dineroDisponible[0].denominacion} a depositar: `);
            let dineroEnCajero = 0;
            document.getElementById('buttonVarios').onclick = function(){ cargarDineroSinPrompt(0, dineroEnCajero)};
        } else {
            limpiarLogin();
            mostrarElemento("articleLogin","none");
            mostrarElemento("articleConsole", "flex");
            validarDinero();
        }
    }
}

function limpiarLogin(){
    document.getElementById("numeroDeDocumento").value = '';
    document.getElementById("password").value = '';
}

function mostrarElemento(id,accion){
    document.getElementById(id).style.display = accion;
}

function ocultarInicio(){
    mostrarElemento('articleLogin','flex');
    mostrarElemento('header','none');
    mostrarElemento('navOpciones','none');
}

function mostrarLogin(){
    mostrarElemento('articleLogin','flex');
    mostrarElemento('articleConsole','none');
}

function cambiarTextoElemento(id, mensaje){
    document.getElementById(id).textContent = mensaje;
}


function cargarDineroSinPrompt (i, dineroEnCajero) {
    const cantidadBilletes = Number(document.getElementById("inputVarios").value);
    dineroDisponible[i].cantidad += cantidadBilletes;
    const totalPorDenominacion = dineroDisponible[i].denominacion * dineroDisponible[i].cantidad;
    dineroEnCajero += totalPorDenominacion;
    console.log(
        `Ingreso: ${dineroDisponible[i].cantidad} billetes de ${dineroDisponible[i].denominacion} pesos. Cantidad total denominación: ${totalPorDenominacion} pesos.`
    );
    consola.innerHTML += `<li>Ingreso: ${dineroDisponible[i].cantidad} billetes de ${dineroDisponible[i].denominacion} pesos. Cantidad total denominación: ${totalPorDenominacion} pesos.</li>`;
    if(i == 4){
        console.log(`El total del dinero que actualmente hay en el cajero es de:  ${dineroEnCajero}`);
        consola.innerHTML += `<li>El total del dinero que actualmente hay en el cajero es de:  ${dineroEnCajero}</li>`;
        mostrarElemento("articleVarios",'none');
        mostrarElemento("buttonContinuar",'flex');
        document.getElementById('buttonContinuar').onclick = function() {mostrarLogin();};
        limipiarVarios();
    }else {
        document.getElementById("inputVarios").value = '';
        cambiarTextoElemento('mensajeVarios',`Por favor ingrese la cantidad de billetes de ${dineroDisponible[i+1].denominacion} a depositar: `);
        document.getElementById('buttonVarios').onclick = function(){ cargarDineroSinPrompt(i+1, dineroEnCajero)};
    }
};

function validarDinero(){
    let totalDineroCajero = 0;
    dineroDisponible.forEach((billete) => {
        totalDineroCajero +=  billete.denominacion * billete.cantidad;
    });
    consola.innerHTML += `<li>Total de dinero que tiene el cajero: ${totalDineroCajero}</li>`
    if(totalDineroCajero === 0){
        consola.innerHTML += `<li>Cajero en mantenimiento, vuelva pronto.</li>`;
        mostrarElemento("buttonContinuar",'flex');
        document.getElementById('buttonContinuar').onclick = function() {mostrarLogin();};
    } else if (totalDineroCajero > 0) {
        mostrarElemento("articleVarios", "flex");
        cambiarTextoElemento('mensajeVarios',"Ingresa la cantidad de dinero que deseas retirar: ");
        mostrarElemento("buttonContinuar", "none");
        document.getElementById('buttonVarios').onclick = function(){ retirarDineroSinPrompt(totalDineroCajero);};
    }
}

function retirarDineroSinPrompt (totalDineroCajero) {
        let cantidadARetirar = Number(document.getElementById("inputVarios").value);
        consola.innerHTML += `<li>La cantidad que el cliente quiere retirar es: ${cantidadARetirar}</li>`
        if (cantidadARetirar <= totalDineroCajero) {
            const dineroAEntregar = [];
            dineroDisponible.forEach((billete)=>{
                const billetesNecesarios = Math.floor(cantidadARetirar / billete.denominacion);
                if(billetesNecesarios > 0){
                    if(billetesNecesarios <= billete.cantidad){
                        dineroAEntregar.push({
                            denominacion: billete.denominacion,
                            cantidad: billetesNecesarios,
                        });
                        cantidadARetirar -= billete.denominacion * billetesNecesarios;
                        billete.cantidad -= billetesNecesarios;
                    }else{
                        dineroAEntregar.push({
                            denominacion: billete.denominacion,
                            cantidad: billete.cantidad,
                        });
                        cantidadARetirar -= billete.denominacion * billete.cantidad;
                        billete.cantidad = 0;
                    }
                }
            });
            mostrarBilletesHTML("Billetes Entregados", dineroAEntregar);
            mostrarBilletesHTML("Billetes Dispomibles", dineroDisponible);
            mostrarElemento("buttonContinuar","flex");
            mostrarElemento("articleVarios","none");
            document.getElementById('buttonContinuar').onclick = function(){ mostrarLogin();};
            limipiarVarios();
        } else if (cantidadARetirar > totalDineroCajero) {
            alert("El cajero no tiene suficiente dinero para entregarle al cliente.");
            mostrarElemento("articleVarios","none");
            limipiarVarios();
            mostrarLogin();
        }
};

function mostrarBilletesHTML (mensaje, array) {
    console.log(mensaje);
    consola.innerHTML += `<li>${mensaje}</li>`
    array.forEach((billete) => {
        console.log(`Denominacion: ${billete.denominacion} - Cantidad: ${billete.cantidad}`);
        consola.innerHTML += `<li>Denominacion: ${billete.denominacion} - Cantidad: ${billete.cantidad}</li>`
    });
}

function limipiarVarios(){
    cambiarTextoElemento('mensajeVarios',``);
    document.getElementById('buttonVarios').onclick = null;
    document.getElementById("inputVarios").value = '';
}
