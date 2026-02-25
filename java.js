var myGamePiece;
var myObstacles = [];

function startGame() {
    // Crea il giocatore (30x30, rosso, posizione x:10, y:120)
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.querySelector(".game-container").prepend(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        
        // Controlli da tastiera automatici
        window.onkeydown = (e) => {
            if (e.key === "ArrowUp") myGamePiece.y -= 15;
            if (e.key === "ArrowDown") myGamePiece.y += 15;
        };
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.update = function() {
        let ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };
    this.crashWith = function(otherobj) {
        // Ritorna true se i rettangoli si toccano
        return !(this.x + this.width < otherobj.x || this.x > otherobj.x + otherobj.width || 
                 this.y + this.height < otherobj.y || this.y > otherobj.y + otherobj.height);
    };
}

function updateGameArea() {
    // 1. Controllo Collisioni
    if (myObstacles.some(obs => myGamePiece.crashWith(obs))) {
        myGameArea.stop();
        return;
    }

    myGameArea.clear();
    myGameArea.frameNo++;
    document.getElementById("score-value").innerText = myGameArea.frameNo;

    // 2. Generazione Ostacoli (ogni 150 frame)
    if (myGameArea.frameNo === 1 || myGameArea.frameNo % 100 === 0) {
        let x = myGameArea.canvas.width;
        let gap = 100;
        let height = Math.floor(Math.random() * 150) + 20;
        myObstacles.push(new component(20, height, "#333", x, 0));
        myObstacles.push(new component(20, x, "#333", x, height + gap));
    }

    // 3. Muovi e disegna ostacoli
    myObstacles.forEach(obs => {
        obs.x -= 2;
        obs.update();
    });

    myGamePiece.update();
}