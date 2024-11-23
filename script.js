const colors = ['red', 'blue', 'green', 'yellow'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
let IMAGES = [];


for (let i = 0; i < 14; i++) {
    for (let j = 0; j < 8; j++) {
        IMAGES.push('' + i + j);
    }
}


function Start() {
    const players = document.querySelectorAll('.hand');


    for (let index = 0; index < 7; index++) {
        players.forEach((player, i) => {
            player.appendChild(RandomCard("card" + i + index));
        });
    }
    document.querySelector('#startBtn').remove();

    GeneratePool();

}

function RandomCard(index) {
    let card = document.createElement('img');
    let classValue = '';
    while (true) {
        color = colors[Math.floor(Math.random() * colors.length)];
        value = values[Math.floor(Math.random() * values.length)];

        let IMAGE = value;

        switch (color) {
            case 'red':
                IMAGE += ['0', '4'][Math.floor(Math.random() * 2)];
                break;
            case 'blue':
                IMAGE += ['3', '7'][Math.floor(Math.random() * 2)];
                break;
            case 'green':
                IMAGE += ['2', '6'][Math.floor(Math.random() * 2)];
                break;
            case 'yellow':
                IMAGE += ['1', '5'][Math.floor(Math.random() * 2)];
                break;
        }

        if (IMAGES.includes(IMAGE)) {
            card.src = 'img/cards/' + IMAGE + '.png';
            for (let index = 0; index < IMAGES.length; index++) {
                if (IMAGES[index] == IMAGE) {
                    IMAGES.splice(index, 1);
                    break;
                }
            }
            break
        }


    }
    switch (value) {
        case '10':
            classValue = 'skip';
            break;
        case '11':
            classValue = 'reverse';
            break;
        case '12':
            classValue = '+2';
            break;
        case '13':
            classValue = 'wild';
            break;
        default:
            classValue = value;
            break;
    }
    card.id = index;
    card.classList.add('card');
    card.classList.add(classValue == "wild" ? classValue : color);
    card.classList.add(classValue);
    card.draggable = true;

    return card;
}


function GeneratePool() {
    const pool = document.querySelector('.pool');
    for (let index = 0; index < IMAGES.length; index++) {
        pool.appendChild(RandomCard('pool' + index));
        pool.childNodes[index].style.display = 'none';
    }
}













// DRAG AND DROP
function DragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
}

function DragOver(event) {
    const group = event.target;
    if (!group.classList.contains('hand')) return
    group.style.border = '5px dashed black';
    group.style.backgroundColor = '#ccc';



    event.preventDefault();
}

function DragLeave(event) {

    const group = event.target;
    if (!group.classList.contains('hand')) return
    group.style.border = '1px solid black';
    group.style.backgroundColor = '#a3a3a3';
}

function Drop(event) {
    const group = event.target;
    const card = document.getElementById(event.dataTransfer.getData('text'));
    if (!group.classList.contains('hand')) return
    group.style.border = '1px solid black';
    group.style.backgroundColor = '#a3a3a3';
    group.appendChild(card);
}