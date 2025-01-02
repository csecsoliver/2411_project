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
document.getElementById("startBtn").outerHTML = '<button onclick="StartGameBrain()" id="startBtn">Start Game</button>'

let players = {player1:[],player2:[],player3:[],player4:[]}

let card_function_index = {1:"n1",2:"n2",3:"n3",4:"n4",5:"n5",6: "n6", 7: "n7", }


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


