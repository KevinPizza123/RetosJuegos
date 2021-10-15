let iconos = [];
let selecciones = [];
let cont = 0;
let btn = document.querySelectorAll("button");
let level = 12;
let lastLevel;

btn.forEach(function (item){
    item.addEventListener("click", function() {
        let selectedLevel = item.dataset.level || lastLevel;
        createPanel(selectedLevel);
    })
})

function loadIcons(){
    iconos = [
        '<img src="img/2x/baseball.png" alt="Icono de baseball">',
        '<img src="img/2x/basket.png" alt="Icono de basket">',
        '<img src="img/2x/control.png" alt="Icono de control">',
        '<img src="img/2x/cricket.png" alt="Icono de cricket">',
        '<img src="img/2x/dado.png" alt="Icono de dado">',
        '<img src="img/2x/football.png" alt="Icono de fubol americano">',
        '<img src="img/2x/futbol.png" alt="Icono de futbol">',
        '<img src="img/2x/pito.png" alt="Icono de pito">',
        '<img src="img/2x/robot.png" alt="Icono de robot">',
        '<img src="img/2x/softball.png" alt="Icono de softball">',
        '<img src="img/2x/tenis.png" alt="Icono de tenis">',
        '<img src="img/2x/volleyball.png" alt="Icono de volleyball">',
    ]
}

function createPanel(selectedLevel){
    selecciones = [];
    loadIcons();
    
    if(selectedLevel == 12){
        
        btn[0].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 47%), hsl(34, 82%, 44%));")
        btn[1].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
        btn[2].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
    }

    if(selectedLevel == 18){
        btn[0].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
        btn[1].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 47%), hsl(34, 82%, 44%));")
        btn[2].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
    }

    if(selectedLevel == 24){
        btn[0].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
        btn[1].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 57%), hsl(34, 82%, 54%));")
        btn[2].setAttribute("style", "background: linear-gradient(hsl(34, 82%, 47%), hsl(34, 82%, 44%));")
    }

    level = selectedLevel;
    lastLevel = level;
    
    let panel = document.getElementById("tablero")
    let tarjetas = []

    for (let i = 0; i < selectedLevel; i++){
        tarjetas.push(
            `<div class="area-tarjeta" onclick="selectCard(${i})">
                <div class="tarjeta" id="tarjeta${i}">
                    <div class="cara trasera" id="trasera${i}">
                        ${iconos[0]}
                    </div>
                    <div class="cara superior">
                        <img src="img/2x/ask.png" alt="Signo de pregunta">
                    </div>
                </div>
            </div>`
        )
        if (i % 2 == 1){
            iconos.splice(0,1)
        }
    }
    tarjetas.sort(() => Math.random() - 0.5)
    panel.innerHTML = tarjetas.join(" ")
}

function selectCard(i){
    let tarjeta = document.getElementById("tarjeta"+i)
    
    if(tarjeta.style.transform != "rotateY(180deg)"){
        tarjeta.style.transform = "rotateY(180deg)"
        selecciones.push(i)
    }

    if(selecciones.length == 2){
        deseleccionar(selecciones)
        selecciones = []
    }
}

function deseleccionar(selecciones) {
    setTimeout(() => {
        let trasera1 = document.getElementById("trasera" + selecciones[0])
        let trasera2 = document.getElementById("trasera" + selecciones[1])
        
        if(trasera1.innerHTML != trasera2.innerHTML){
            let tarjeta1 = document.getElementById("tarjeta" + selecciones[0])
            let tarjeta2 = document.getElementById("tarjeta" + selecciones[1])
            tarjeta1.style.transform = "rotateY(0deg)"
            tarjeta2.style.transform = "rotateY(0deg)" 
        }
        else{
            trasera1.style.background = "plum"
            trasera2.style.background = "plum"
            cont += 2;
            
            if(cont == level){
                alert("¡Felicidades, has ganado!. Vuelve empezar");
                cont = 0
            }
        }
    }, 500);
}

