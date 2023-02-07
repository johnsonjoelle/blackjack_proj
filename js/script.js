/*
  ! TO DO
  1. Shuffle Deck - DONE
  2. Player Actions
    2a. Stand - DONE
    2b. Hit - DONE
    2c. Double Down - DONE
    2d. Split
    2e. Surrender - DONE
  3. Draw Animations
  4. Card Creation - DONE
  5. Success/Fail Animation
  6. Restart - DONE
  7. Wagers - DONE
  8. Fix Ace recognition for Split Deck (see hasNewAce) - DONE? FIX REQUIRES TESTING
      if second hand draws an Ace after splitting deck it is not recognised as an 11
  9. Add Split Results calculations
  10. Add Split Results msg and winnings
  11. Add Split Confirmation - DONE
  12. Add New Wager for Split Hand - DONE
  13. Split Hit
  14. Split Double Down
  15. Split Surrender
  16. Split Stand

  * HOUSE RULES
  Dealer stands on ALL 17s

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
let splitTopTotal = 0;
let splitBtmTotal = 0;
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
let splitWager = 0;
let surrender = false;
let splitSurrender = false;
let split = false;
let secondHand = false;
let switchSplit = true;
let lastSplitRound = false;
let resetCheck = false;

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
  if (split) {
    splitWager = wager;
  } else {
    currentWager = wager;
    setTimeout(() => {
      dealFirstCards();
    }, 400);
  }
  currentFunds = currentFunds - wager;
  $('#wager').hide();
  printWager();
  printFunds();
}
function printWager() {
  $('.current-wager').text(currentWager);
}
function dealPlayerHand() {
  const cardFace = dealCard();
  if (split && secondHand) {
    $('.hand-btm').append(cardFace);
  } else {
    $('.hand-top').append(cardFace);
  }
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
        $('.hole').addClass('show');
        tempCardVal = holeCard;
        sumCards();
        checkResult();
      } else {
        enableButtons();
        checkSplitable();
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

// * Ace Value Functions
function hasNewAce() {
  let aceValue;
  if (turn==playerTurn) {
    if (playerHasAce == true) {
      console.log('Player has Ace, new Ace is 1.');
      return 1;
    } else {
      playerHasAce = true;
      aceValue = checkAceValue(playerCardTotal);
      console.log('Player first Ace, new Ace is ' + aceValue + '.');
      return aceValue;
    }
  } else {
    if (dealerHasAce == true) {
      console.log('Dealer has Ace, new Ace is 1.');
      return 1;
    } else {
      dealerHasAce = true;
      aceValue = checkAceValue(dealerCardTotal);
      console.log('Dealer first Ace, new Ace is ' + aceValue + '.');
      return aceValue;
    }
  }
}

function changeAceValue(currentCardTotal) {
  let newCardTotal = currentCardTotal - 10;
  if (turn == playerTurn) {
    playerAceIsEleven = false;
  } else {
    dealerAceIsEleven = false;
  }
  return newCardTotal;
}

function checkAceValue(currentCardTotal) {
  let elevenTotal = currentCardTotal + 11;
  if (elevenTotal > 21) {
    return 1;
  } else {
    if (turn == dealerTurn) {
      dealerAceIsEleven = true;
    } else {
      playerAceIsEleven = true;
    }
    return 11;
  }
}

// * Double Wager
function checkDouble() {
  if (currentFunds>=10) {
    confirmDouble();
  } else {
    $('.error-msg').text('You must have a minimum of $10 to double your bet.');
    $('#error').show();
  }
}
function confirmDouble() {
  $('#yes').data('type', 'double');
  if (currentFunds>=currentWager) {
    $('.confirm-msg').text('Are you sure you want to double your bet?');
  } else {
    $('.confirm-msg').text('You do not have enough to double your bet. Do you wish to go all in with your remaining funds?');
  }
  $('#confirmation').show();
}
function doubleDown() {
  if (currentFunds>=currentWager) {
    currentFunds = currentFunds - currentWager;
    currentWager = currentWager*2;
  } else {
    currentWager = currentWager + currentFunds;
  }
  printWager();
  printFunds();
  setTimeout(() => {
    dealPlayerHand();
    turn = dealerTurn;
    setTimeout(() => {
      playDealer();
    }, 500);
  }, 500);
}

// * Split Hand
function checkSplitable() {
  let firstCard = $('.hand-top').find('.card').data("value");
  let secondCard = $('.hand-top').find('.card').next().data("value");
  if (firstCard == secondCard && currentFunds >= 10) {
    enableSplit();
  }
}
function confirmSplit() {
  $('#yes').data('type', 'split');
  $('.confirm-msg').text('Split your hand? (Your current hand will be split in two and an additional card will be dealt for each hand.)');
  $('#confirmation').show();
}
function splitDeck() {
  // Adjust layout
  let secondCard = $('.hand-top').find('.card').next();
  // console.log(secondCard);
  $('.hand-top').find('.card').next().remove();
  $('.hand-top').addClass('active');
  $('.hand-btm').addClass('inactive').append(secondCard[0]);
  // Change state
  split = true;
  // Deal new cards and count new totals
  splitTopTotal = $('.hand-top .card').data("value");
  splitBtmTotal = $('.hand-btm .card').data("value");
  if (splitBtmTotal==1) {splitBtmTotal=11};
  playerCardTotal = splitTopTotal;
  dealPlayerHand();
  sumSplitCards();
  setTimeout(() => {
    secondHand = true;
    switchSplit = true;
    dealPlayerHand();
  }, 500);

  $('.wager-text').text('Select a Wager for your Second Hand');
  $('#wager').show();

  // console.log(`1st Total = ${playerCardTotal}, 2nd Total = ${splitBtmTotal}`);
}
function changeToSecondSplit() {
  secondHand = true;
  lastSplitRound = true;
  $('.hand-top').removeClass('active').addClass('inactive');
  $('.hand-btm').addClass('active').removeClass('inactive');
  // let firstCard = $('.hand-btm').find('.card').data("card");
  // let secondCard = $('.hand-btm').find('.card').next().data("card");
  // // Correct value of Ace if the second card in the split hand is Ace
  // if (firstCard!='A' && secondCard=='A') {
  //   splitBtmTotal = splitBtmTotal + 10;
  // }
  playerCardTotal = splitBtmTotal;
  $('.player-count').text(playerCardTotal);
  $('.current-wager').text(splitWager);
  
  enableButtons();
}

// * Sum Cards
function sumCards() {
  if(split==true) {
    sumSplitCards();
  } else {
    if (tempCardVal == 1) {
      tempCardVal = hasNewAce();
    }
    if (turn == 'player') {
      playerCardTotal += tempCardVal;
      if (playerCardTotal>21 && playerAceIsEleven) {
        playerCardTotal = changeAceValue(playerCardTotal); 
      }
      $('.player-count').text(playerCardTotal);
    } else {
      dealerCardTotal += tempCardVal;
      if (dealerCardTotal>21 && dealerAceIsEleven) {
        dealerCardTotal = changeAceValue(dealerCardTotal); 
      }
      $('.dealer-count').text(dealerCardTotal);
    }
  }
}

function sumSplitCards() {
  if (turn == playerTurn) {
    if (!secondHand) {
      if (tempCardVal == 1) {
        tempCardVal = checkAceValue(splitTopTotal);
      }
      splitTopTotal += tempCardVal;
      $('.player-count').text(splitTopTotal);
    } else {
      if (tempCardVal == 1) {
        tempCardVal = checkAceValue(splitBtmTotal);
      }
      splitBtmTotal += tempCardVal;
      $('.player-count').text(splitBtmTotal);
    }
    if (lastSplitRound == false) {
      if (secondHand) {
        secondHand = false;
      }
    }
  } else {
    dealerCardTotal += tempCardVal;
    if (dealerCardTotal>21 && dealerAceIsEleven) {
      dealerCardTotal = changeAceValue(dealerCardTotal); 
    }
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
        if (split) {
          checkSplitResults();
        } else {
          checkResult();
        }
      }
      delay += 500;
    }, delay);
  } else {
    if (split) {
      checkSplitResults();
    } else {
      checkResult();
    }
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
  $("#split-btn").addClass("disabled");
}

// * End of Game Checks and Functions
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
  } else {
    if (playerCardTotal == 21 && dealerCardTotal == 21) {
      result='push';
      endGame();
    } else if (playerCardTotal == 21 && dealerCardTotal !=21) {
      result='blackjack';
      endGame();
    } else if (dealerCardTotal > 21) {
      result='win';
      endGame();
    } else if (playerCardTotal > 21) {
      result='loss';
      endGame();
    } else if (playerCardTotal < 21 && dealerCardTotal == 21) {
      result='loss';
      endGame();
    } else if (dealerCardTotal > 16 && dealerCardTotal < 21  && playerCardTotal < 21) {
      if (playerCardTotal > dealerCardTotal) {
        result='win';
        endGame();
      } else if (dealerCardTotal > playerCardTotal) {
        result='loss';
        endGame();
      } else {
        result='push';
        endGame();
      }
    } else {
      // Unaccounted game state
      result='error';
    }
  }

  setWinnings(result);
  endMsg(result);
}
function setWinnings(result) {
  let earnings = 0;
  if (result=='blackjack') {
    earnings = currentWager * 2.5;
    currentFunds = currentFunds + earnings;
  } else if (result=='win') {
    earnings = currentWager*2;
    currentFunds = currentFunds + earnings;
  } else if (result=='push') {
    earnings = currentWager;
    currentFunds = currentFunds + earnings;
  } else if (result=='surrender') {
    earnings = currentWager/2;
    currentFunds = currentFunds + earnings;
  } else if (result=='loss') {
    console.log('Player lost. No earnings on match.');
  } else {
    // Error
    earnings = currentWager;
    currentFunds = currentFunds + earnings;
  }
  printFunds();
}

function checkSplitResults() {
  disableButtons();
  if (!secondHand) {
    if (splitTopTotal >= 21 || surrender) {
      if (splitTopTotal == 21) {
        $('.first-hand').text('Your first hand is a blackjack!');
        $('.split-winnings').text('Your total winnings will be calculated at the end of the round.');
      } else if (splitTopTotal > 21) {
        $('.first-hand').text('Oh no! Your first hand is a bust!');
        $('.split-winnings').text('Your new funds total will be calcuated at the end of the round.');
      } else {
        $('.first-hand').text('You have surrendered on your first hand!');
        $('.split-winnings').text('Your new funds total will be calcuated at the end of the round.');
      }
      $('#split').show();
    } else {
      changeToSecondSplit();
    }
  } else {
    if (turn == playerTurn) {
      if (splitBtmTotal > 21) {
        $('.second-hand').text('Oh no! Your second hand is a bust!');
        turn = dealerTurn;
        playDealer();
      }
      if (splitBtmTotal == 21) {
        $('.second-hand').text('Your second hand is a blackjack!');
        setSplitWinnings();
      }
      if (surrenderSplit) {
        $('.second-hand').text('You have surrendered on your second hand!');
        setSplitWinnings();
      }
    } else {
      // round is over
      setSplitWinnings();
    }
  }
}

function setSplitWinnings() {
  // All the checks
  let earningsTop = 0;
  let earningsBtm = 0;
  if (splitTopTotal == 21) {
    earningsTop = currentWager * 2.5;
  }
  if (splitBtmTotal == 21) {
    earningsBtm = splitWager * 2.5;
  }
  if (!surrender) {
    if (dealerCardTotal < 21) {
      if (splitTopTotal < 21) {
        if (splitTopTotal > dealerCardTotal) {
          earningsTop = currentWager *2;
          $('.first-hand').text('Your won your bet on your first hand!');
        } else if (splitTopTotal == dealerCardTotal) {
          earningsTop = currentWager;
          $('.first-hand').text('Your first hand is a push!');
        } else {
          $('.first-hand').text('Your lost your bet on your first hand!');
        }
      }
    } else {
      if (dealerCardTotal > 21 && splitTopTotal < 21) {
        earningsTop = currentWager * 2;
        $('.first-hand').text('Your won your bet on your first hand!');
      }
    }
  } else {
    earningsTop = currentWager/2;
  }
  if (!splitSurrender) {
    if (dealerCardTotal < 21) {
      if (splitBtmTotal < 21) {
        if (splitBtmTotal > dealerCardTotal) {
          earningsBtm = splitWager * 2;
          $('.second-hand').text('Your won your bet on your second hand!');
        } else if (splitBtmTotal == dealerCardTotal) {
          earningsBtm = splitWager;
          $('.second-hand').text('Your second hand is a push!')
        } else {
          $('.second-hand').text('Your lost your bet on your second hand!');
        }
      }
    } else {
      if (dealerCardTotal > 21 && splitBtmTotal < 21) {
        earningsBtm = splitWager * 2;
        $('.second-hand').text('Your won your bet on your second hand!');
      }
    }
  } else {
    earningsBtm = splitWager/2;
  }

  let earnings = earningsBtm + earningsTop;
  let totalWager = currentWager + splitWager;
  currentFunds = currentFunds + earnings;
  let winnings = earnings - totalWager;
  if (winnings > 0) {
    $('.split-winnings').text(`You won a total of $${winnings} across both bets!`);
  } else {
    if (winnings == totalWager) {
      $('.split-winnings').text('You broke even across both hands!')
    } else {
      $('.split-winnings').text('Unfortunately, you made a loss across both hands.')
    }
  }
  printFunds();
  $('#split-continue').text('Next Round');
  $('#split').show();
}

function printFunds() {
  $('.funds').text(currentFunds);
}

function endGame() {
  disableButtons();
}

function endMsg(result) {
  let winner;
  let msg;
  if (result=='blackjack') {
    winner = 'Blackjack!';
    msg = `You won 150% on your wager of $${currentWager}. Your wager has been returned in addition to your winnings.`
  } else if (result=='win') {
    winner = 'Congratulations! You won the round!';
    msg = `You won $${currentWager}. Your wager has been returned in addition to your winnings.`
  } else if (result=='push') {
    winner = 'Round is a Push!';
    msg = `You and the dealer have the same total. Your wager has been returned. There is no additional payout.`
  } else if (result=='surrender') {
    winner = 'You Surrendered!';
    msg = `Half of your wager has been returned.`
  } else if (result == 'loss') {
    winner = 'House Wins!';
    msg = `You lost $${currentWager}.`
  } else {
    winner = 'Seems we have encountered a problem';
    msg = `Your wager of $${currentWager} has been returned.`
  }
  $('#winner').text(winner);
  $('#result-msg').text(msg);
  // if (split && secondHand) {
  //   $('.result-btn.new-game-btn').prop('disabled', true);
  //   $('.close-result').text('Go to Second Hand');
  // } else {
  //   $('.result-btn.new-game-btn').prop('disabled', false);
  // }
  $('#results').show();
}

// * Reset Board 
function resetBoard() {
  deckPos = 0;
  playerCardTotal = 0;
  dealerCardTotal = 0;
  dealerCardCount = 0;
  splitTopTotal = 0;
  splitBtmTotal = 0;
  dealerHasAce = false;
  dealerAceIsEleven = false;
  playerHasAce = false;
  playerAceIsEleven = false;
  turn = playerTurn;
  currentWager = 0;
  splitWager = 0;
  surrender = false;
  split = false;
  surrenderSplit = false;
  secondHand = false;
  switchSplit = true;
  lastSplitRound = false;
  resetCheck = false;
  $('.player-count').text(playerCardTotal);
  $('.dealer-count').text(dealerCardTotal);
  $('.hand-top').removeClass('active inactive');
  $('.hand-btm').removeClass('active inactive');
  $('.result-btn.new-game-btn').prop('enabled');
  $('.hand-inner').html('');
  $('#dealer').html('');
  $('.modal').hide();
  $('#split p').text('');
  $('#split-continue').text('Next Hand');
  $('.close-result').text('Close');
}

function init() {
  createCardArray();
  printFunds();

  $(".new-game-btn").click(function() {
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
      if(split && !secondHand) {
        checkSplitResults();
      } else {
        turn = dealerTurn;
        playDealer();
      }
    }
  });

  $('#hit-btn').click(function() {
    if (!$('#hit-btn').hasClass('disabled')) {
      if (!$('#split-btn').hasClass('disabled')) {
        disableSplit();
      }
      dealPlayerHand();
      if (split) {
        checkSplitResults();
      } else {
        let gameState = check21();
        if (gameState=='end') {
          checkResult();
        }
      }
    }
  });

  $('#double-btn').click(function() {
    if (!$("#double-btn").hasClass('disabled')) {
      if (!$('#split-btn').hasClass('disabled')) {
        disableSplit();
      }
      checkDouble();
    }
  });

  $('#split-btn').click(function() {
    if (!$("#split-btn").hasClass('disabled')) {
      confirmSplit();
      disableSplit();
    }
  });

  $(document).on('click', 'body .confirm-btn', function() {
    let val = $(this).data('id');
    let type = $('#yes').data('type');
    if (val == 'yes') {
      if (type =='double') {
        doubleDown();
      }
      if (type=='split') {
        splitDeck();
      }
    }
    $('#confirmation').hide();
  });

  $("#surrender-btn").click(function() {
    if (!$("#surrender-btn").hasClass('disabled')) {
      surrender = true;
      checkResult();
    }
  });

  $(document).on('click', 'body #split-continue', function() {
    if (!secondHand) {
      $('#split').hide();
      changeToSecondSplit();
    } else {
      resetBoard();
      shuffleDeck();
      chooseWager();
    }
  });

  $('.close-result').click(function() {
    $('#results').hide();
  });

  $('.close-error').click(function() {
    $('#error').hide();
  });

}

document.body.onload = () => {
  init();
}