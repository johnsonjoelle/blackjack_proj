/*
  ! TO DO
  1. Shuffle Deck - DONE
  2. Player Actions
    2a. Stand - DONE
    2b. Hit - DONE
    2c. Double Down
    2d. Split
    2e. Surrender - DONE
  3. Draw Animations
  4. Card Creation - DONE
  5. Success/Fail Animation
  6. Restart
  7. Wagers?

  * HOUSE RULES
  Dealers stands on ALL 17s

  * Blackjack Game Rules from 
  @https://www.blackjackapprenticeship.com/how-to-play-blackjack/
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
let dealerCardCount = 0;
const cardLimit = 21;
const playerTurn = 'player';
const dealerTurn = 'dealer';
let dealerHasAce = false;
let dealerAceIsEleven = false;
let playerHasAce = false;
let playerAceIsEleven = false;
let turn = playerTurn;
let tempCardVal;
let holeCard;
const startingFunds = 300;
let currentFunds = startingFunds;
let currentWager = 0;
let surrender = false;

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
    if (turn == dealerTurn && dealerCardCount == 2) {
      cardFace = `
        <article class="card hole" data-card="${cardData.num}" data-suite="${cardData.suite}" data-value="${num}">
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
          <div class="card-back">
            <img src="img/card-back.svg">
          </div>
        </article>`;
      }
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
    if (turn == dealerTurn && dealerCardCount == 2) {
      cardFace = `
        <article class="card hole" data-card="${cardData.num}" data-suite="${cardData.suite}" data-value="${num}">
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
          <div class="card-back">
            <img src="img/card-back.svg">
          </div>
        </article>`;
      }
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
function dealCard() {
  const cardFace = createCardFace(deck[deckPos]);
  deckPos += 1;
  return cardFace;
}

// * Start Game Functions
function checkFunds() {
  if (currentFunds<100) {
    $(".wagers").children('[data-id="100"]').addClass('disabled');
  }
  if (currentFunds<50) {
    $(".wagers").children('[data-id="50"]').addClass('disabled');
  }
  if (currentFunds<20) {
    $(".wagers").children('[data-id="20"]').addClass('disabled');
  }
  if (currentFunds<10) {
    $(".wager-btn").hide();
    $('.wager-text').text('Sorry, but you do not have enough funds to keep playing. To start over, please refresh the page.');
  }
}
function chooseWager() {
  checkFunds();
  $('#wager').show();
}
function setWager(wager) {
  currentWager = wager;
  currentFunds = currentFunds - currentWager;
  $('#wager').hide();
  setTimeout(() => {
    dealFirstCards();
  }, 400);
  printWager();
  printFunds();
}
function printWager() {
  $('.current-wager').text(currentWager);
}
function dealPlayerHand() {
  const cardFace = dealCard();
  $('#hand').append(cardFace);
  sumCards();
}
function dealDealerHand() {
  dealerCardCount += 1;
  const cardFace = dealCard();
  $('#dealer').append(cardFace);
}
function dealFirstCards() {
  dealPlayerHand();
  setTimeout(() => {
    dealPlayerHand();
  }, 500);
  setTimeout(() => {
    turn = dealerTurn;
    dealDealerHand();
    sumCards();
    setTimeout(() => {
      dealDealerHand();
      if (tempCardVal == 1) {
        tempCardVal = hasNewAce();
      }
      holeCard = tempCardVal; // store value of hole card
      let checkPlayer21 = check21();
      if (checkPlayer21 == 'end') {
        checkResult();
      } else {
        enableButtons();
        turn = playerTurn;
      }
    }, 500);
  }, 1000);
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

// * Double Wager
function confirmDouble() {
  if (currentFunds>=currentWager) {
    $('.confirm-msg').text('Are you sure you want to double your bet?');
  } else {
    $('.confirm-msg').text('You do not have enough to double your bet. Do you wish to go all in with your remaining funds?');
  }
  $('#confirmation').show();
}
function doubleDown(confirm) {
  if (confirm=='yes') {
    if (currentFunds>=currentWager) {
      currentWager = currentWager*2;
    } else {
      currentWager = currentWager + currentFunds;
    }
    printWager();
    setTimeout(() => {
      dealPlayerHand();
      turn = dealerTurn;
      setTimeout(() => {
        playDealer();
      }, 500);
    }, 500);
  }
  $('#confirmation').hide();
}

// * Sum Cards
function sumCards() {
  if (tempCardVal == 1) {
    tempCardVal = hasNewAce();
  }
  if (turn == 'player') {
    playerCardTotal += tempCardVal;
    $('.player-count').text(playerCardTotal);
  } else {
    dealerCardTotal += tempCardVal;
    $('.dealer-count').text(dealerCardTotal);
  }
}

// * Dealer's Turn
function playDealer() {
  $('.hole').addClass('show');
  tempCardVal = holeCard;
  sumCards();
  if (dealerCardTotal < 17) {
    let delay = 500;
    let cardTiming = setInterval(() => {
      dealDealerHand();
      sumCards();
      if (dealerCardTotal > 16) {
        clearInterval(cardTiming);
        checkResult();
      }
      delay += 500;
    }, delay);
    // while (dealerCardTotal < 17) {
    //   dealDealerHand();
    //   sumCards();
    //   if (dealerCardTotal > 16) {
    //     checkResult();
    //   }
    // }
  } else {
    checkResult();
  }
}

// * Set Winnings
function setWinnings(result) {
  let earnings = 0;
  if (result=='win') {
    earnings = currentWager*2;
    currentFunds = currentFunds + earnings;
  } else if (result=='push') {
    earnings = currentWager;
    currentFunds = currentFunds + earnings;
  } else if (result=='surrender') {
    earnings = currentWager/2;
    currentFunds = currentFunds + earnings;
  } else {
    console.log('Player lost. No earnings on match.');
  }
  printFunds();
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

// * Enable Buttons
function enableButtons () {
  $("#stand-btn").removeClass("disabled");
  $("#hit-btn").removeClass("disabled");
  if (currentFunds>0) {
    $("#double-btn").removeClass("disabled");
  }
  $("#surrender-btn").removeClass("disabled");
}
function enableSplit () {
  $("#split-btn").removeClass("disabled");
}
// * Disable Buttons
function disableButtons () {
  $("#stand-btn").addClass("disabled");
  $("#hit-btn").addClass("disabled");
  $("#double-btn").addClass("disabled");
  $("#split-btn").addClass("disabled");
  $("#surrender-btn").addClass("disabled");
}
function disableSplit () {
  $("#split-btn").prop("disabled", true);
}
// * Reset Board 
function resetBoard() {
  deckPos = 0;
  playerCardTotal = 0;
  dealerCardTotal = 0;
  dealerCardCount = 0;
  dealerHasAce = false;
  dealerAceIsEleven = false;
  playerHasAce = false;
  playerAceIsEleven = false;
  turn = playerTurn;
  currentWager = 0;
  surrender = false;
  $('.player-count').text(playerCardTotal);
  $('.dealer-count').text(dealerCardTotal);
  $('#hand').html('');
  $('#dealer').html('');
  // ! Add a check to see if the player is out of funds
}

// * End of Game Checks and Functions
// function checkEndGame(state) {
//   if (turn=='player') {
//     if (state=='win') {
//       console.log('You win!');
//       endGame();
//     } else {
//       // check if player has Ace that is counted as 11
//       if (playerHasAce == true && playerAceIsEleven == true) {
//         playerCardTotal = changeAceValue(playerCardTotal);
//         console.log('Ace value changed to 1 for player.');
//         changeTurns(turn);
//       } else {
//         console.log('You lose!');
//         endGame();
//       }
//     }
//   } else {
//     if (state=='win') {
//       console.log('You lose!');
//       endGame();
//     } else {
//       // check if dealer has Ace
//       if (dealerHasAce == true && dealerAceIsEleven == true) {
//         dealerCardTotal = changeAceValue(dealerCardTotal);
//         console.log('Ace value changed to 1 for dealer.');
//         changeTurns(turn);
//     check21  } else {
//         console.log('You win!');
//         endGame();
//       }
//     }
//   }
// }
function check21() {
  if (playerCardTotal >= 21) {
    return 'end';
  } else {
    return 'continue';
  }
}
function checkResult() {
  let result;
  
  if (surrender == true) {
    result='surrender';
    console.log('Player surrenders. House wins!');
  } else {
    if (playerCardTotal == 21 || dealerCardTotal > 21) {
      console.log('Player Wins!');
      result='win';
      endGame();
    } else if (playerCardTotal > 21 || dealerCardTotal == 21) {
      console.log('House wins!');
      result='loss';
      endGame();
    } else if (dealerCardTotal > 16 && dealerCardTotal < 21  && playerCardTotal < 21) {
      if (playerCardTotal > dealerCardTotal) {
        console.log('Player Wins!');
        result='win';
        endGame();
      } else if (dealerCardTotal > playerCardTotal) {
        console.log('House Wins!')
        result='loss';
        endGame();
      } else {
        console.log('Push. End of Round.');
        result='push';
        endGame();
      }
    } else {
      console.log('Unaccounted state');
    }
  }
  setWinnings(result);
}

function printFunds() {
  $('.funds').text(currentFunds);
}

function endGame() {
  disableButtons();
}

function init() {
  createCardArray();
  printFunds();

  $("#new-game-btn").click(function() {
    // clear deck & totals
    resetBoard();
    shuffleDeck();
    chooseWager();
  });

  $(document).on('click', 'body .wager-btn', function() {
    let val = $(this).data('id');
    setWager(val);
  });

  $("#stand-btn").click(function() {
    if (!$("#stand-btn").hasClass('disabled')) {
      disableButtons();
      turn = dealerTurn;
      // Deal cards if total = 17 or higher
      playDealer();
    }
  });

  $('#hit-btn').click(function() {
    if (!$('#hit-btn').hasClass('disabled')) {
      dealPlayerHand();
      let gameState = check21();
      if (gameState=='end') {
        checkResult();
      }
    }
  });

  $('#double-btn').click(function() {
    if (!$("#double-btn").hasClass('disabled')) {
      confirmDouble();
    }
  });

  $(document).on('click', 'body .confirm-btn', function() {
    let val = $(this).data('id');
    doubleDown(val);
  });

  $("#surrender-btn").click(function() {
    if (!$("#surrender-btn").hasClass('disabled')) {
      surrender = true;
      checkResult();
    }
  });

  // startBtn.addEventListener('click', () => {
  //   // Reset game board
  //   // Shuffle deck
  //   // Unlock other buttons
  //   shuffleDeck();
  //   // console.log(deck);
  // });

  // drawBtn.addEventListener('click', () => {
  //   drawCard();
  // });
}

document.body.onload = () => {
  init();
}