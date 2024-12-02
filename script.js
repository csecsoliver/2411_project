const colors = ['red', 'yellow', 'green', 'blue'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', '+2', 'wild'];
const show = ['#pool', '#throwPool'];
const throwPool = document.querySelector('#throwPool');
const pool = document.querySelector('#pool');
const hands = document.querySelectorAll('.hand');
const player = document.querySelector('.player');
const turnBtn = document.querySelector('#turnBtn')

let threw = false
let thrownCards = []
let lastPlayer = document.querySelector('.turn')
let gameReversed = false
let colorPick = false;
let IMAGES = [];


Main();


function ShowTurnBtn(bool = true) {
    if (bool) {
        turnBtn.style.opacity = 1
        turnBtn.disabled = false
        turnBtn.style.cursor = "pointer"
    } else {
        turnBtn.style.opacity = 0
        turnBtn.disabled = true
        turnBtn.style.cursor = "default"
    }
}

function StartGame() {
    turnBtn.style.display = "block"
    show.forEach(element => {
        document.querySelector(element).style.display = 'block';
    });
    hands.forEach(hand => {
        hand.style.display = 'block';
    });

    for (let index = 0; index < 7; index++) {
        hands.forEach(hand => {
            if (hand.classList.contains('player')) {
                hand.appendChild(pool.lastChild);
            }
            else {
                pool.lastChild.draggable = false;
                pool.lastChild.src = 'img/card.png';
                hand.appendChild(pool.lastChild);
            }
        });
    }
    document.querySelector('#startScreen').remove();
    document.querySelector('#FIGMA').remove();

    document.querySelector('#poolCard').draggable = true;
    throwPool.lastChild.classList.add("default")
    thrownCards = [throwPool.lastChild]
    Highlight()
}

function Highlight() {
    document.querySelectorAll(".player .card").forEach(element => {
        element.classList.remove("throwable")
        if (canThrow(element, throwPool.lastChild)) {
            element.classList.add("throwable")
            document.querySelector(".turn").classList.remove("canPull")
        }
    });
    colorPick = false
}

function RandomCard(id) {
    let card = document.createElement('img');
    let random = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    let color = Number(random.slice(-1));
    let value = Number(random.slice(0, -1));

    switch (color) {
        case 4:
            color = 0;
            break;
        case 5:
            color = 1;
            break;
        case 6:
            color = 2;
            break;
        case 7:
            color = 3;
            break;
    }


    if (IMAGES.includes(random)) {
        card.src = 'img/cards/' + random + '.png';
        for (let index = 0; index < IMAGES.length; index++) {
            if (IMAGES[index] == random) {
                IMAGES.splice(index, 1);
                break;
            }
        }
    }

    card.id = id;
    card.classList.add('card');

    // handle +4
    if (random == '134' || random == '135' || random == '136' || random == '137') {
        card.classList.add('+4');
    } else {
        card.classList.add(values[value] == "wild" ? "wild" : colors[color]);
        card.classList.add(values[value]);
    }
    card.draggable = true

    return card;
}


function Main() {

    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 8; j++) {
            IMAGES.push('' + i + j);
        }
    }


    for (let index = 0; index < IMAGES.length; index++) {
        pool.appendChild(RandomCard('card' + index));
    }

    show.forEach(element => {
        document.querySelector(element).style.display = 'none';
    });
    hands.forEach(hand => {
        hand.style.display = 'none';
    });


    // append to throw pool only if it is not a wild card
    for (let index = 2; index < pool.children.length; index++) {
        card = pool.children[index];
        if (!card.classList.contains('wild') && !card.classList.contains('+4')) {
            throwPool.appendChild(card);
            card.draggable = false;
            break;
        }

    }


}







// DRAG AND DROP
function DragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function DragOver(event) {
    const group = event.target;
    group.style.filter = 'brightness(0.7)';

    event.preventDefault();
}

function DragLeave(event) {
    const group = event.target;
    group.style.filter = 'brightness(1)';
}

function Drop(event) {
    const dropTarget = event.target;
    const card = document.getElementById(event.dataTransfer.getData('text'));

    dropTarget.style.filter = 'brightness(1)';
    // GET RANDOM CARD FROM THE TOP OF THE POOL AND GIVE IT TO THE PLAYER
    if (dropTarget.classList.contains('canPull') && card.id == 'poolCard') {
        pool.lastChild.style.display = 'inline';
        document.querySelector(".canPull").classList.remove("canPull")
        dropTarget.appendChild(pool.lastChild);
        ShowTurnBtn()
        Highlight()
    }

    // THROW CARD TO THE POOL
    else if (dropTarget == throwPool.lastChild) {
        ThrowCard(card);
    }
}

function canThrow(card, throwPool) {
    if (!threw) {
        if (card.classList.contains('wild') || card.classList.contains('+4')) { colorPick = true; return true; }
        if (card.classList[1] == throwPool.classList[1]) return true;
        if (card.classList[2] == throwPool.classList[2]) return true;

    } else {
        if ((card.classList[1] == throwPool.classList[1]) && (card.classList[2] == throwPool.classList[2])) return true
        if (card.classList.contains("wild") && throwPool.classList.contains("wild")) return true
        if (card.classList.contains("+4") && throwPool.classList.contains("+4")) return true
    }
    return false;
}





function ThrowCard(card) {
    if (canThrow(card, throwPool.lastChild)) {
        if (player.classList.contains("turn")) {
            if (colorPick) {
                colorPick = false;
                document.querySelector(".colorPicker").style.scale = "1";
                document.querySelectorAll(".color").forEach(color => {
                    color.addEventListener('click', () => {
                        const type = throwPool.lastChild.classList[1]
                        throwPool.lastChild.classList.remove(type);
                        throwPool.lastChild.classList.add(color.classList[0]);
                        throwPool.lastChild.classList.add(type)
                        document.querySelector(".colorPicker").style.scale = "0";
                        Highlight()
                    });
                });
            }
        }
        if (thrownCards[0].classList.contains("default")) {
            thrownCards[0] = card
        } else {
            thrownCards.push(card)
        }

        document.querySelector('#styleCard').src = throwPool.lastChild.src;
        card.draggable = false;
        card.classList.remove("throwable")

        throwPool.lastChild.remove();
        throwPool.appendChild(card);

        threw = true
        ShowTurnBtn()
        Highlight()
    }
}



function NextTurn() {
    lastPlayer = document.querySelector('.turn')
    let topCard = thrownCards.at(-1)
    let addition = 1
    let nextNum = Number(lastPlayer.id.slice(-1))
    let counters = { "reverse": 0, "skip": 0, "plus2": 0, "plus4": 0 }

    if (lastPlayer == player) {
        document.querySelectorAll(".player .card").forEach(element => {
            element.draggable = false
        });
    }



    if (!topCard.classList.contains("lookedAt")) {
        thrownCards.forEach(element => {
            if (element.classList.contains("reverse")) counters["reverse"]++
            if (element.classList.contains("skip")) counters["skip"]++
            if (element.classList.contains("+2")) counters["plus2"]++
            if (element.classList.contains("+4")) counters["plus4"]++
        });

        if (counters["reverse"] % 2 != 0) gameReversed = !gameReversed
        addition += counters["skip"]

        topCard.classList.add("lookedAt")

    }





    if (gameReversed) {
        nextNum -= addition;
    }
    else {
        nextNum += addition;
    }


    if (nextNum > hands.length) nextNum = addition == 2 ? 2 : 1;
    if (nextNum < 1) nextNum = addition == 2 ? hands.length - 1 : hands.length;
    let nextPlayer = document.querySelector(`#player${nextNum}`)



    lastPlayer.classList.remove("turn")
    lastPlayer.classList.remove("canPull")
    nextPlayer.classList.add("turn");
    nextPlayer.classList.add("canPull");
    throwPool.lastChild.classList.add("default")
    threw = false
    thrownCards = [throwPool.lastChild]

    if (nextPlayer == player) {
        document.querySelectorAll(".player .card").forEach(element => {
            element.draggable = true
        });
        Highlight()
    }
    //ShowTurnBtn(false)
}