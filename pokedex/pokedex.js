/*
Name: Anthony Chiang
Date: 05/14/2019
Section: CSE 154 AJ

This is the pokedex.js that is linked to the pokedex.html.
*/


(function() {
  "use strict";

  const POKEMON_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";

  let guid;
  let pid;

  let pokemonHP; //stores the hp of the current p1's pokemon

  window.addEventListener("load", main);
  /**
  * main function that is called when the page loads
  */
  function main() {
    populate();
    gamePlay();
  }

  /**
  * starts the battle mode between the pokemons
  */
  function gamePlay(){
    id("start-btn").addEventListener("click", startGame);
  }

  /**
  * sets up battle details of player one and two
  */
  function startGame(){
    qs("header h1").innerText = "Pokemon Battle Mode";
    id("start-btn").classList.add("hidden");
    id("pokedex-view").classList.add("hidden");
    id("p2").classList.remove("hidden");
    qs("#p1 > div > div").classList.remove("hidden");
    id("results-container").classList.remove("hidden");
    qs("#p1 #flee-btn").classList.remove("hidden");
    qs("#p1 > div").classList.remove("hidden");
    qs("#p1 .buffs").classList.remove("hidden");
    qs("#p2 .buffs").classList.remove("hidden");
    let moveBtn = qsa("#p1 .moves button");
    for (let i = 0; i < moveBtn.length; i++){
      moveBtn[i].disabled = false;
      moveBtn[i].addEventListener("click", fight);
    }
    let gameAPI = POKEMON_URL + "game.php";
    let data = new FormData();
    data.append("startgame", "true");
    data.append("mypokemon", qs("#p1 .name").getAttribute("id"));
    fetch(gameAPI, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(showOpponent)
      .catch(handleRequestError);
    qs("#p1 #flee-btn").addEventListener("click", ()=>{
      fetchResult("flee");
    });
  }

  /**
  * displays result of current round
  */
  function fight(){
    let moveName = this.children[0].innerText.replace(/\s+/g, '').toLowerCase();
    fetchResult(moveName);
   }

   /**
   * makes a POST request to API on the current move/action made for p1
   * @param {String} moveName - whether current action is a move or flee
   */
   function fetchResult(moveName){
     id("loading").classList.remove("hidden");
     let gameAPI = POKEMON_URL + "game.php";
     let data = new FormData();
     data.append("guid", guid);
     data.append("pid", pid);
     data.append("movename", moveName);
     fetch(gameAPI, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(displayBattleDetails)
      .catch(handleRequestError);
   }

   /**
   * displays the result of the current round, updates healths
   * @param {object} result -the json data of the result of the current round
   */
   function displayBattleDetails(result){
     id("loading").classList.add("hidden");
     id("p1-turn-results").classList.remove("hidden");
     id("p1-turn-results").innerText = "Player 1 played " + result.results["p1-move"] +
                                        " and " + result.results["p1-result"] + "!";

     id("p2-turn-results").classList.remove("hidden");
     id("p2-turn-results").innerText = "Player 2 played " + result.results["p2-move"] +
                                        " and " + result.results["p2-result"] + "!";
     if ((result.results["p2-move"] === null) || (result.results["p2-result"] === null)){
       id("p2-turn-results").classList.add("hidden");
     }

     //buffs and debuffs
     clearBuff();
     addBuff(result);

     modifyHealth(result);
     checkEndGame(result);
   }

   /** check whether the battle is done
   *  @param {object} result - the json for battle result
   */
   function checkEndGame(result){
     //handles endgame
     let currentHP1 = result.p1["current-hp"];
     let currentHP2 = result.p2["current-hp"];
     if (currentHP1 === 0 || currentHP2 === 0){
       if (currentHP1 === 0){
         qs("header h1").innerText = "You lost!";
       } else{
         qs("header h1").innerText = "You won!";

         //add new pokemon to pokedex and add event listener
         let pokemonName = result.p2.shortname;
         let pokemons = qsa("#pokedex-view img");
         for (let i = 0; i < pokemons.length; i++){
           if (pokemonName === pokemons[i].getAttribute("id")){
             pokemons[i].classList.add("found");
             pokemons[i].addEventListener("click", displayData);
           }
         }
       }
       id("endgame").classList.remove("hidden");
       id("endgame").addEventListener("click", backToDex);
       id("flee-btn").classList.add("hidden");
       let moveBtn = qsa("#p1 .moves button");
       for (let i = 0; i < moveBtn.length; i++){
         moveBtn[i].disabled = true;
       }
     }
   }

   /** modify healthes of p1 and p2 pokemons
   *  @param {object} result - the json for battle result
   */
   function modifyHealth(result){
     let currentHP1 = result.p1["current-hp"];
     let totalHP1 = result.p1.hp;
     qs("#p1 .health-bar").style.width = currentHP1/totalHP1 * 100 + "%";
     if (currentHP1/totalHP1 * 100 < 20){
       qs("#p1 .health-bar").classList.add("low-health");
     }
     qs("#p1 .hp").innerText = parseInt(currentHP1) + "HP";

     let currentHP2 = result.p2["current-hp"];
     let totalHP2 = result.p2.hp;
     qs("#p2 .health-bar").style.width = currentHP2/totalHP2 * 100 + "%";
     if (currentHP2/totalHP2 * 100 < 20){
       qs("#p2 .health-bar").classList.add("low-health");
     }
     qs("#p2 .hp").innerText = parseInt(currentHP2) + "HP";
   }

   /** adds the buff to p1 and p2 pokemons
   *  @param {object} result - the json for battle result
   */
   function addBuff(result){
     let p1Buff = qs("#p1 .buffs");
     for (let i = 0; i < result.p1.buffs.length; i++){
       let div = document.createElement("div");
       div.classList.add(result.p1.buffs[i]);
       div.classList.add("buff");
       p1Buff.appendChild(div);
     }
     for (let i = 0; i < result.p1.debuffs.length; i++){
       let div = document.createElement("div");
       div.classList.add(result.p1.buffs[i]);
       div.classList.add("debuff");
       p1Buff.appendChild(div);
     }

     let p2Buff = qs("#p2 .buffs");
     for (let i = 0; i < result.p2.buffs.length; i++){
       let div = document.createElement("div");
       div.classList.add(result.p2.buffs[i]);
       div.classList.add("buff");
       p2Buff.appendChild(div);
     }
     for (let i = 0; i < result.p2.debuffs.length; i++){
       let div = document.createElement("div");
       div.classList.add(result.p2.buffs[i]);
       div.classList.add("debuff");
       p2Buff.appendChild(div);
     }
   }

   /**
   * deletes all buffs/debuffs of player one and two
   */
   function clearBuff(){
     let p1Buffs = qs("#p1 .buffs");
     while(p1Buffs.firstChild) {
       p1Buffs.removeChild(p1Buffs.firstChild);
     }

     let p2Buffs = qs("#p2 .buffs");
     while(p2Buffs.firstChild) {
       p2Buffs.removeChild(p2Buffs.firstChild);
     }
   }

   /**
   * switches from battle mode back to pokedex mode
   */
   function backToDex(){
     clearBuff();

     id("endgame").classList.add("hidden");
     id("p2").classList.add("hidden");
     id("results-container").classList.add("hidden");
     id("start-btn").classList.remove("hidden");
     qs("header h1").innerText = "Your Pokedex";
     id("pokedex-view").classList.remove("hidden");

     //reset health and health bar
     qs("#p1 .hp").innerText = parseInt(pokemonHP) + "HP";
     qs("#p1 .health-bar").style.width = "100%";
     qs("#p1 .health-bar").classList.remove("low-health");
     qs("#p1 > div > div").classList.add("hidden");

     qs("#p2 .health-bar").style.width = "100%";
     qs("#p2 .health-bar").classList.remove("low-health");

     //hide buff/debuff
     qs("#p1 .buffs").classList.add("hidden");
     qs("#p2 .buffs").classList.add("hidden");
   }

   /**
   * shows player two's card
   * @param {object} state - the json data for player two's pokemon
   */
  function showOpponent(state) {
    guid = state.guid;
    pid = state.pid;
    addData(state.p2, "#p2");
    id("start-btn").classList.add("hidden");
  }

  /**
  * this function populates the pokedex with the pokemons through GET
  */
  function populate(){
    let url = POKEMON_URL + "pokedex.php?pokedex=all";
    fetch(url)
    .then(checkStatus)
    .then(addSprite)
    .catch(handleRequestError);
  }

  /**
  * this function adds the image of the pokemon to the container of the pokedex
  * @param {list} pokemonList - the plain text retrieved from pokemon API
  */
  function addSprite(pokemonList){
    let container = id("pokedex-view");
    let pokemons = pokemonList.split("\n");
    for (let i = 0; i < pokemons.length; i++){
      let shortName = pokemons[i].split(":")[1];
      let image = document.createElement("img");
      image.src = POKEMON_URL + "sprites/" + shortName + ".png";
      image.alt = shortName;
      image.classList.add("sprite");
      image.setAttribute("id", shortName);
      if (shortName === "bulbasaur" || shortName === "charmander" || shortName === "squirtle"){
        image.classList.add("found");
        image.addEventListener("click", displayData);
      }
      container.appendChild(image);
    }
  }

  /**
  * this function gets the data for the individual pokemon through GET
  */
  function displayData(){
    let url = POKEMON_URL + "pokedex.php?pokemon=" + this.getAttribute("id");
    fetch(url)
    .then(checkStatus)
    .then(JSON.parse)
    .then(function(pokeJson){
      addData(pokeJson, "#p1");
    })
    .catch(handleRequestError);

    id("start-btn").classList.remove("hidden");
  }

  /**
  * this function displays all the details about the pokemon on the card
  * @param {JSON} pokeJson - the json file associated with the pokemon
  * @param {string} player - either "#p1" or "#p2", representing the player
  */
  function addData(pokeJson, player){
    qs(player + " .name").innerText = pokeJson.name;
    qs(player + " .name").setAttribute("id", pokeJson.shortname);
    qs(player + " .pokepic").src = POKEMON_URL + pokeJson["images"].photo;
    qs(player + " .pokepic").alt = pokeJson.name + " photo";
    qs(player + " .type").src = POKEMON_URL + pokeJson["images"].typeIcon;
    qs(player + " .type").alt = pokeJson.name + " type";
    qs(player + " .weakness").src = POKEMON_URL + pokeJson["images"].weaknessIcon;
    qs(player + " .weakness").alt = pokeJson.name + " weakness";
    if (player === "#p1"){
      pokemonHP = pokeJson.hp;
    }
    qs(player + " .hp").innerText = pokeJson.hp + "HP";
    qs(player + " .info").innerText = pokeJson["info"].description;
    let moveNames = qsa(player + " .moves .move");
    let moveType = qsa(player + " .moves img");
    let moveDp = qsa(player + " .moves .dp");
    for (let i = 0; i < pokeJson.moves.length; i++){
      qsa(player + " .moves button")[i].classList.remove("hidden");
      moveNames[i].innerText = pokeJson.moves[i].name;
      moveType[i].src = POKEMON_URL + "icons/" + pokeJson.moves[i].type + ".jpg";
      moveType[i].alt = pokeJson.moves[i].type;
      if ("dp" in pokeJson.moves[i]){
        moveDp[i].innerText = pokeJson.moves[i].dp + " DP";
      }else{
        moveDp[i].innerText = "";
      }
    }
    for (let i = 0; i < 4 - pokeJson.moves.length; i++){
      qsa(player + " .moves button")[3 - i].classList.add("hidden");
    }
  }



  /**
   * This function is called when an error occurs in the fetch call chain (e.g. the request
   * returns a non-200 error code. Displays a user-friendly
   * error message
   * @param {Error} err - the err details of the request.
   */
  function handleRequestError(err) {
    console.log("There was an error requesting data from the Pokemon API. Please try again later.");
    console.log(err);
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
  * shorthand method
  * @param {string} query the query string
    @return {element} return the element
  */
  function qs(query){
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query){
    return document.querySelectorAll(query);
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
   function checkStatus(response) {
     if (response.status >= 200 && response.status < 300 || response.status === 0) {
       return response.text();
     } else {
       return Promise.reject(new Error(response.status + ": " + response.statusText));
     }
   }

})();
