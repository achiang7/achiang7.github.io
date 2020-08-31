
/**
Name: Anthony Chiang
Date : 04/23/2019
Section: CSE 154 AJ

This is the javscript file corresponding to my set.html.
*/

(function() {
  "use strict";

  //global array
  const STYLE = ["outline", "solid", "striped"];
  const SHAPE = ["oval", "diamond", "squiggle"];
  const COLOR = ["red", "green", "purple"];

  let timer = null;
  let chosenCards = []; // the 12 or 9 cards being displayed
  let cardsSelected = []; // cards player click on


  window.addEventListener("load", main);
  /**
  * main function that is called when the page loads
  */
  function main() {
    let startButton = document.getElementById("start");
    startButton.addEventListener("click", changeView);
  }

  /**
  * switch from menuview to gameview
  * begins the game play
  * starts the timer
  */
  function changeView(){
    let menuView = document.getElementById("menu-view");
    menuView.classList.add("hidden");
    let gameView = document.getElementById("game-view");
    gameView.classList.remove("hidden");

    setTimer();
    newBoard();

    let refreshButton = document.getElementById("refresh");
    refreshButton.addEventListener("click", refresh);

    let backMainButton = document.getElementById("main-btn");
    backMainButton.addEventListener("click", function() {
      menuView.classList.remove("hidden");
      gameView.classList.add("hidden");
    });
  }

  /**
  * creates a new board with all the cards refreshed
  */
  function newBoard(){
    generateRandomCards();
    let cards = document.getElementsByClassName("card");
    let done = false;
    for (let i = 0; i < cards.length; i++){
      cards[i].addEventListener("click", function() {
        let timeDisp = id("time");
        let time = timeDisp.textContent.split(":");
        let min = parseInt(time[0]);
        let sec = parseInt(time[1]);
        if (min === 0 && sec === 0){
          done = true;
        }
        if (done){
          //do nothing
        }else {
          //check whether it is already selected
          if (cardsSelected.includes(cards[i])){
            cards[i].classList.remove("cardShadow");
            //remove item from the array
            cardsSelected.splice(cardsSelected.indexOf(cards[i]), 1);
          } else if (cardsSelected.length < 3){
            cards[i].classList.add("cardShadow");
            cardsSelected.push(cards[i]);
          }
          if(cardsSelected.length === 3){
            react(checkSet());
            // disselect all the cards
            for (let i = cardsSelected.length - 1; i >= 0; i--){
              cardsSelected[i].classList.remove("cardShadow");
              cardsSelected.splice(i, 1);
            }
          }
        }
      });
    }
  }

  /**
  * called when user clicks on 3 cards
  * decide whether a set is found
  * @param {boolean} isSet whther the 3 cards make a set
  */
  function react(isSet){
    if(isSet){
      id("set-count").textContent = parseInt(id("set-count").textContent) + 1;
    }
    for (let i = 0; i < cardsSelected.length; i++){
      //removeChild - remove the img from the card
      let card = cardsSelected[i];
      if (isSet){
        card.innerText = "SET!";
      }else{
        card.innerText = "Not a Set :(";
      }
      setTimeout(function (){
        let imgStyle = card.getAttribute("id");
        if (isSet){
          //remove sleected img style from chosenCards
          //by getting the img-style from using getAttribute
          //generate new card img and add that image to card
          card.innerText = "";

          let index = chosenCards.indexOf(imgStyle);
          chosenCards.splice(index, 1);
          let newImg = generateRandomImg(document.getElementsByName("diff")[0].checked);
          let count = newImg[2];
          for (let j = 0; j < count; j++){
            let img = document.createElement("img");
            img.src = "img/" + newImg[0] + ".png";
            img.alt = newImg[0];
            card.appendChild(img);
          }
          card.setAttribute("id", newImg[0] + "-" + count);
        } else {
          let src = imgStyle.substring(0, imgStyle.length-2);
          let count = parseInt(imgStyle.substring(imgStyle.length-1));
          card.innerText = "";

          for (let j = 0; j < count; j++){
            let img = document.createElement("img");
            img.src = "img/" + src + ".png";
            img.alt = src;
            card.appendChild(img);
          }
        }

      }, 1000);
    }
    if (qs("article > select").value !== "none"){ //check that it's timed
      let timeDisp = id("time");
      let time = timeDisp.textContent.split(":");
      let min = parseInt(time[0]);
      let sec = parseInt(time[1]);

      if (isSet){
        //add 15 sec to timer
        if (sec + 15 < 60){
          sec += 15;
        }else{
          sec = sec + 15 - 60;
          min++;
        }
      }else {
        if (sec - 15 > 0){
          sec -= 15;
        }else{
          sec = 60 - (15 - sec);
          min--;
        }
      }

      timeDisp.textContent = min.toString().padStart(2, 0) + ":" + sec.toString().padStart(2, 0);
    }
  }

  /**
  * check whether the 3 selected cards form a set
  * @return {boolean} returns whether the it is a set
  */
  function checkSet(){
    let set = true;
    let style = [];
    let shape = [];
    let color = [];
    let count = [];
    for (let i = 0; i < cardsSelected.length; i++){
      let card = cardsSelected[i];
      let imgStyle = card.getAttribute("id");
      let styleArray = imgStyle.split("-");
      style.push(styleArray[0]);
      shape.push(styleArray[1]);
      color.push(styleArray[2]);
      count.push(styleArray[3]);
    }
    //check whether each attribute is all the same or all different
    for (let i = 0; i < 3; i++){
      //style
      if (!(style[0] === style[1] && style[1] === style[2])){
        //check whether they are all different
        if ((style[0] !== style[1] && style[1] === style[2]) ||
            (style[0] === style[1] && style[1] !== style[2]) ||
            (style[0] === style[2] && style[1] !== style[2])    ){
            set = false;
        }
      }
      //shape
      if (!(shape[0] === shape[1] && shape[1] === shape[2])){
        //check whether they are all different
        if ((shape[0] !== shape[1] && shape[1] === shape[2]) ||
            (shape[0] === shape[1] && shape[1] !== shape[2]) ||
            (shape[0] === shape[2] && shape[1] !== shape[2])    ){
            set = false;
        }
      }
      //color
      if (!(color[0] === color[1] && color[1] === color[2])){
        //check whether they are all different
        if ((color[0] !== color[1] && color[1] === color[2]) ||
            (color[0] === color[1] && color[1] !== color[2]) ||
            (color[0] === color[2] && color[1] !== color[2])    ){
            set = false;
        }
      }
      //count
      if (!(count[0] === count[1] && count[1] === count[2])){
        //check whether they are all different
        if ((count[0] !== count[1] && count[1] === count[2]) ||
            (count[0] === count[1] && count[1] !== count[2]) ||
            (count[0] === count[2] && count[1] !== count[2])    ){
            set = false;
        }
      }
    }
    return set;
  }

  /**
  * sets timer countdown
  */
  function setTimer(){
    id("set-count").textContent = "0";
    let dropMenu = qs("#menu-view select");
    let time = dropMenu.value;
    if (time === "none"){
      id("time").textContent = "00:00";
    } else {
      id("time").textContent = (time/60).toString().padStart(2, 0) + ":00";
      if (!timer){
        timer = setInterval(callTimer, 1000);
      }
    }
  }

  /**
  * function that gets called every second during game play
  */
  function callTimer(){
    let chosenTime = qs("article > select").value;
    let timeDisp = id("time");
    let time = timeDisp.textContent.split(":");
    let min = parseInt(time[0]);
    let sec = parseInt(time[1]);

    if(chosenTime === "none"){
      if (sec === 59) {
        min++;
        sec = 0;
      } else{
        sec++;
      }
    } else{
      if (sec === 0){
        if (min === 0){
          clearInterval(timer);
          timer = null;
          disableFunctions();
        } else {
          min--;
          sec = 59;
        }
      } else{
        sec--;
      }
    }
    timeDisp.textContent = min.toString().padStart(2, 0) + ":" + sec.toString().padStart(2, 0);
  }

  /**
  * called when time expires. disables game play
  */
  function disableFunctions(){
    let refreshButton = document.getElementById("refresh");
    refreshButton.removeEventListener("click", refresh);

    for (let i = 0; i < cardsSelected.length; i++){
      cardsSelected[i].classList.remove("cardShadow");
    }
  }

  /**
  * refreshes the game board
  * displays new cards
  */
  function refresh(){
    chosenCards = [];
    cardsSelected = [];
    newBoard();
  }

  /**
  * clears existing board
  */
  function clearBoard(){
    let board = document.getElementById("game");
    while (board.firstChild){
      board.removeChild(board.firstChild);
    }
  }

  /**
  * generates new cards at random
  */
  function generateRandomCards(){
    clearBoard();
    let isEasy = document.getElementsByName("diff")[0].checked;
    let count = 9;
    if (!isEasy) {
      count = 12;
    }
    for (let i = 0; i < count; i++){
      let img = generateRandomImg(isEasy);
      displayCards(img[0], img[1], img[2]);
    }
  }

  /**
  generates card image based on difficuty
  * @param {boolean} isEasy the difficulty of the game
  * @return {array} return the img source, img alt, and the count in an array
  */
  function generateRandomImg(isEasy){
    let style = "solid";
    if (!isEasy){
      style = STYLE[getRandomInt(3)];
    }
    let imgSrc = style + "-" +
                 SHAPE[getRandomInt(3)] + "-" + COLOR[getRandomInt(3)];
    let count = getRandomInt(3) + 1;
    while (chosenCards.includes(imgSrc + "-" + count)){
      if (!isEasy){
        style = STYLE[getRandomInt(3)];
      } else {
        style = "solid";
      }
      imgSrc = style + "-" +
               SHAPE[getRandomInt(3)] + "-" + COLOR[getRandomInt(3)];
      count = getRandomInt(3) + 1;
    }
    chosenCards.push(imgSrc + "-" + count);
    return [imgSrc, imgSrc, count];
  }

  /**
  displays a card on the board
  * @param {string} imgSrc src of the img
  * @param {string} imgAlt alt of the img
  * @param {int} count number of time the img should be repeated
  */
  function displayCards(imgSrc, imgAlt, count){
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.setAttribute("id", imgSrc + "-" + count);
    for (let i = 0; i < count; i++){
      let card = document.createElement("img");
      card.src = "img/" + imgSrc + ".png";
      card.alt = imgAlt;
      cardDiv.appendChild(card);
    }
    document.getElementById("game").appendChild(cardDiv);
  }

  /**
  *
  * @param {int} max - genereates a random integer from 0 to max
                     - not including max
  * @return {int}- a random integer from 0 to max
            - not including max
  */
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  /** shorthand method
  * @param {string} name name of id of the element
    @return {element} returns the element
  */
  function id(name){
    return document.getElementById(name);
  }


  /**
  * shorthand method
  * @param {string} query the query string
    @return {element} return the element
  */
  function qs(query){
    return document.querySelector(query);
  }

})();
