//Declarar o contexto do canvas
const canvasEl = document.querySelector('canvas');
const canvasCtx = canvasEl.getContext('2d');
const gapX = 10;
const mouse = {x: 0, y:0};

//Criação do objeto CAMPO
const field = {
    w: window.innerWidth, //Propriedade largura
    h: window.innerHeight, //Propriedade altura

    //Método que possui uma função para desenhar o campo
    draw: function (){
        //Desenho do campo
        canvasCtx.fillStyle = "#286047"; //Define qual a cor do campo.
        
        //Usa a função Rect(x, y, largura, altura) para desenhar o campo na tela.
        canvasCtx.fillRect( 0, 0, 
            this.w, //O "this" serve para dizer que estamos fazendo referência ao objeto field.
            this.h);
    }
}

//Criação do objeto LINHA
const line = {
    w: 15, //Largura da linha
    h: field.h, //Altura da linha

    //Método que irá desenhar a linha
    draw: function(){
        //Desenhando a linha central
        canvasCtx.fillStyle = "#fff"; //Definindo a cor da linha central
        canvasCtx.fillRect(
            field.w / 2 - this.w / 2, //Definindo o inicio no  eixo x da barra
            0, //Definindo o eixo y do inicio da barra
            this.w, //Definindo a largura
            this.h); //Definindo a altura  
    }
}

//Criação do obejto RAQUETE ESQUERDA
const lefetPaddle = {
    x: gapX, 
    y: 0,
    w: line.w,
    h: 200,

    //Função que movimenta os valores de y de acordo com o mouse
    _move: function(){
        this.y = mouse.y - this.h / 2; //Para alinhar o mouse no meio da barra
    },

    //Método que irá desenhar a raquete esquerda
    draw: function(){
        canvasCtx.fillStyle = "#fff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

//Criação do objeto RAQUETE DIREITA
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 200,
    w: line.w,
    h: 200,
    speed: 5,

    //Função para alterar a velocidade da raquete
    _speedUp: function(){
        this.speed += 2;
    },

    //Função para animar a raquete direita
    _move: function(){
        if (this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed;
        }
        else{
            this.y -= this.speed;
        }
    },

    //Método que irá desenhar a raquete direita
    draw: function(){
        //Desenhando a raqute direita
        canvasCtx.fillStyle = "#fff";
        canvasCtx.fillRect(
            this.x, //Definindo o inicio do eixo x
            this.y, //Definindo o inicio do eixo y
            this.w, //Definindo a  largura da raquete
            this.h //Definindo a altura da raquete
        )
        this._move();
    }
}

//Criação do objeto PLACAR
const score = {
    human: 0,
    computer: 0,

    //Adição de pontos para o humano
    increaseHuman: function(){
        this.human++;
    },

    //Adição de pontos para o computador
    increaseComputer: function(){
        this.computer++;
    },

    //Método que irá desenhar o placar
    draw: function(){
        //Desenhando o placar
        canvasCtx.font = "bold 72px Arial"; //Definindo a fonte do texto no placar
        canvasCtx.textAlign = "center"; //Alinhando o texto no centro
        canvasCtx.textBaseline ="top"; //Alinhando o texto no topo
        canvasCtx.fillStyle = "#01341D" //Definindo a cor do texto
        canvasCtx.fillText(this.human, field.w/4, 50); //Definindo o placar esquerdo
        canvasCtx.fillText(this.computer, field.w/4 + field.w/2, 50); //Definindo o placar direito
    }
}

//Criação do objeto BOLA
const ball = {
    x: field.w  / 2,
    y: field.h / 2,
    r: 20,
    speed: 5, //Velocidade da bola
    directionX: 1, //Diz qual a direção de movimento da bolinha (1 -> Baixo | -1 -> Cima)
    directionY: 1, //Diz qual a direção de movimento da bolinha (1 -> Baixo | -1 -> Cima)

    //Função para calcular a posição
    _calcPosition: function(){
        //Verifica se o jogador 1 fez um ponto (x > Largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX){
            //Verifica se a raquete direita está na posição y da bola
            if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h){
                this._reverseX(); //Rebate a bola invertendo o sinal de x
            }
            //Caso for falso, pontuar o jogador 1
            else {
                score.increaseHuman();
                this._pointUp();
            }
        } 
        //Verifica se o computador fez o ponto
        else if (this.x < 0 + this.r + lefetPaddle.w + gapX){
            //Verifica se a raquete esquerda está na posição y da bola
            if (this.y + this.r > lefetPaddle.y && this.y - this.r < lefetPaddle.y + rightPaddle.h){
                this._reverseX();
            }
            else {
                score.increaseComputer();
                this._pointUp();
            }
        }

        //Condição para rebate na parte inferior da tela
        if ( (this.y - this.r < 0 && this.directionY < 0) || (this.y > field.h - this.r && this.directionY > 0)){
            this._reverseY(); 
        }

    },
    _reverseX: function(){
        this.directionX = this.directionX * (-1); //Função para inverter a somatória do X
    },
    _reverseY: function(){
        this.directionY = this.directionY * (-1); //Função para inverter a somátoria do Y
    },
    //Função para acelerar a bolinha
    _speedUp: function (){
        this.speed += 2;
    },
    //Função para centralizar a bolinha após pontuação
    _pointUp: function(){
        this._speedUp();
        rightPaddle._speedUp();

        this.x = field.w / 2;
        this.y = field.h / 2;
    },
    //Função responsável por modificar a propriedade x e y
    _move: function(){
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },

    //Método que irá desenhar a bola
    draw: function(){
        //Desenhando a bolinnha
        canvasCtx.fillStyle = "#fff";
        canvasCtx.beginPath() //Inicio do espaço para desenhar o arco
        canvasCtx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
        canvasCtx.fill() //Fim do espaço para desenhar o arco

        this._calcPosition();
        this._move();
    }
}

//Função setup.
function setup(){
/*
    É necessário definir o tamanho do canvasEl (canvas element) e tambemdo canvasCtx (canvas contexto). 
    A fim de proporcionar uma melhor experiência ao usuário, pois isso proporcionará que o campo preencha toda a tela.
*/
    canvasEl.width = canvasCtx.width = field.w; //O (window.innerWidth para capturar a largura da tela).
    canvasEl.height =  canvasCtx.height = field.h; //O (window.innerHeight para capturar a altura da tela).
}

//Função para desenhar os elementos do game.
function draw() {
    field.draw(); //Chamada do método do objeto para desenhar o campo na tela.
    line.draw(); //Chamada do método do objeto para desenhar a linha central.
    lefetPaddle.draw(); //Chamada do método do objeto de desenhar a raquete esquerda. 
    rightPaddle.draw(); //Chamada do método do objeto de desenhar a raquete direita.
    score.draw(); //Chamada do método do objeto de desenhar o placar.
    ball.draw(); //Chamada do método do objeto de desenhar a bola.
}
setup();
draw();

//Suavizando a animação
window.animateFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  })()

  function main(){
    animateFrame(main);
    draw();  
}

setup();
main();

//Evento que recebe ataulização do mouse
canvasEl.addEventListener('mousemove', function(e){
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})
