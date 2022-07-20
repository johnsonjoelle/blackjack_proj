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
let dealerHasAce = false;
let dealerAceIsEleven = false;
let playerHasAce = false;
let playerAceIsEleven = false;
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
  let num;
  if (isNaN(cardData.num) && cardData.num!='A') {
    num = 10;
    if (cardData.suite=='spade' || cardData.suite=='club') {
      color = 'black';
    }
    switch (cardData.num) {
      case 'J':
        royal = 'jack';
        break;
      case 'Q':
        royal = 'queen';
        break;
      case 'K':
        royal = 'king';
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
  } else {
    num = 1;
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
  }
  tempCardVal = num;
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

// * Check Total
function checkTotal(total) {
  if (total>21) {
    return 'lose';
  } else if (total<21) {
    return 'continue';
  } else {
    return 'win'
  }
}

function hasNewAce() {
  let aceValue;
  if (turn=='player') {
    if (playerHasAce == true) {
      return 1;
    } else {
      playerHasAce = true;
      aceValue = checkAceValue(playerCardTotal);
      return aceValue;
    }
  } else {
    if (dealerHasAce == true) {
      return 1;
    } else {
      dealerHasAce = true;
      aceValue = checkAceValue(dealerCardTotal);
      return aceValue;
    }
  }
}

function changeAceValue(currentCardTotal) {
  let newCardTotal = currentCardTotal - 10;
  return newCardTotal;
}

function checkAceValue(currentCardTotal) {
  let elevenTotal = currentCardTotal + 11;
  if (elevenTotal > 21) {
    return 1;
  } else {
    return 11;
  }
}

// * Sum Cards
function sumCards() {
  let gameState;
  if (tempCardVal == 1) {
    tempCardVal = hasNewAce();
  }
  if (turn == 'player') {
    playerCardTotal += tempCardVal;
    $('.player-count').text(playerCardTotal);
    gameState = checkTotal(playerCardTotal);
  } else {
    dealerCardTotal += tempCardVal;
    $('.dealer-count').text(dealerCardTotal);
    gameState = checkTotal(dealerCardTotal);
  }

  if (gameState == 'continue') {
    changeTurns(turn);
  } else {
    checkEndGame(gameState);
  }
}

// * Shuffle Deck
function shuffleDeck() {
  deck = [...cards];
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

function checkEndGame(state) {
  if (turn=='player') {
    if (state=='win') {
      console.log('You win!');
      endGame();
    } else {
      // check if player has Ace that is counted as 11
      if (playerHasAce == true && playerAceIsEleven == true) {
        playerCardTotal = changeAceValue(playerCardTotal);
        console.log('Ace value changed to 1 for player.');
        changeTurns(turn);
      } else {
        console.log('You lose!');
        endGame();
      }
    }
  } else {
    if (state=='win') {
      console.log('You lose!');
      endGame();
    } else {
      // check if dealer has Ace
      if (dealerHasAce == true && dealerAceIsEleven == true) {
        dealerCardTotal = changeAceValue(dealerCardTotal);
        console.log('Ace value changed to 1 for dealer.');
        changeTurns(turn);
      } else {
        console.log('You win!');
        endGame();
      }
    }
  }
}

function endGame() {
  $('#draw-btn').prop('disabled', true);
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