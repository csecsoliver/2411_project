const colors = ['red', 'yellow', 'green', 'blue'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', '+2', 'wild'];
const show = ['#pool', '#throwPool'];
let IMAGES = [];
const hands = document.querySelectorAll('.hand');
let colorPick = false;


for (let i = 0; i < 14; i++) {
    for (let j = 0; j < 8; j++) {
        IMAGES.push('' + i + j);
    }
}
GeneratePool();
show.forEach(element => {
    document.querySelector(element).style.display = 'none';
});
hands.forEach(hand => {
    hand.style.display = 'none';
});

function Start() {
    const pool = document.querySelector('#pool');
    show.forEach(element => {
        document.querySelector(element).style.display = 'block';
    });
    hands.forEach(hand => {
        hand.style.display = 'block';
    });

    for (let index = 0; index < 7; index++) {
        hands.forEach(hand => {
            if (hand.id == 'pool') return;
            if (hand.classList.contains('player')) {
                hand.appendChild(pool.lastChild);
            }
            else {
                pool.lastChild.src = 'img/card.png';
                pool.lastChild.draggable = false;
                hand.appendChild(pool.lastChild);

            }
        });
    }
    document.querySelector('#startScreen').remove();

    document.querySelector('#poolCard').draggable = true;
    pool.lastChild.draggable = false;
    document.querySelector('#throwPool').appendChild(pool.lastChild);
}

function RandomCard(id) {
    let card = document.createElement('img');
    let random = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    if (random.length == 3) {
        value = Number(random[0] + random[1]);
        color = Number(random[2]);

    } else {
        value = Number(random[0]);
        color = Number(random[1]);
    }

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
    card.draggable = true;

    return card;
}


function GeneratePool() {
    const pool = document.querySelector('#pool');
    for (let index = 0; index < IMAGES.length; index++) {
        pool.appendChild(RandomCard('card' + index));
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
    const pool = document.querySelector('#pool');
    const throwPool = document.querySelector('#throwPool');

    dropTarget.style.filter = 'brightness(1)';
    // GET RANDOM CARD FROM THE TOP OF THE POOL AND GIVE IT TO THE PLAYER
    if (dropTarget.classList.contains('player') && card.id == 'poolCard') {
        pool.lastChild.style.display = 'inline';
        dropTarget.appendChild(pool.lastChild);
    }

    // THROW CARD TO THE POOL
    else if (dropTarget == throwPool.lastChild) {
        if (canThrow(card, throwPool.lastChild)) {
            if (colorPick) {
                colorPick = false;
                document.querySelector(".colorPicker").style.scale = "1";
                document.querySelectorAll(".color").forEach(color => {
                    color.addEventListener('click', () => {
                        throwPool.lastChild.classList.remove(throwPool.lastChild.classList[1]);
                        throwPool.lastChild.classList.add(color.classList[0]);
                        document.querySelector(".colorPicker").style.scale = "0";
                    });
                });
            }
            document.querySelector('#styleCard').src = throwPool.lastChild.src;
            throwPool.lastChild.remove();
            card.draggable = false;

            throwPool.appendChild(card);
        }
    }
}

function canThrow(card, throwPool) {
    if (card.classList.contains('wild') || card.classList.contains('+4')) { colorPick = true; return true; }
    if (card.classList[1] == throwPool.classList[1]) return true;
    if (card.classList[2] == throwPool.classList[2]) return true;
    return false;
}