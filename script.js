const colors = ['red', 'yellow', 'green', 'blue'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', '+2', 'wild'];
const throwPool = document.querySelector('#throwPool');
const pool = document.querySelector('#pool');
const hands = document.querySelectorAll('.hand');
const player = document.querySelector('.player');
const unoBtn = document.querySelector("#unoBtn")
const turnBtn = document.querySelector('#turnBtn')
const endScreen = document.querySelector("#endScreen")
const gameScreen = document.querySelector("#gameScreen")
const newMatchScreen = document.querySelector("#newMatchScreen")
const throwPoolPosition = document.querySelector("#throwPoolPosition")
const poolPosition = document.querySelector("#poolPosition")

let threw = false
let thrownCards = []
let lastPlayer = document.querySelector('.turn')
let gameReversed = false
let colorPick = false;
let IMAGES = [];
let needToPull = 1
let pulled = 0

Main();

function Main() {
    gameScreen.style.height = window.innerHeight + "px"
    throwPoolPosition.style.left = (window.innerWidth - pool.getBoundingClientRect().right + 130) + "px"
    poolPosition.style.left = (window.innerWidth - throwPool.getBoundingClientRect().right + 130) + "px"
    window.addEventListener("resize", function () {
        gameScreen.style.height = window.innerHeight + "px"
        throwPoolPosition.style.left = (window.innerWidth - pool.getBoundingClientRect().right + 130) + "px"
        poolPosition.style.left = (window.innerWidth - throwPool.getBoundingClientRect().right + 130) + "px"
    })

    endScreen.style.display = "none"
    newMatchScreen.style.display = "none"
    gameScreen.style.display = "none"
    unoBtn.style.scale = 0

    for (let i = 0; i < 14; i++) {
        for (let j = 0; j < 8; j++) {
            IMAGES.push('' + i + j);
        }
    }


    for (let index = 0; index < IMAGES.length; index++) {
        pool.appendChild(RandomCard('card' + index));
    }


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

function StartGame() {
    newMatchScreen.style.display = "none"
    gameScreen.style.display = "flex"

    for (let index = 0; index < 7; index++) {
        hands.forEach(hand => {
            if (hand.classList.contains('player')) {
                hand.appendChild(pool.lastChild);
            }
            else {
                pool.lastChild.draggable = false;
                pool.lastChild.classList.add("Q" + pool.lastChild.src.split("cards/")[1] + "Q")
                pool.lastChild.src = 'img/card.png';
                hand.appendChild(pool.lastChild);
            }
        });
    }
    document.querySelector('#FIGMA').style.display = "none"

    document.querySelector('#poolCard').draggable = true;
    throwPool.lastChild.classList.add("default")
    thrownCards = [throwPool.lastChild]
    Highlight()
}

function NewMatch() {
    document.querySelector('#startScreen').style.display = "none"
    newMatchScreen.style.display = "block"
}

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

function Highlight() {
    document.querySelectorAll(".player .card").forEach(element => {
        element.classList.remove("throwable")
        if (canThrow(element)) {
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
    let dropTarget = event.target;
    const card = document.getElementById(event.dataTransfer.getData('text'));

    // GET RANDOM CARD FROM THE TOP OF THE POOL AND GIVE IT TO THE PLAYER
    dropTarget.style.filter = 'brightness(1)';

    if (dropTarget.parentElement.classList.contains("canPull")) dropTarget = dropTarget.parentElement

    if (card.id == 'poolCard') PullCard(dropTarget)

    // THROW CARD TO THE POOL
    else if (dropTarget == throwPool.lastChild) {
        ThrowCard(card);
    }
}

function PullCard(dropTarget) {
    if (dropTarget.classList.contains('canPull')) {
        pool.lastChild.style.display = 'inline';
        if (dropTarget != player) {
            pool.lastChild.classList.add("Q" + pool.lastChild.src.split("cards/")[1] + "Q")
            pool.lastChild.src = "img/card.png"
            pool.lastChild.draggable = false
        }
        dropTarget.appendChild(pool.lastChild);


        if (pool.childElementCount == 3) {
            pool.children[0].style.display = "none"
        }
        else if (pool.childElementCount == 2) {
            pool.style.display = "none"
            MatchEnd()
        }


        pulled += 1

        if (pulled == needToPull) {
            document.querySelector(".canPull").classList.remove("canPull")
            ShowTurnBtn()
            Highlight()
        }
    }
}

function canThrow(card) {
    let topPool = throwPool.lastChild
    if (!threw) {
        if (card.classList.contains('wild') || card.classList.contains('+4')) { colorPick = true; return true; }
        if (card.classList[1] == topPool.classList[1]) return true;
        if (card.classList[2] == topPool.classList[2]) return true;

    } else {
        if ((card.classList[1] == topPool.classList[1]) && (card.classList[2] == topPool.classList[2])) return true
    }
    return false;
}





function ThrowCard(card) {
    const parent = card.parentElement
    if (canThrow(card)) {
        if (player.classList.contains("turn")) {
            if (colorPick) {
                colorPick = false;
                document.querySelector(".colorPicker").style.scale = "1";
                document.querySelectorAll(".color").forEach(color => {
                    color.addEventListener('click', () => {
                        const type = card.classList[1]
                        card.classList.remove(type);
                        card.classList.add(color.classList[0]);
                        card.classList.add(type)
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
        if (parent.children.length == 1) MatchEnd()

        // handle saying UNO
        else if (parent.children.length == 2) {
            let saidUNO = false
            unoBtn.style.scale = 1
            unoBtn.addEventListener("click", () => {
                saidUNO = true
                ShowTurnBtn()
                unoBtn.style.scale = 0
            })
            setTimeout(() => {
                if (!saidUNO) {
                    unoBtn.style.scale = 0
                    needToPull == 1 ? needToPull = 2 : needToPull += 2
                    document.querySelector(".turn").classList.add("canPull")
                }
            }, 1800);
        } else if (needToPull == 1) ShowTurnBtn()

        Highlight()
    }
}


function MatchEnd() {
    turnBtn.disabled = "true"
    endScreen.style.display = "block"

    let leaderboard = []
    hands.forEach(element => {
        leaderboard.push(element.childElementCount + "." + element.children[0].innerText + (element.classList.contains("player") ? ".PLAYER" : ""))
    });
    leaderboard.sort()

    for (let index = 0; index < hands.length; index++) {
        let data = leaderboard[index].split(".")
        document.querySelector(".leaderboard").innerHTML += `
        <div class="leaderCard${data[2] ? " leaderCardPlayer" : ""}">
            <h2 class="placement">${index + 1}.</h2>
            <div>
                <h3>${data[1]}</h3>
                <p>Cards left: ${Number(data[0]) - 1}</p>
            </div>
        </div>`
    }
}



function NextTurn() {
    pulled = 0
    needToPull = 1
    lastPlayer = document.querySelector('.turn')
    let topCard = thrownCards.at(-1)
    let addition = 1
    let nextNum = Number(lastPlayer.id.slice(-1))
    let counters = { "reverse": 0, "skip": 0, "plus2": 0 }

    if (lastPlayer == player) {
        document.querySelectorAll(".player .card").forEach(element => {
            element.draggable = false
        });
    }



    if (!topCard.classList.contains("lookedAt")) {
        thrownCards.forEach(element => {
            if (element.classList.contains("+4") || element.classList.contains("+2")) needToPull = 0
        });
        thrownCards.forEach(element => {
            if (element.classList.contains("reverse")) counters["reverse"]++
            if (element.classList.contains("skip")) counters["skip"]++
            if (element.classList.contains("+2")) counters["plus2"]++
            if (element.classList.contains("+4")) needToPull += 4
        });

        if (counters["reverse"] % 2 != 0) gameReversed = !gameReversed
        addition += counters["skip"]
        // handle +2 cards
        for (let index = 0; index < counters["plus2"]; index++) {
            needToPull += 2
        }

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
            Highlight()
        });
    } else {
        setTimeout(function () {
            let didntThrow = true
            document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                if (canThrow(card)) {
                    card.src = 'img/cards/' + card.classList.value.split("Q")[1]

                    if (card.classList.contains("wild") || card.classList.contains("+4")) {
                        const tempList = []
                        card.classList.forEach(element => {
                            tempList.push(element)
                        });
                        tempList.push(card.classList[1])
                        tempList[1] = colors[Math.floor(Math.random() * colors.length)];
                        card.classList = []
                        for (let index = 0; index < tempList.length; index++) {
                            card.classList.add(tempList[index])
                        }
                    }
                    //cardAnimation(card, "throw")
                    ThrowCard(card)
                    didntThrow = false
                }
            })
            if (didntThrow == true || needToPull != 1) {
                for (let index = 0; index < needToPull; index++) {
                    //cardAnimation(card, "pull")
                    PullCard(nextPlayer)
                }
            }
        }, 1000)
    }
    ShowTurnBtn(false)
}

function cardAnimation(card, action) {
    let newCard = card.cloneNode()
    newCard.id = ""
    newCard.classList.add("animatedCard")

    if (action == "throw") {
        newCard.style.left = card.parentElement.getBoundingClientRect().left + "px"
        newCard.style.top = card.parentElement.getBoundingClientRect().top + "px"
    }
    else {
        newCard.style.left = poolPosition.style.left
    }
    document.querySelector("body").appendChild(newCard)


    if (action == "throw") {
        setTimeout(function () {
            newCard.style.transition = "1s"
            newCard.style.left = throwPoolPosition.style.left
            newCard.style.top = "46%"
            newCard.style.scale = 2
        }, 20)
    }
    else {
        setTimeout(function () {
            newCard.style.transition = "1s"
            newCard.style.left = card.parentElement.getBoundingClientRect().left + "px"
            newCard.style.top = card.parentElement.getBoundingClientRect().top + "px"
            newCard.style.scale = 2
        }, 20)
    }
}