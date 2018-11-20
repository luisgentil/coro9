
//		1.0 							

window.onload = function() {
// variables globales y textos para toda la aplicación
	// la ___variable 'cantos'____ está contenida en Coro\www\resources\cancionesTocho.js. tiene estructura json
	// función para generar todos los ID's
	var TodosID = [];
	for (x in cantos){TodosID.push(cantos[x].Id);}
	// la variable TodosID permite buscar datos de cualquier canto a partir de su id.
	// ver el conjunto de datos disponibles al inicio del archivo 'cancionesTocho.js'.
	// la app descarga la lista de cantos de cada domingo, es decir, la lista de id's.
	// a partir de los ID podemos cargar todos los cantos, mediante cantos[ID_de_esteCanto].Letra (letra o lo que sea)

	// cantos de la celebración del día: ___cantosHoy___
	// a partir de Firebase, obtenemos la lista de cantos mediante la función buscarFirebase
	var ordenDeCantos = ["entrada","perdon","gloria","antifona","aleluya","ofertorio","santo","padrenuestro","paz","comunion","envio","maria","villancico","extra"];
	var todosLosCantos = ["entrada","perdon","gloria","antifona","aleluya","ofertorio","santo","padrenuestro","paz","comunion","envio","maria","villancico","extra"];
	var momentosCantos = {"entrada":"rito_inicial","perdon":"rito_inicial","gloria":"rito_inicial", "antifona":"liturgia_palabra","aleluya":"liturgia_palabra", "ofertorio": "liturgia_eucaristica", "santo": "liturgia_eucaristica", "padrenuestro": "liturgia_eucaristica","paz": "liturgia_eucaristica","comunion": "liturgia_eucaristica","envio": "despedida","maria":"despedida","villancico": "despedida","extra":"despedida"};
	var cantosHoy = {
		"fecha" : "01/01/1999",
		"mensaje" : "(sin conexión a la Base de Datos)",
		"rito_inicial" : {
			"entrada" : 2854,
			"perdon" : 2928,
			"gloria" : 2961
			},
		"liturgia_palabra" : {
			"antifona" : 3002,
			"aleluya" : 3227
			},
		"liturgia_eucaristica" : {
			"ofertorio" : 3272,
			"santo" : 3286,
			"padrenuestro" : 3311,
			"paz" : 3321,
			"comunion" : 3390
			},
		"despedida" : {
			"envio" : 3538,
			"maria" : 3595,
			"villancico" : 9999,
			"extra" : 3515
			}
		};
	// cargando los valores en local Storage
	localStorage.Acordes = "Acordes OFF";
	cargarLocalStorage(cantosHoy);
	// carga los textos explicativos e instrucciones  
	cargaInicial();
	localStorage.contador = 0;
	localStorage.instrucciones ="visible";

	// crea los elementos interactivos para Hammer
	var myMenu = document.getElementById('botonMenu');
	var myPad = document.getElementById('activo');
	var botonAcordes =document.getElementById("botonAcordes");

	var controlMenu				= new Hammer(myMenu);
	var controlPad 				= new Hammer(myPad);
	var controlBotAcordes		= new Hammer(botonAcordes);
	var controlBotEntrada 		= new Hammer(entrada);
	var controlBotPerdon 		= new Hammer(perdon);
	var controlBotGloria 		= new Hammer(gloria);
	var controlBotAntifona 		= new Hammer(antifona);
	var controlBotAleluya 		= new Hammer(aleluya);
	var controlBotOfertorio 	= new Hammer(ofertorio);
	var controlBotSanto 		= new Hammer(santo);
	var controlBotPadrenuestro 	= new Hammer(padrenuestro);
	var controlBotPaz 			= new Hammer(paz);
	var controlBotComunion 		= new Hammer(comunion);
	var controlBotEnvio 		= new Hammer(envio);
	var controlBotMaria 		= new Hammer(maria);
	var controlBotVillancico 	= new Hammer(villancico);
	var controlBotExtra 		= new Hammer(extra);

	// define los eventos a escuchar, y enlaza las funciones  
	controlPad.on("swipeleft swiperight tap press", function(ev) {padFunction(ev);});

	controlMenu.on("tap",			function(ev) {OcultarMenu();});
	controlBotAcordes.on("tap",	 function(ev) {funcionAcordes();});

	controlBotEntrada.on("tap",		function(ev){LlamarCanto('entrada');});
	controlBotPerdon.on("tap",		function(ev){LlamarCanto('perdon');});
	controlBotGloria.on("tap",		function(ev){LlamarCanto('gloria');});
	controlBotAntifona.on("tap",	function(ev){LlamarCanto('antifona');});
	controlBotAleluya.on("tap",		function(ev){LlamarCanto('aleluya');});
	controlBotOfertorio.on("tap",	function(ev){LlamarCanto('ofertorio');});
	controlBotSanto.on("tap",		function(ev){LlamarCanto('santo');});
	controlBotPadrenuestro.on("tap",function(ev){LlamarCanto('padrenuestro');});
	controlBotPaz.on("tap",			function(ev){LlamarCanto('paz');});
	controlBotComunion.on("tap",	function(ev){LlamarCanto('comunion');});
	controlBotEnvio.on("tap",		function(ev){LlamarCanto('envio');});
	controlBotMaria.on("tap",		function(ev){LlamarCanto('maria');});
	controlBotVillancico.on("tap",	function(ev){LlamarCanto('villancico');});
	controlBotExtra.on("tap",		function(ev){LlamarCanto('extra');});

	// ahora carga los valores actualizados, desde Firebase
	buscarFirebase("coro9","despedida","extra"); 

	// función para los eventos del Pad -activo (div 'cinco')
	function padFunction(evento) {
		switch (evento.type) {
			case ("tap"): funcionAdelante(evento);
			break;
			case ("swipeleft"): funcionAdelante(evento);
			break;
			case ("swiperight"): funcionAtras();
			break;
			case ("press"): funcionReset();
			break;
		}
	};

	function funcionAdelante(evento) {
		var momento = document.getElementById('momento').innerText;
		var ultimoCanto = ordenDeCantos[ordenDeCantos.length-1];
		if (momento != ultimoCanto){
			var indice = ordenDeCantos.indexOf(momento);
			var cantoSiguiente = ordenDeCantos[indice + 1];
			funcionCargar(cantoSiguiente);
		};
	}

	function funcionAtras(evento) {
		var momento = document.getElementById('momento').innerText;
		if (momento != "entrada" || "canto"){
			var indice = ordenDeCantos.indexOf(momento);
			var cantoSiguiente = ordenDeCantos[indice - 1];
			funcionCargar(cantoSiguiente);
		};
	}

	function funcionReset() {
		funcionCargar(ordenDeCantos[0]);
	}

	// Descarga la lista de cantos prevista para la celebración 
	function buscarFirebase(codigoDeMiCoro, momentoLiturgia, dato) {
		var databaseService = firebase.database();
		var ref = databaseService.ref();
		dato = codigoDeMiCoro;
		ref.child(dato.toLowerCase()).on("value", function(snapshot){resultado = (snapshot.val() || null);
		cargarLocalStorage(resultado); 
		document.getElementById('fecha-evento').innerText = resultado.fecha + " - " + resultado.mensaje;
		});
	};

	// actualiza la memoria local con los datos de los cantos descargados.
	function cargarLocalStorage(datos) {
		for (canto in ordenDeCantos) {
			var esteCanto = ordenDeCantos[canto];
			var momento = momentosCantos[esteCanto];
			var codigoCantoDescargado = datos[momento][esteCanto];
			localStorage.setItem(ordenDeCantos[canto], codigoCantoDescargado);
			if (codigoCantoDescargado == "9999") {
				document.getElementById(ordenDeCantos[canto]).classList.toggle('botones_oculto');}
		}

		localStorage.setItem("fecha", datos.fecha);
		localStorage.setItem("mensaje", datos.mensaje);
	};


	function funcionCargar(canto) {
	// esta función actualiza el Pad con el canto correspondiente (momento, título, texto)
	// primero oculta las instrucciones, si aún están visibles
		if (localStorage.instrucciones =="visible") {
			localStorage.instrucciones ="invisible";
			document.getElementById('instrucciones_div').classList.toggle('instrucciones_oculta');
		}
	// ahora carga el canto que se le ha pedido
		var ID = localStorage.getItem(canto);
		var texto = obtenerLetra(Number(ID), TodosID);
		document.getElementById('momento').innerText = canto;
		document.getElementById("titulo-canto").innerText = texto.titulo;
		document.getElementById("texto-canto").innerHTML = funcionPublicar(texto.letra);
	};


	// encontrar la letra de un canto
	function obtenerLetra(id, TodosID) {
		var esteCanto = {'id': '000', 'letra':'letra', 'titulo':"Título"};
		var valor = Number(id);
		esteCanto.id = TodosID.indexOf(valor);
		esteCanto.letra = cantos[esteCanto.id].Letra;
		esteCanto.titulo = cantos[esteCanto.id].Titulo;
		return esteCanto;
	};


	function LlamarCanto(canto) {
		funcionCargar(canto);
		OcultarMenu();
	};


	function cargaInicial() { // 	creo que esta función es inútil , ¿mantener en 0.9.1?
		document.getElementById("titulo-canto").innerText = 'Bienvenido';
		var estado = localStorage.Acordes;
		};

		// esta función añade el texto al pad activo, transformando el texto plano en html, teniendo en cuenta si los acordes están o no activos
	function funcionPublicar(text) {
		if (localStorage.Acordes=="Acordes OFF"){var estado = 'off';}
		else {var estado = "on";};
		var lineas_con_clase = [];
		var lineas = text.split("\n");
			var contador = 0; // ¿de verdad hace falta este contador? ¿se utiliza??
				for (var x in lineas) { 
		  			var num_letras_inicial = lineas[x].length;
		  			var letras = lineas[x].split(" ");
		  			var reunidas = letras.join("");
		  			var num_letras_final = reunidas.length;
		  			var diferencia = (num_letras_inicial - num_letras_final) / num_letras_inicial;
		  			if (diferencia >= 0.4) {
		  				var y = "<p id=\'lin" + contador + "\' class=\'acordes_" + estado + "\'>";  // ¿de verdad hace falta este contador? 
		  				contador +=1;}  // ¿de verdad hace falta este contador? 
		  			else {
		  				var y = "<p class=\'letras\'>";}
		  			  var z = y + lineas[x] + "</p>";
		  			  lineas_con_clase.push(z);
		}
		var texto_procesado = lineas_con_clase.join("");
	return texto_procesado;
	}


//	esta función añade o elimina los acordes del texto actual del cuadro pad-activo, quitando y añadiendo las clases correspondientes
function funcionAcordes() {
	//	activar los acordes 						
	var estado = localStorage.Acordes;
	if (estado =="Acordes OFF"){
	// selecciona todas las líneas del pad activo
		var lineas = document.getElementsByTagName('p');
	// recorre todas las líneas	
		for (i = 0; i < lineas.length; i++) {
			var cada_linea = lineas[i];
	// para cada línea con clase de acordes (no letras): retira la clase off, y añade la clase on
			if (cada_linea.classList[0] == "acordes_off") {
				cada_linea.classList.remove('acordes_off');
				cada_linea.classList.add('acordes_on');}
		}
	// almacena el nuevo estado
		localStorage.Acordes = "Acordes ON";
	}
	// O BIEN
	//	anular los acordes 							
	else if (estado =="Acordes ON"){
		var lineas = document.getElementsByTagName('p');
		for (i = 0; i < lineas.length; i++) {
			var cada_linea = lineas[i];
			if (cada_linea.classList[0] == "acordes_on") {
				cada_linea.classList.remove('acordes_on');
				cada_linea.classList.add('acordes_off');}
		}
		localStorage.Acordes = "Acordes OFF";
	};
	//	 finalmente, cambia el icono del botón de acordes (alterna)
	document.getElementById('prohibido').classList.toggle('rojo'); 
	};


function OcultarMenu() {
	document.getElementById('botonera').classList.toggle('botonera_oculta');
	}

}