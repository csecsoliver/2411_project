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
                    <label for="mp">Offline</label><br>
                </form>
            </div>
        </div>
    </div>
<div class="spacer" style="
            width: 0px;
            border: 1px solid black;
            height:inherit;
            "></div></div>
<button onclick="StartGameBrain()" id="startBtn">NEW GAME</button>`;


document.getElementById("startBtn").outerHTML = aiform;
if (document.getElementById("startBtn").outerHTML == aiform) {
    console.log('Successful gameloop injection. To disable: unlink brains.js from index.html')
} else {
    console.log(document.getElementById("aiform").outerHTML)
}

function StartGameBrain() {
    StartGame()
    console.log("hello wrold");
}