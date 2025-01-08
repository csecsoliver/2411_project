aiform = `
   <div id="aiform" style="
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
    margin-top:-50px    
    ">

    <div id="form1" style="
        height: auto;
        margin-top: 13px;
        margin-right: 10px;
        
      ">
        <h3 style="
            
            margin: 0;
            margin-bottom: 10px;
        ">SELECT OPPONENT</h3>
        <div style="
        display: flex;
        ">

            <div class="form">
                <form onchange="FormChange()" id="gamemode">
                    <input type="radio" id="offline" name="opponent" value="local">
                    <label for="offline">Simple (Offline)</label><br>
                    <input type="radio" id="gpt" name="opponent" value="ai">
                    <label for="gpt">Smart (ChatGPT)</label><br>
                    <input type="radio" id="mp" name="opponent" value="mp" disabled>
                    <label for="mp">Multiplayer</label><br>
                </form>
            </div>
        </div>
    </div>
    <div class="spacer" style="
        width: 0px;
        border: 1px solid black;
        height:70px;
        position: relative;
        top: 40px;
        left: 0px;

        ">
    </div>
    <div style="height: auto;
            margin-top: 13px;
            margin-right: 10px;
            margin-left: 15px;
        "
        id="form2">
        <h3 style="
            margin: 0;
            margin-bottom: 10px;
        ">
        SELECT OPTIONS
        </h3>
        <form onchange="" >
            <label for="name">Username:</label><br>
            <input type="text" id="name" name="name" value="Player1" style="border-radius: 5px;"><br>
            <label for="token" id="tokenlabel">AI token</label>
            <input type="password" id="token" name="token" value="" style="border-radius: 5px;">
            <!-- <input type="submit" value="Submit"> -->
        </form>
        
    </div>

`;


document.getElementById("aiform").outerHTML = aiform;
// document.getElementById("startBtn").outerHTML = '<button onclick="StartGameBrain()" id="startBtn">Start Game</button>'
// document.getElementById("turnBtn").outerHTML = '<button id="turnBtn" enabled onclick="NextTurnBrain()">End Turn</button>'

let players = { player1: [], player2: [], player3: [], player4: [] }

let card_function_index = { 1: "n1", 2: "n2", 3: "n3", 4: "n4", 5: "n5", 6: "n6", 7: "n7", }
let gamemode = "ai"
let move = ""
let aitoken = ""

let reverseColorMappings = new Map();
reverseColorMappings.set("red", "r")
reverseColorMappings.set("blue", "b")
reverseColorMappings.set("green", "g")
reverseColorMappings.set("yellow", "y")
reverseColorMappings.set("gray", "n")

let functionMappings = new Map();
functionMappings.set("n1", "1")
functionMappings.set("n2", "2")
functionMappings.set("n3", "3")
functionMappings.set("n4", "4")
functionMappings.set("n5", "5")
functionMappings.set("n6", "6")
functionMappings.set("n7", "7")
functionMappings.set("n8", "8")
functionMappings.set("n9", "9")
functionMappings.set("n0", "0")
functionMappings.set("c0", "wild")
functionMappings.set("d4", "+4")
functionMappings.set("k0", "skip")
functionMappings.set("s0", "reverse")
functionMappings.set("d2", "+2")
// the reverse mapping
let colorMappings = new Map();
colorMappings.set("r", "red")
colorMappings.set("b", "blue")
colorMappings.set("g", "green")
colorMappings.set("y", "yellow")
colorMappings.set("n", "gray")

let reverseFunctionMappings = new Map();
reverseFunctionMappings.set("1", "n1")
reverseFunctionMappings.set("2", "n2")
reverseFunctionMappings.set("3", "n3")
reverseFunctionMappings.set("4", "n4")
reverseFunctionMappings.set("5", "n5")
reverseFunctionMappings.set("6", "n6")
reverseFunctionMappings.set("7", "n7")
reverseFunctionMappings.set("8", "n8")
reverseFunctionMappings.set("9", "n9")
reverseFunctionMappings.set("0", "n0")
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
document.getElementById("tokenlabel").style.display = "none"
document.getElementById("token").style.display = "none"


function StartGameBrain() {
    aitoken = document.getElementById("token").value
    if (gamemode == "ai") {
        verify = httpGet("http://csnotes.ddns.net:80/ai/" + aitoken)
    } else if (gamemode == "mp") {
        verify = httpGet("http://csnotes.ddns.net:80/join/" + aitoken + "/" + document.getElementById("name").value)
    }
    if (verify == "Invalid session ID") {
        alert("Invalid input")
        return
    }
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
function FormChange() {
    gamemode = document.querySelector('input[name="opponent"]:checked').value
    if (gamemode == "ai") {
        document.getElementById("tokenlabel").style.display = "block"
        document.getElementById("token").style.display = "block"
        document.getElementById("tokenlabel").innerHTML = "AI token"
    } else if (gamemode == "local") {
        document.getElementById("tokenlabel").style.display = "none"
        document.getElementById("token").style.display = "none"
    } else if (gamemode == "mp") {
        document.getElementById("tokenlabel").style.display = "block"
        document.getElementById("token").style.display = "block"
        document.getElementById("tokenlabel").innerHTML = "Game ID"
    }
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
                        hand.push(reverseFunctionMappings.get(currentCard[1]) + "n")
                    }
                    else {
                        hand.push(reverseFunctionMappings.get(currentCard[2]) + reverseColorMappings.get(currentCard[1]))
                    }

                    counter += 1

                })
                console.log(1)
                let throwPoolClass = document.querySelector("#throwPool").lastChild.classList
                let throwPool = ""
                let chosenColor = "n"
                if (throwPoolClass.contains("wild") || throwPoolClass.contains("+4")) {
                    throwPool = (reverseFunctionMappings.get(throwPoolClass[2]) + "n")
                    chosenColor = reverseColorMappings.get(throwPoolClass[1])
                }
                else {
                    throwPool = (reverseFunctionMappings.get(throwPoolClass[2]) + reverseColorMappings.get(throwPoolClass[1]))
                }
                console.log(hand)
                console.log(2)
                move = httpGet("http://csnotes.ddns.net:80/aimove/" + aitoken + "/" + hand + "/" + throwPool + "/" + chosenColor)
                console.log(move)
                createFloatingMessage(httpGet("http://csnotes.ddns.net:80/snarky/" + aitoken), 7000);
                // await delay(4000);

                if (move == "draw") {
                    console.log("draw move detected")
                    needToPull = 1
                    didntThrow = true
                } else {
                    moveClassFunction = functionMappings.get(move.slice(0, 2))
                    moveClassColor = colorMappings.get(move[2])
                    chosenColor = "n"
                    if (move.length > 3) {
                        chosenColor = colorMappings.get(move[4])
                    }
                    console.log(moveClassFunction + ", " + moveClassColor + ", " + chosenColor)
                    document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                        console.log("card.classList.contains(moveClassFunction" + card.classList.contains(moveClassFunction))
                        console.log("card.classList.contains(moveClassColor)" + card.classList.contains(moveClassColor))

                        if ((card.classList.contains(moveClassFunction) && card.classList.contains(moveClassColor) && didntThrow) || (card.classList.contains("wild") && card.classList.contains("+4") && didntThrow)) {

                            if (card.classList.contains("wild") || card.classList.contains("+4")) {

                                Message(chosenColor, true)
                                card.classList.add(chosenColor)
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
                            console.log("threw")
                        }
                    })
                    console.log("didn't throw: " + didntThrow)
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
                let didntThrow = true
                let hand = []
                let counter = 0
                let currentCard
                document.querySelectorAll("#" + nextPlayer.id + " .card").forEach(card => {
                    currentCard = card.classList
                    if (currentCard.contains("wild") || currentCard.contains("+4")) {
                        hand.push(reverseFunctionMappings.get(currentCard[1]) + "n")
                    }
                    else {
                        hand.push(reverseFunctionMappings.get(currentCard[2]) + reverseColorMappings.get(currentCard[1]))
                    }

                    counter += 1

                })
                console.log(1)
                let throwPoolClass = document.querySelector("#throwPool").lastChild.classList
                let throwPool = ""
                let chosenColor = "n"
                if (throwPoolClass.contains("wild") || throwPoolClass.contains("+4")) {
                    throwPool = (reverseFunctionMappings.get(throwPoolClass[2]) + "n")
                    chosenColor = reverseColorMappings.get(throwPoolClass[1])
                }
                else {
                    throwPool = (reverseFunctionMappings.get(throwPoolClass[2]) + reverseColorMappings.get(throwPoolClass[1]))
                }
                console.log(hand)
                console.log(2)
                move = httpGet("http://csnotes.ddns.net:80/submit/" + aitoken + "/" + hand + "/" + throwPool + "/" + chosenColor)
            }
        }, 1000)

    }
    ShowTurnBtn(false)

}


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    console.log(theUrl)
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    console.log(xmlHttp.responseText)
    return xmlHttp.responseText;
}


function createFloatingMessage(message, duration = 3000) {
    // Create the floating message element
    const floatingMessage = document.createElement("div");
    floatingMessage.textContent = message;

    floatingMessage.style.position = "fixed";
    floatingMessage.style.top = "28%";
    floatingMessage.style.left = "50%";
    floatingMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    floatingMessage.style.color = "white";
    floatingMessage.style.padding = "10px 20px";
    floatingMessage.style.borderRadius = "5px";
    floatingMessage.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
    floatingMessage.style.zIndex = 1000;
    floatingMessage.style.display = "block";
    floatingMessage.style.width = "1100px";
    floatingMessage.style.textAlign = "center";
    floatingMessage.style.transform = "translateX(-50%)";
    floatingMessage.style.fontSize = "25px";

    // Apply styles directly via JavaScript
    

    // Append the floating message to the body
    document.body.appendChild(floatingMessage);

    // Automatically remove the message after the specified duration
    setTimeout(() => {
        floatingMessage.remove();
    }, duration);
}

// Example usage
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
    console.log("Before delay");
    await delay(4000); // Pause for 4 seconds
    console.log("After 4 seconds");
}

