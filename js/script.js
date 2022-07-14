/*
  ! TO DO
  1. Shuffle Deck
  2. Player Actions
  3. Draw Animations
  4. Card Creation
  5. Success/Fail Animation
  6. Restart
  7. Wagers?
*/

// * Global Variables
let cards = [];
let deck = [];
let shuffledDeck;
// const hand = document.getElementById('hand');
const dealer = document.getElementById('dealer');
const drawBtn = document.getElementById('draw-btn');
const startBtn = document.getElementById('start-btn');
let deckPos = 0;
let playerCardTotal = 0;
let dealerCardTotal = 0;
const cardLimit = 21;
const playerTurn = 'player';
const dealerTurn = 'dealer';
let turn = playerTurn;
let tempCardVal;

// * Create the Card Array
function createCardArray() {
  for (i=0; i<4; i++) {
    let suite;
    switch (i) {
      case 1:
        suite = 'heart';
        break;
      case 2:
        suite = 'diamond';
        break;
      case 3:
        suite = 'club';
        break;
    
      default:
        suite = 'spade';
        break;
    }
    for (x=1; x<14; x++) {
      let num;
      switch (x) {
        case 1:
          num = 'A';
          break;
        case 11:
          num = 'J';
          break;
        case 12:
          num = 'Q';
          break;
        case 13:
          num = 'K';
          break;
      
        default:
          num = x;
          break;
      }
      createCardData(num, suite);
    }
  }
}
function createCardData(num, suite) {
  cards.push({num: num, suite: suite});
  // console.log(cards);
}

// * Create A Card
function createCardFace(cardData) {
  let cardFace = ``;
  let centerContent = ``;
  let color = 'red';
  let royal;
  if (isNaN(cardData.num) && cardData.num!='A') {
    if (cardData.suite=='spade' || cardData.suite=='club') {
      color = 'black';
    }
    let num;
    switch (cardData.num) {
      case 'J':
        royal = 'jack';
        num = 11;
        break;
      case 'Q':
        royal = 'queen';
        num = 12;
        break;
      case 'K':
        royal = 'king';
        num = 13;
        break;
    
      default:
        // console.log(cardData.suite);
        break;
    }

    centerContent = `<div class="pip"><img src="img/${royal}_${color}.svg"></div>`;
    cardFace = `
      <article class="card" data-card="${cardData.num}" data-suite="${cardData.suite}" data-value="${num}">
        <div class="identifier top">
          <b class="key">${cardData.num}</b>
          <img class="type" src="img/${cardData.suite}.svg">
        </div>
        <div class="identifier center">
          ${centerContent}
        </div>
        <div class="identifier bottom">
          <b class="key">${cardData.num}</b>
          <img class="type" src="img/${cardData.suite}.svg">
        </div>
      </article>`;
    tempCardVal = num;
  } else {
    let num = 1;
    if (!isNaN(cardData.num)) {
      num = cardData.num;
    }
    for (let i=1; i<=num; i++) {
      centerContent += `<div class="pip"><img src="img/${cardData.suite}.svg"></div>`;
    }
    cardFace = `
      <article class="card" data-card="${cardData.num}" data-suite="${cardData.suite}" data-value="${num}">
        <div class="identifier top">
          <b class="key">${cardData.num}</b>
          <img class="type hidden" src="img/${cardData.suite}.svg">
        </div>
        <div class="identifier center">
          ${centerContent}
        </div>
        <div class="identifier bottom">
          <b class="key">${cardData.num}</b>
          <img class="type hidden" src="img/${cardData.suite}.svg">
        </div>
      </article>`;
    tempCardVal = num;
  }
  return cardFace;
}

// * Alternate Turns
function changeTurns(currentTurn) {
  if (currentTurn == playerTurn) {
    turn = dealerTurn;
  } else {
    turn = playerTurn;
  }
  // console.log(turn);
}

// * Draw A Card
function drawCard() {
  const cardFace = createCardFace(deck[deckPos]);
  deckPos += 1;
  if (turn == 'player') {
    $('#hand').append(cardFace);
  } else {
    $('#dealer').append(cardFace);
  }
  
  sumCards()
}

// * Sum Cards
function sumCards() {
  if (turn == 'player') {
    playerCardTotal += tempCardVal;
    $('.player-count').text(playerCardTotal);
  } else {
    dealerCardTotal += tempCardVal;
    $('.dealer-count').text(dealerCardTotal);
  }
  changeTurns(turn);
}

// * Shuffle Deck
function shuffleDeck() {
  deck = [...cards]
  let currentIndex = deck.length;
  let tempValue;
  let randomIndex;

  while(currentIndex>0) {
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex -=1;
    tempValue = deck[currentIndex];
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = tempValue;
    // console.log(`${deck[currentIndex]} switched with ${deck[randomIndex]}`);
  }
  return deck;
}

function init() {
  createCardArray();

  startBtn.addEventListener('click', () => {
    // Reset game board
    // Shuffle deck
    // Unlock other buttons
    shuffleDeck();
    // console.log(deck);
  });

  drawBtn.addEventListener('click', () => {
    drawCard();
  });
}

document.body.onload = () => {
  init();
}