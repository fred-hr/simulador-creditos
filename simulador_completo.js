
let clientes = [];
let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoIngresado = 0;
let creditoAprobado = false;

function ocultarSecciones() {
  let secciones = document.querySelectorAll("section");

  for (let i = 0; i < secciones.length; i++) {
    secciones[i].classList.remove("activa");
  }
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
  let nuevaTasa = recuperarFloat("tasaInteres");

  if (nuevaTasa >= 10 && nuevaTasa <= 20) {
    tasaInteres = nuevaTasa;
    mostrarTexto("mensajeTasa", "Tasa configurada correctamente: " + tasaInteres + "%");
  } else {
    mostrarTexto("mensajeTasa", "La tasa debe estar entre 10% y 20%");
  }
}
function guardarCliente() {
  let cedula = recuperaraTexto("cedulaCliente");
  let nombre = recuperaraTexto("nombreCliente");
  let apellido = recuperaraTexto("apellidoCliente");
  let ingresos = recuperarFloat("ingresosCliente");
  let egresos = recuperarFloat("egresosCliente");

  if (clienteSeleccionado == null) {
    let cliente = {
      cedula: cedula,
      nombre: nombre,
      apellido: apellido,
      ingresos: ingresos,
      egresos: egresos
    };
    clientes.push(cliente);
  } else {
    clienteSeleccionado.nombre = nombre;
    clienteSeleccionado.apellido = apellido;
    clienteSeleccionado.ingresos = ingresos;
    clienteSeleccionado.egresos = egresos;
    clienteSeleccionado = null;
  }
  pintarClientes();
}

function pintarClientes() {
  let contenido = "";

  for (let i = 0; i < clientes.length; i++) {
    contenido += "<tr>";
    contenido += "<td>" + clientes[i].cedula + "</td>";
    contenido += "<td>" + clientes[i].nombre + "</td>";
    contenido += "<td>" + clientes[i].apellido + "</td>";
    contenido += "<td>" + clientes[i].ingresos + "</td>";
    contenido += "<td>" + clientes[i].egresos + "</td>";
    contenido += `<td>
          <button onclick="seleccionarCliente('${clientes[i].cedula}')">
              Actualizar
          </button>
          </td>`;
    contenido += "</tr>";
  }

  document.getElementById("tablaClientes").innerHTML = contenido;
}

function pintarCreditos(creditos) {
  let contenido = "";

  for (let i = 0; i < creditos.length; i++) {
    contenido += "<tr>";
    contenido += "<td>" + creditos[i].cedula + "</td>";
    contenido += "<td>" + creditos[i].nombre + "</td>";
    contenido += "<td>" + creditos[i].apellido + "</td>";
    contenido += "<td>" + creditos[i].monto + "</td>";
    contenido += "<td>" + creditos[i].tasa + "%</td>";
    contenido += "<td>" + creditos[i].plazo + "</td>";
    contenido += "<td>" + creditos[i].cuota + "</td>";
    contenido += "</tr>";
  }

  document.getElementById("tablaCreditos").innerHTML = contenido;
}

function buscarCliente(cedula) {

  for (let i = 0; i < clientes.length; i++) {

    if (clientes[i].cedula == cedula) {
      return clientes[i];
    }
  }

  return null;
}

function seleccionarCliente(cedula) {
  let cliente = buscarCliente(cedula);

  if (cliente != null) {
    clienteSeleccionado = cliente;

    mostrarTextoEnCaja("cedulaCliente", cliente.cedula);
    mostrarTextoEnCaja("nombreCliente", cliente.nombre);
    mostrarTextoEnCaja("apellidoCliente", cliente.apellido);
    mostrarTextoEnCaja("ingresosCliente", cliente.ingresos);
    mostrarTextoEnCaja("egresosCliente", cliente.egresos);
  }
}
function limpiar() {
  mostrarTextoEnCaja("cedulaCliente", "");
  mostrarTextoEnCaja("nombreCliente", "");
  mostrarTextoEnCaja("apellidoCliente", "");
  mostrarTextoEnCaja("ingresosCliente", "");
  mostrarTextoEnCaja("egresosCliente", "");

  clienteSeleccionado = null;
}

function buscarClienteCredito() {
  let cedula = recuperaraTexto("buscarCedulaCredito");

  let cliente = buscarCliente(cedula);

  if (cliente != null) {
    clienteSeleccionado = cliente;

    document.getElementById("datosClienteCredito").innerHTML = `
            <h3>Datos del Cliente</h3>
            <p><strong>Cédula:</strong> ${cliente.cedula}</p>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Apellido:</strong> ${cliente.apellido}</p>
            <p><strong>Ingresos:</strong> ${cliente.ingresos}</p>
            <p><strong>Egresos:</strong> ${cliente.egresos}</p>
        `;

  } else {
    clienteSeleccionado = null;
    mostrarTexto("datosClienteCredito", "Cliente no encontrado");
  }
}
function calcularCredito() {

  if (clienteSeleccionado == null) {
    mostrarTexto("resultadoCredito", "Primero debe buscar un cliente");
    return;
  }

  let monto = recuperarFloat("montoCredito");
  let plazo = recuperarFloat("plazoCredito");

  let disponible = calcularDisponible(clienteSeleccionado.ingresos, clienteSeleccionado.egresos);
  let capacidadPago = calcularCapacidadPago(disponible);
  let interes = calcularInteresSimple(monto, tasaInteres, plazo);
  let totalPagar = calcularTotalPagar(monto, interes);
  let cuotaMensual = calcularCuotaMensual(totalPagar, plazo);
  let aprobado = aprobarCredito(capacidadPago, cuotaMensual);

  montoCalculado = monto;
  plazoIngresado = plazo;
  cuotaCalculada = cuotaMensual;
  creditoAprobado = aprobado;
  let botonAsignar = document.getElementById("btnAsignarCredito");

  if (creditoAprobado == true) {
    botonAsignar.disabled = false;
  } else {
    botonAsignar.disabled = true;
  }

  let resultado = "RECHAZADO";

  if (creditoAprobado == true) {
    resultado = "APROBADO";
  }

  document.getElementById("resultadoCredito").innerHTML = `
        Capacidad de pago: ${capacidadPago}<br>
        Total a pagar: ${totalPagar}<br>
        Cuota mensual: ${cuotaMensual}<br>
        RESULTADO: ${resultado}
    `;
  let resultadoCredito = document.getElementById("resultadoCredito");

  if (creditoAprobado == true) {
    resultadoCredito.className = "aprobado";
  } else {
    resultadoCredito.className = "rechazado";
  }
}

function asignarCredito() {

  let credito = {
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,
    monto: montoCalculado,
    tasa: tasaInteres,
    plazo: plazoIngresado,
    cuota: cuotaCalculada
  };

  creditos.push(credito);

  console.log(creditos);
}

function buscarCreditos(cedula) {
  let creditosCliente = [];

  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      creditosCliente.push(creditos[i]);
    }
  }

  return creditosCliente;
}

function buscarCreditosCliente() {
  let cedula = recuperaraTexto("buscarCedulaListado");

  let creditosCliente = buscarCreditos(cedula);

  pintarCreditos(creditosCliente);
}
//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios