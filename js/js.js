function start() {
	$("#inicio").hide()	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>")
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>")
	$("#fundoGame").append("<div id='inimigo2'></div>")
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>")
	$("#fundoGame").append("<div id='disparo'></div>")
	$("#fundoGame").append("<div id='placar'></div>")
	$("#fundoGame").append("<div id='vidas'></div>")
	let arma = $("#disparo").hide()

	//Principais variáveis do jogo	
	let jogo = {}
	let velocidade = 5
	let pontos = 0
	let salvos = 0
	let perdidos = 0
	let vidas = 3
	let posicaoY = parseInt(Math.random() * 334)
	let podeAtirar = true
	let fimjogo = false
	let TECLA = {
		W: 87,
		S: 83,
		D: 68
	}

	jogo.pressionou = []

	//Verifica se o usuário pressionou alguma tecla		
	$(document).keydown((e) => {
		jogo.pressionou[e.which] = true;
	});

	$(document).keyup((e) => {
		jogo.pressionou[e.which] = false
	})
	
	//Game Loop
	jogo.timer = setInterval(loop,30)
	
	function loop(){
		moveFundo()
		moveJogador()
		moveInimigo1()		
		moveInimigo2()
		moveAmigo()
		moveArma()
		colisao()
		mostraPlacar()
		mostraVida()
		acabaGame()

		function moveFundo() {		
			esquerda = parseInt($("#fundoGame").css("background-position"))
			$("#fundoGame").css("background-position",esquerda-1)	
		}

		function moveJogador() {	
			if (jogo.pressionou[TECLA.W]) {
				let topo = parseInt($("#jogador").css("top"))
				$("#jogador").css("top",topo-10);
				if(topo <= 20){
					$("#jogador").css("top", 20);
				}			
			}			
			if (jogo.pressionou[TECLA.S]) {				
				let topo = parseInt($("#jogador").css("top"))
				$("#jogador").css("top", topo + 10)
				if(topo >= 430){
					$("#jogador").css("top", 430)
				}	
			}
			
			if (jogo.pressionou[TECLA.D]) {
				if(podeAtirar){
					let posicaoJogador = parseInt($("#jogador").css("top"))				
					arma.show()
					.css("left", 200)
					.css("top", posicaoJogador + 40)
					podeAtirar =  false	
				}											
			}		
		}	
		
		function moveInimigo1() {
			posicaoX = parseInt($("#inimigo1").css("left"))
			$("#inimigo1").css("left", posicaoX-velocidade)
			$("#inimigo1").css("top", posicaoY);
				
			if (posicaoX <=0 ) {
			posicaoY = parseInt(Math.random() * 334)
			$("#inimigo1").css("left", 730);
			$("#inimigo1").css("top", posicaoY)				
			}
		}

		function moveInimigo2() {
			posicaoX = parseInt($("#inimigo2").css("left"))
			$("#inimigo2").css("left", posicaoX - velocidade+1)					
			if (posicaoX <= 0 ) {			
				$("#inimigo2").css("left", 790)						
			}
		}

		function moveAmigo() {
			posicaoX = parseInt($("#amigo").css("left"))
			$("#amigo").css("left", posicaoX + 1.3)					
			if (posicaoX >= 880 ) {			
				$("#amigo").css("left", 10)					
			}
		}

		function moveArma(){
			posicaoX = parseInt($("#disparo").css("left"))
			$("#disparo").css("left", posicaoX + 20)
			if (posicaoX >= 880 ) {					
				arma.hide()
				podeAtirar = true							
			}	
		}

		function colisao() {
			let colisao1 = ($("#jogador").collision($("#inimigo1")))
			let colisao2 = ($("#jogador").collision($("#inimigo2")))
			let colisao3 = ($("#disparo").collision($("#inimigo1")))
			let colisao4 = ($("#disparo").collision($("#inimigo2")))
			let colisao5 = ($("#jogador").collision($("#amigo")))
			let colisao6 = ($("#inimigo2").collision($("#amigo")))

			// Batida com inimigo 1			
			if (colisao1.length > 0) {					
				inimigo1X = parseInt($("#inimigo1").css("left"))
				inimigo1Y = parseInt($("#inimigo1").css("top"))
				explosao1(inimigo1X,inimigo1Y)			
				posicaoY = parseInt(Math.random() * 334)
				$("#inimigo1").css("left",694)
				$("#inimigo1").css("top",posicaoY)
				vidas--
						
			}
			
			// Batida com inimigo 2
			if (colisao2.length > 0){			
				inimigo2X = parseInt($("#inimigo2").css("left"))
				inimigo2Y = parseInt($("#inimigo2").css("top"))
				explosao1(inimigo2X, inimigo2Y)
				vidas--	
				$("#inimigo2").remove()
				reposicionaInimigo('inimigo2', 'none', 3000)
													
			}

			// Disparo com inimigo 1
			if (colisao3.length > 0) {					
				inimigo1X = parseInt($("#inimigo1").css("left"))
				inimigo1Y = parseInt($("#inimigo1").css("top"));				
				explosao1(inimigo1X,inimigo1Y)
				$("#disparo").css("left",950)
		
				posicaoY = parseInt(Math.random() * 334)
				$("#inimigo1").css("left",694)
				$("#inimigo1").css("top",posicaoY)
				pontos += 100;
					
			}

			// Disparo com inimigo 2
			if (colisao4.length > 0) {					
				inimigo2X = parseInt($("#inimigo2").css("left"))
				inimigo2Y = parseInt($("#inimigo2").css("top"))				
				explosao1(inimigo2X,inimigo2Y)
				$("#disparo").css("left",950)			
				$("#inimigo2").remove()
				reposicionaPersonagem('inimigo2', 'none', 3000)
				pontos += 50
				salvos++				
			}

			// Amigo com jogador ou com inimigo 2
			//colisao5.length > 0 || 
			if (colisao6.length > 0) {			
				amigo1X = parseInt($("#amigo").css("left"))
				amigo1Y = parseInt($("#amigo").css("top"))
				explosao3(amigo1X, amigo1Y)
				$("#amigo").remove()
				reposicionaPersonagem('amigo', 'anima3', 6000)
				perdidos++		
			}			
		
		}

		function explosao1(inimigo1X, inimigo1Y) {
			$("#fundoGame").append("<div id='explosao1'></div")
			$("#explosao1").css("background-image", "url(imgs/explosao.png)")
			let div = $("#explosao1")
			
			div.css("top", inimigo1Y)			
			div.css("left", inimigo1X)
			div.animate({width:200, opacity:0}, "slow")

			let tempoExplosao = window.setInterval(removeExplosao, 1000)		
			function removeExplosao() {					
				div.remove();
				window.clearInterval(tempoExplosao)
				tempoExplosao = null				
			}
				
		}

		function explosao3(amigoX,amigoY) {
			$("#fundoGame").append("<div id='explosao3' class='anima4'></div")
			$("#explosao3").css("top",amigoY)
			$("#explosao3").css("left",amigoX)
			let tempoExplosao3 = window.setInterval(resetaExplosao3, 1000)
			function resetaExplosao3() {
				$("#explosao3").remove()
				window.clearInterval(tempoExplosao3)
				tempoExplosao3 = null;
			}
		}

		function reposicionaPersonagem(personagem, classe, tempo) {	
			let tempoColisao4 = window.setInterval(reposiciona4, tempo)				
			function reposiciona4() {
				window.clearInterval(tempoColisao4)
				tempoColisao4 = null				
				if (fimjogo == false) {				
					$("#fundoGame").append(`<div id='${personagem}' class='${classe}'></div`)					
				}
					
			}	
		}	
		
		function mostraPlacar(){$("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>")}
		function mostraVida(){$("#vidas").html(`<h2> Vidas: ${vidas} </h2>`)}
		function acabaGame(){
			if(vidas < 0){
				window.clearInterval(jogo.timer)
				alert('Fim do jogo! sua pontuação foi: ' + pontos)
				location.reload()
			}
		}

	} 
}
