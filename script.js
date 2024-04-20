import { colors } from './colors.js'

const playBtn = document.querySelector('.center');
const wheelBody = document.querySelector(".wheel");
const arrow = document.querySelector('.arrow');
const gameScore = document.querySelector('.game-score');
const bet = document.querySelector('#bet');
const popUp = document.querySelector('.bet-popup');
const errorPopUp = document.querySelector('.error-message');

let savedDegree;
let newBet;

for (let i = 0; i < colors.length; i++) {
    gameScore.textContent = 0;

    const triangle = document.createElement('div');
    const label = document.createElement('span')
    label.classList.add('label');
    label.textContent = `${colors[i].action} ${colors[i].value}`;
    triangle.appendChild(label);


    triangle.classList.add('triangle');
    triangle.id = `${i}`;
    triangle.setAttribute('action', `${colors[i].action}`);
    triangle.setAttribute('value', `${colors[i].value}`);


    triangle.style.backgroundImage = `linear-gradient(${colors[i].color1}, ${colors[i].color2})`

    triangle.style.transform = `translateX(-50%) rotate(${30 * i}deg)`

    wheelBody.appendChild(triangle);
}

playBtn.addEventListener('click', play)

bet.addEventListener('input', () => {
    bet.style.border = '2px solid black';
    errorPopUp.classList.remove('goUp');
})

function play() {
    popUp.classList.remove('move-pop-up');
    playBtn.setAttribute('disabled', '');

    try {
        inputValidation(bet.value);

        newBet = parseInt(bet.value);
        bet.value = '';

        const rotateDeg = 360 * 3 + Math.floor(Math.random() * 670);

        wheelBody.style.transition = 'transform 5s';
        wheelBody.classList.add('blur');

        if (savedDegree === undefined) {
            savedDegree = rotateDeg;
            wheelBody.style.transform = `rotate(-${savedDegree}deg)`
        } else {
            savedDegree += rotateDeg;
            wheelBody.style.transform = `rotate(-${savedDegree}deg)`
        }
    } catch (e) {
        errorPopUp.textContent = e.message;
        bet.style.border = '2px solid #ff3333';
        errorPopUp.classList.add('goUp');

        playBtn.removeAttribute('disabled');
    }

}

playBtn.addEventListener('transitionend', (e) => {
    e.stopPropagation();
})

wheelBody.addEventListener('transitionend', () => {
    playBtn.removeAttribute('disabled');
    getWinner();
    wheelBody.classList.remove('blur');
});

function getWinner() {
    const uppperElement = arrow.getBoundingClientRect();
    const x = (uppperElement.right - uppperElement.left) / 2 + uppperElement.left;
    const y = uppperElement.bottom;

    const winnerSector = document.elementFromPoint(x, y);

    const sectorAction = winnerSector.getAttribute('action');
    const sectorValue = parseInt(winnerSector.getAttribute('value'));

    scoreCalculation(sectorAction, sectorValue, newBet);
    newBet = undefined;
}


function scoreCalculation(action, value, bet) {
    let oldScore = parseInt(gameScore.textContent);
    let betSum;

    switch (action) {
        case '+':
            betSum = bet + value;
            oldScore += betSum;

            popUpValidation(betSum, popUp);
            gameScore.textContent = oldScore;
            break;
        case '-':
            betSum = bet - value;
            oldScore += betSum;

            popUpValidation(betSum, popUp);
            gameScore.textContent = oldScore;
            break;
        case 'X':
            betSum = bet * value;
            oldScore += betSum;

            popUpValidation(betSum, popUp);
            gameScore.textContent = oldScore;
            break;
        case '/':
            betSum = Math.floor(bet / value);
            oldScore += betSum;

            popUpValidation(betSum, popUp);
            gameScore.textContent = oldScore;
            break;
    }
}

function popUpValidation(sum, popUp) {
    if (sum > 0) {
        popUp.textContent = `+ ${sum}$`;
        popUp.style.color = '#5cb85c';
    } else {
        popUp.textContent = `${sum}$`;
        popUp.style.color = '#ff3333';
    }

    popUp.classList.add('move-pop-up');
}

function inputValidation(betInput) {
    const pattern = /^[1-9]\d*$/;

    if (!pattern.test(betInput)) {
        throw new Error("Please, type in the correct input. It should be a positive number.");
    }
}