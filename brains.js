aiform = `<div id="aiform"
    style="
    display:flex;
    background-color:#D9D9D9 !important;
    background-image: none;
    border-radius: 30px; 
    border: 1px solid black;
    
    height: fit-content;
    width: 400px;
    margin: 0 auto;
    padding: 10px 20px;
    padding-top: 0;
    margin-bottom: 10px;
    margin-top:-40px
    ">

    <div id="form1" style="height: auto;">
        <h3>SELECT OPPONENT</h3>
        <div stye="
        display: flex;
        ">
            
            <div class="form">
                <form>
                    <input type="radio" id="offline" name="opponent" value="HTML">
                    <label for="offline">Easy (Offline)</label><br>
                    <input type="radio" id="gpt" name="opponent" value="CSS">
                    <label for="gpt">Hard (ChatGPT)</label><br>
                    <input type="radio" id="mp" name="opponent" value="JavaScript">
                    <label for="mp">Multiplayer
                    </label><br>
                </form>
            </div>
        </div>
    </div>
<div class="spacer" style="
            width: 0px;
            border: 1px solid black;
            height:inherit;
            "></div>
            </div>

`;


document.getElementById("aiform").outerHTML = aiform;
// document.getElementById("startBtn").outerHTML = '<button onclick="StartGameBrain()" id="startBtn">Start Game</button>'
// document.getElementById("turnBtn").outerHTML = '<button id="turnBtn" enabled onclick="NextTurnBrain()">End Turn</button>'

let players = { player1: [], player2: [], player3: [], player4: [] }

let card_function_index = { 1: "n1", 2: "n2", 3: "n3", 4: "n4", 5: "n5", 6: "n6", 7: "n7", }
let gamemode = "local"
let move = ""
let aitoken = ""

let reverseColorMappings = new Map();
colorMappings.set("red", "r")
colorMappings.set("blue", "b")
colorMappings.set("green", "g")
colorMappings.set("yellow", "y")
colorMappings.set("gray", "n")

let functionMappings = new Map();
functionMappings.set("n1", "1")
functionMappings.set("n2", "2")
functionMappings.set("n3", "3")
functionMappings.set("n4", "4")
functionMappings.set("n5", "5")
functionMappings.set("n6", "6")
functionMappings.set("n7", "7")
functionMappings.set("c0", "wild")
functionMappings.set("d4", "+4")
functionMappings.set("k0", "skip")
functionMappings.set("s0", "reverse")
functionMappings.set("d2", "+2")
// the reverse mapping
let colorMappings = new Map();
reverseColorMappings.set("r", "red")
reverseColorMappings.set("b", "blue")
reverseColorMappings.set("g", "green")
reverseColorMappings.set("y", "yellow")
reverseColorMappings.set("n", "gray")

let reverseFunctionMappings = new Map();
reverseFunctionMappings.set("1", "n1")
reverseFunctionMappings.set("2", "n2")
reverseFunctionMappings.set("3", "n3")
reverseFunctionMappings.set("4", "n4")
reverseFunctionMappings.set("5", "n5")
reverseFunctionMappings.set("6", "n6")
reverseFunctionMappings.set("7", "n7")
reverseFunctionMappings.set("wild", "c0")
reverseFunctionMappings.set("+4", "d4")
reverseFunctionMappings.set("skip", "k0")
reverseFunctionMappings.set("reverse", "s0")
reverseFunctionMappings.set("+2", "d2")


if (document.getElementById("aiform").outerHTML == aiform) {
    console.log('Successful gameloop injection. To disable: unlink brains.js from index.html')
} else {
    console.log(document.getElementById("aiform").outerHTML)
}

function StartGameBrain() {
    StartGame()
    console.log("player1 cards:")
    document.querySelectorAll(".player .card").forEach(element => {

        console.log(element)

    });
    console.log("player2 cards:")
    document.querySelectorAll("#player2 .card").forEach(element => {
        console.log(element)

    });
    console.log("player3 cards:")
    document.querySelectorAll("#player3 .card").forEach(element => {
        console.log(element)

    });
    console.log("player4 cards:")
    document.querySelectorAll("#player4 .card").forEach(element => {
        console.log(element)

    });
}

function NextTurnBrain() {




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
        needToPull += 2 * counters["plus2"]

        topCard.classList.add("lookedAt")
    }


    if (gameReversed) {
        nextNum -= addition;
    }
    else {
        nextNum += addition;
    }

    if (nextNum > hands.length) {
        nextNum = nextNum % hands.length;
    }
    if (nextNum < 1) {
        nextNum = hands.length + (nextNum % hands.length);
    }
    let nextPlayer = document.querySelector(`#player${nextNum}`)



    lastPlayer.classList.remove("turn")
    lastPlayer.classList.remove("canPull")
    nextPlayer.classList.add("turn");
    nextPlayer.classList.add("canPull");
    throwPool.lastChild.classList.add("default")
    threw = false
    thrownCards = [throwPool.lastChild]

    if (nextPlayer == player) {
        if (needToPull != 1) Message(color = false)
        document.querySelectorAll(".player .card").forEach(element => {
            element.draggable = true
            Highlight()
        });
    }

    // enemy AI
    else {
        setTimeout(async function () {
            let didntThrow = true
            if (gamemode == "local") {
                let didntThrow = true
                document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                    if (canThrow(card) && didntThrow) {
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
                            Message(tempList[1], true)
                        }
                        let src = 'img/cards/' + card.classList.value.split("Q")[1]
                        cardAnimation(card, src, "throw")

                        setTimeout(function () {
                            card.src = src
                            ThrowCard(card)
                            document.querySelectorAll(".animatedCard").forEach(element => {
                                element.remove()
                            });
                        }, CARDANIMSPEED * 1000)
                        didntThrow = false
                    }
                })
                if (!didntThrow) await pause(CARDANIMSPEED * 1000)
                if (didntThrow || needToPull != 1) {
                    for (let index = 0; index < needToPull; index++) {
                        cardAnimation(pool.lastChild, 'img/card.png', "pull", nextPlayer)
                        await pause(CARDANIMSPEED * 1000)
                        PullCard(nextPlayer)
                        document.querySelectorAll(".animatedCard").forEach(element => {
                            element.remove()
                        });
                    }
                }
            } else if (gamemode == "ai") {
                let didntThrow = true
                let hand = []
                let counter = 0
                let currentCard
                document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                    currentCard = card.classList
                    if (currentCard.contains("wild") || currentCard.contains("+4")) {
                        hand.push(reverseFunctionMappings.get(currentCard[2]) + "n")
                    }
                    else {
                        hand.push(reverseFunctionMappings.get(currentCard[2]) + reverseColorMappings.get(currentCard[1]))
                    }
                    
                    counter += 1
                    
                })
                move = httpGet("http://localhost:8080/aimove/"+aitoken + "/<hand>/<throw_pool>/<chosen_color>")
                document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                    if (canThrow(card) && didntThrow) {
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
                            Message(tempList[1], true)
                        }
                        let src = 'img/cards/' + card.classList.value.split("Q")[1]
                        cardAnimation(card, src, "throw")

                        setTimeout(function () {
                            card.src = src
                            ThrowCard(card)
                            document.querySelectorAll(".animatedCard").forEach(element => {
                                element.remove()
                            });
                        }, CARDANIMSPEED * 1000)
                        didntThrow = false
                    }
                })
                if (canThrow(card) && didntThrow) {
                    
                    let src = 'img/cards/' + card.classList.value.split("Q")[1]
                    cardAnimation(card, src, "throw")
                    
                    setTimeout(function () {
                        card.src = src
                        ThrowCard(card)
                        document.querySelectorAll(".animatedCard").forEach(element => {
                            element.remove()
                        });
                    }, CARDANIMSPEED * 1000)
                    didntThrow = false
                }
                if (!didntThrow) await pause(CARDANIMSPEED * 1000)
                    if (didntThrow || needToPull != 1) {
                        for (let index = 0; index < needToPull; index++) {
                        cardAnimation(pool.lastChild, 'img/card.png', "pull", nextPlayer)
                        await pause(CARDANIMSPEED * 1000)
                        PullCard(nextPlayer)
                        document.querySelectorAll(".animatedCard").forEach(element => {
                            element.remove()
                        });
                    }
                }
                
            } else if (gamemode == "mp") {
                NextTurnMP()
            }
        }, 1000)
    }

}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}