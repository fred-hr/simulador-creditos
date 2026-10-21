
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
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
//Para recuperar o mostrar información usar los métodos de la clase utilitarios, puede agregar métodos adicionales en utilitarios