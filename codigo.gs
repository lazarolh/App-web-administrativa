function doGet() {
    var Html=HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    Html.setTitle('Control de inversiones');
    Html.setWidth(800);
    Html.setWidth(600);
    return Html;
}
//---------------- INICIO DE SESION ----------------------------
function verificarUsuario(usuario, contrasena) {
  var consulta = `SELECT contrasena, id_rol FROM AG_Usuarios WHERE usuario = '${usuario}'`;
  var resultado = peticion(consulta);

  if (resultado.length === 0) {
    return { success: false, message: "Usuario no encontrado" };
  }
  var contrasenaSQL = resultado[0].contrasena;
  var idRol = resultado[0].id_rol; 
  if (contrasenaSQL === contrasena) {
    return { success: true, message: "Inicio de sesión exitoso", usuario: usuario, idRol: idRol };
  } else {
    return { success: false, message: "Contraseña incorrecta" };
  }
}




function obtenerLibrerias(nombre) {
  try {
    var output = HtmlService.createHtmlOutputFromFile(nombre).getContent();
    return output;
  } catch (e) {
    Logger.log('Error al obtener el archivo: ' + e.message);
    return 'Error al cargar el archivo: ' + nombre;
  }
}
var IdSistema = "HelpDesk2";

var SYSTEM = "HelpDesk2";
var PRODUCTIVE = false;
DBMan.init(this);




function test(consulta, columna) {
  var query = ConsultaSQL(consulta)
  var rows = [];
  for (var i in query) {
    rows.push(query[i][columna]); 
  }
  return rows; 
}

// Función para escapar los valores 
function escaparSQL(valor) {
  if (typeof valor === 'string') {
    // Escapa las comillas simples 
    return valor.replace(/'/g, "\\'");
  }
  return valor;
}

function peticion(consulta) {
  var query = ConsultaSQL(consulta); 
  var rows = [];
  for (var i in query) {
    rows.push(query[i]);
  }
  return rows;
}
//------------------ USUARIOS----------------------------
function insertarUsuario(nombre_usuario, apellidoPaterno, apellidoMaterno, correo, puesto, departamento, rol, usuario, contrasena) {
  // Escapar los valores 
  nombre_usuario = escaparSQL(nombre_usuario);
  apellidoPaterno = escaparSQL(apellidoPaterno);
  apellidoMaterno = escaparSQL(apellidoMaterno);
  correo = escaparSQL(correo);
  puesto = escaparSQL(puesto);
  departamento = escaparSQL(departamento);
  rol = escaparSQL(rol);
  usuario = escaparSQL(usuario);
  contrasena = escaparSQL(contrasena);
  // Consulta SQL con los valores escapados
  var consulta = "INSERT INTO AG_Usuarios (nombre_usuario, apellidop, apellidom, correo, puesto, area_trabajo, id_rol, usuario, contrasena) " +
                 "VALUES ('" + nombre_usuario + "', '" + apellidoPaterno + "', '" + apellidoMaterno + "', '" + correo + "', '" + puesto + "', '" + departamento + "', " + rol + ", '" + usuario + "', '" + contrasena + "')";
  
  peticion(consulta);
}

// actualizar usuario
function actualizarUsuario(idUsuarioSeleccionado, nombre_usuario, apellidoPaterno, apellidoMaterno, correo, puesto, departamento, rol, usuario, contrasena) {
  nombre_usuario = escaparSQL(nombre_usuario);
  apellidoPaterno = escaparSQL(apellidoPaterno);
  apellidoMaterno = escaparSQL(apellidoMaterno);
  correo = escaparSQL(correo);
  puesto = escaparSQL(puesto);
  departamento = escaparSQL(departamento);
  rol = escaparSQL(rol);
  usuario = escaparSQL(usuario);
  contrasena = escaparSQL(contrasena);
  
  var consulta = "UPDATE AG_Usuarios SET nombre_usuario = '" + nombre_usuario + "', apellidop = '" + apellidoPaterno + "', apellidom = '" + apellidoMaterno + "', correo = '" + correo + "', puesto = '" + puesto + "', area_trabajo = '" + departamento + "', id_rol = " + rol + ", usuario = '" + usuario + "', contrasena = '" + contrasena + "' WHERE id_usuario = " + idUsuarioSeleccionado;
  
  peticion(consulta);
}

// Función para verificar si un usuario ya existe
function verificarUsuarioExistente(usuario, idUsuarioSeleccionado) {
  usuario = escaparSQL(usuario);
  var consulta = "SELECT * FROM AG_Usuarios WHERE usuario = '" + usuario + "' AND id_usuario != " + idUsuarioSeleccionado;
  return peticion(consulta);
}
// eliminar un usuario
function eliminarUsuario(idUsuarioSeleccionado) {
  idUsuarioSeleccionado = escaparSQL(idUsuarioSeleccionado);
  var consulta = "DELETE FROM AG_Usuarios WHERE id_usuario = " + idUsuarioSeleccionado;
  peticion(consulta);
}

//------------------- RESPONSABLES ----------------------
//agregar responsable
function insertarUsuarioResponsable(nombre, apellidoP, apellidoM, curp, rfc, correo, telefono, extension) {
  nombre = escaparSQL(nombre);
  apellidoP = escaparSQL(apellidoP);
  apellidoM = escaparSQL(apellidoM);
  curp = escaparSQL(curp);
  rfc = escaparSQL(rfc);
  correo = escaparSQL(correo);
  telefono = escaparSQL(telefono);
  extension = escaparSQL(extension);
  var consulta = "INSERT INTO AG_Usuarios (nombre_usuario, apellidop, apellidom, CURP, RFC, correo, Telefono, Extension, activo) " +
                 "VALUES ('" + nombre + "', '" + apellidoP + "', '" + apellidoM + "', '" + curp + "', '" + rfc + "', '" + correo + "', '" + telefono + "', '" + extension + "', 1)";
  peticion(consulta);
}
// actualizar responsable
function actualizarResponsable(idUsuario, activo) {
  idUsuario = escaparSQL(idUsuario);
  activo = escaparSQL(activo);
  var consulta = "UPDATE AG_Usuarios SET activo = " + activo + " WHERE id_usuario = " + idUsuario;
  peticion(consulta);
}

//------------------- CONCESIONES -----------------------
function editarConcesion(idConcesion, titulo, nombreLote, superficie, municipio, estado, concesionario, expedicion, vigencia, agrupamiento, cabezaGrupo, proyecto, responsable) {
  // Convertir las fechas 
  expedicion = Utilities.formatDate(new Date(expedicion), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  vigencia = Utilities.formatDate(new Date(vigencia), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  // Escapar los valores
  titulo = escaparSQL(titulo);
  nombreLote = escaparSQL(nombreLote);
  municipio = escaparSQL(municipio);
  estado = escaparSQL(estado);
  concesionario = escaparSQL(concesionario);
  agrupamiento = escaparSQL(agrupamiento);
  cabezaGrupo = escaparSQL(cabezaGrupo);
  proyecto = escaparSQL(proyecto);
  responsable = escaparSQL(responsable);

  var consulta = "UPDATE AG_ConcesionesMineras SET titulo = '" + titulo + "', nombre_lote = '" + nombreLote + "', superficie = " + superficie + ", municipio = '" + municipio + "', estado = '" + estado + "', concesionario = '" + concesionario + "', expedicion = '" + expedicion + "', vigencia = '" + vigencia + "', agrupamiento = '" + agrupamiento + "', cabeza_grupo = '" + cabezaGrupo + "', proyecto = '" + proyecto + "', responsable = '" + responsable + "' WHERE id_concesion = " + idConcesion;

  peticion(consulta);  
}
function insertarConcesion(titulo, nombreLote, superficie, municipio, estado, concesionario, expedicion, vigencia, agrupamiento, cabezaGrupo, proyecto, responsable) {
  try {
    // Convertir las fechas 
    expedicion = escaparSQL(expedicion);
    vigencia=escaparSQL(vigencia);

    titulo = escaparSQL(titulo);
    nombreLote = escaparSQL(nombreLote);
    municipio = escaparSQL(municipio);
    estado = escaparSQL(estado);
    concesionario = escaparSQL(concesionario);
    agrupamiento = escaparSQL(agrupamiento);
    cabezaGrupo = escaparSQL(cabezaGrupo);
    proyecto = escaparSQL(proyecto);
    responsable = escaparSQL(responsable);

    var consulta = "INSERT INTO AG_ConcesionesMineras (titulo, nombre_lote, superficie, municipio, estado, concesionario, expedicion, vigencia, agrupamiento, cabeza_grupo, proyecto, responsable) VALUES ('" + titulo + "', '" + nombreLote + "', " + superficie + ", '" + municipio + "', '" + estado + "', '" + concesionario + "', '" + expedicion + "', '" + vigencia + "', '" + agrupamiento + "', '" + cabezaGrupo + "', '" + proyecto + "', '" + responsable + "')";

    peticion(consulta);

    return { success: true }; 
  } catch (e) {
    Logger.log("Error en insertarConcesion: " + e.message);
    return { success: false, error: e.message };  
  }
}

function eliminarConcesion(idConcesion) {
  var consulta = "DELETE FROM AG_ConcesionesMineras WHERE id_concesion = " + idConcesion;
  peticion(consulta);
}
  //----------------------- TIPOS DE INFORMES -------------------
function getRegistrosPorPeriodoYNombreLote(periodoSeleccionado, nombreLoteBuscar) {
  var consulta = "SELECT * FROM AG_Registros WHERE periodo = '" + periodoSeleccionado + "'";
  if (nombreLoteBuscar) {
    consulta += " AND (NombreLote LIKE '%" + nombreLoteBuscar + "%' OR titulo LIKE '%" + nombreLoteBuscar + "%')";
  }
    return peticion(consulta);
}

function getConcesionByNombreLote(nombreLote) {
  var consulta = "SELECT * FROM AG_ConcesionesMineras WHERE nombre_lote = '" + nombreLote + "'";
    return peticion(consulta);
}

  // Funcion para buscar concesiones con el periodo y nombre/titulo de lote
function buscarConcesiones(periodo, nombreLoteBuscar) {
  var consulta = "SELECT R.NombreLote, C.id_concesion, C.titulo, C.nombre_lote, C.superficie, C.municipio, C.estado, C.concesionario, C.expedicion, C.vigencia, C.agrupamiento, C.cabeza_grupo, C.proyecto, C.responsable, C.SuperficieAgrupado " +
                 "FROM AG_Registros R " +
                 "INNER JOIN AG_ConcesionesMineras C ON R.NombreLote = C.nombre_lote " +
                 "WHERE R.periodo = '" + periodo + "'";

  // Si el campo nombreLoteBuscar tiene algún valor buscar en NombreLote o título
  if (nombreLoteBuscar) {
    consulta += " OR (R.NombreLote LIKE '%" + nombreLoteBuscar + "%' OR R.titulo LIKE '%" + nombreLoteBuscar + "%')";
  }
  var concesiones = peticion(consulta);
  return concesiones;
}

function obtenerDatosConcesion(idConcesion) {
  var consulta = "SELECT * FROM AG_ConcesionesMineras WHERE id_concesion = " + idConcesion;
  var concesion = peticion(consulta);
  return concesion[0]; // Suponiendo que id_concesion es único se devuelve el primer registro
}
//------------- EJEMPLO PARA DESCARGAR PDF ------------------
function generarPDF() {
  var datos = {
    nombre_cliente: "Juan Pérez",
    fecha: "27/01/2025",
    monto: "150.00"
  };
  var plantilla = HtmlService.createTemplateFromFile('plantillaPDF');
  plantilla.nombre_cliente = datos.nombre_cliente;
  plantilla.fecha = datos.fecha;
  plantilla.monto = datos.monto;
  var htmlFinal = plantilla.evaluate().getContent();
  var blob = Utilities.newBlob(htmlFinal, 'text/html', 'factura.html');
  var pdf = blob.getAs('application/pdf');
  var archivoPDF = DriveApp.createFile(pdf);
  Logger.log('PDF generado con éxito: ' + archivoPDF.getUrl());
  return archivoPDF.getUrl();
}
//------------------ REPORTE PDF -------------------------
function getPlantillaPDF(datos) {
  Logger.log(datos);    
  var template = HtmlService.createTemplateFromFile('plantillaPDF');
  template.lote = datos.lote;  
  template.fecha_dof = datos.fecha_dof;
  template.fecha_recepcion = datos.fecha_recepcion;
  template.telefono_contacto = datos.telefono_contacto;
  template.correo_contacto = datos.correo_contacto;
  template.rfc_legal = datos.rfc_legal;
  template.curp_legal = datos.curp_legal;
  template.nombre_legal = datos.nombre_legal;
  template.apep_legal = datos.apep_legal;
  template.apem_legal = datos.apem_legal;
  template.cel_legal = datos.cel_legal;
  template.titulo = datos.titulo;
  template.si_check = datos.si_check;
  template.no_check = datos.no_check;
  template.agrupamiento = datos.agrupamiento;
  template.anio_lote = datos.anio_lote;
  template.inicio_comp = datos.inicio_comp;
  template.fin_comp = datos.fin_comp;
  template.obra_minera = datos.obra_minera;
  template.levantamientos = datos.levantamientos;
  template.analisis = datos.analisis;
  template.desarrollo_minero = datos.desarrollo_minero;
  template.AMP_mineras = datos.AMP_mineras;
  template.AMLF_meta = datos.AMLF_meta;
  template.AMTV_personal = datos.AMTV_personal;
  template.PC_ambiente = datos.PC_ambiente;
  template.AOTC_trabajador = datos.AOTC_trabajador;
  template.vias_acceso = datos.vias_acceso;
  template.serv_general = datos.serv_general;
  template.ope_presas = datos.ope_presas;
  template.total = datos.total;
  template.produccion = datos.produccion;
  template.susp_tempo = datos.susp_tempo;
  template.susp_imposibilidad = datos.susp_imposibilidad;
  template.susp_concurso = datos.susp_concurso;
  template.susp_derrumbe = datos.susp_derrumbe;
  template.excedente = datos.excedente;
  template.inpc_actual = datos.inpc_actual;
  template.inpc_anterior = datos.inpc_anterior;
  template.excedente_actual = datos.excedente_actual;
  template.inversion_efectuada = datos.inversion_efectuada;
  template.total_comprobado = datos.total_comprobado;
  template.monto_minimoc = datos.monto_minimoc;
  template.result_montof = datos.result_montof;
  
  return template.evaluate().getContent();
}
