const HWIRE = document.getElementById('hwire');
const GAME = document.getElementById('game');
const AUDIO = document.getElementById('hsaudio');
const SB = document.getElementById('scoreboard');
const HFILL = document.getElementById('hfill');
const AST = document.getElementsByClassName('ast');
const GAME_WIDTH = $('#game').width();
const GAME_HEIGHT = $('#game').height();
const START = document.getElementById('start');
const ABOUT = document.getElementById('about');
const ENDGAME = document.getElementById('endgame');
var OBJECTTYPE = [];
const FUELTANK = [];
var bombs = document.getElementById('bombs');
var counter = -1;
var cdown = 6;
var cursor = 0;
var KC = [72, 79, 84, 87, 73, 82, 69];
var gameInterval = null;
var countInterval = null;
var fuelTankInterval = null;
var ghostInterval = null;
var hBombInterval = null;
var displayEndInterval = null;
var ghost = null;
var bomb = null;
var fuel = 100;
var astint = 1500;
var id = null;
var endgame = null;

function checkImpact(obj){
	var left = positionToInteger(obj.style.right) + 35;
	if (left < GAME.clientWidth - 160 || left > GAME.clientWidth - 86){
		return false;
	}
	else if (obj.className === 'ast2'){
		return false;
	}
	else if (left > GAME.clientWidth - 160 || left > GAME.clientWidth - 85) {
		const hwTop = positionToInteger(HWIRE.style.top);
		const hwBottom = hwTop + 75;
		const objTop = positionToInteger(obj.style.top);
		const objBottom = objTop + 35;
		if (objTop < hwTop && objBottom > hwTop ||
		  objTop >= hwTop && objBottom <= hwBottom ||
		  objTop < hwBottom && objBottom > hwBottom){
			if (obj.className === 'fueltank'){
				fuel = 99;
				obj.remove();
			}
			else if (obj.className === 'ghost') {
				ghost = true;
				HWIRE.style.opacity = .5;
				obj.remove();
				setTimeout(hwGhost, 10000);
			}
			else if (obj.className === 'bomb') {
				obj.remove();
				bombs.innerHTML = "R-Fill: " + 1;
				bomb = true;
				clearInterval(hBombInterval)
			}
			else if (ghost === true){
				return false;
			}
			else {
				if (endgame != true) {
					return true;
				}
			}
		}
	}
}

function createFlyingObj(objectType, objectTop, objectRight = 0, velocity = 2){
  const obj = document.createElement('div');
  obj.className = `${objectType}`;
  obj.style.top = `${objectTop}px`;
  var right = objectRight;
  obj.style.right = right;
  GAME.appendChild(obj);
  function moveObj(){
	obj.style.right = `${right += velocity}px`;
    if (checkImpact(obj)){
      $('#hwire').animate({left: '-=200'}, 1000);
      endGame();
    }
    if(right > 0 && right <= GAME.clientWidth){
      window.requestAnimationFrame(moveObj);
    }
    else{
      obj.remove();
    }
  }
  window.requestAnimationFrame(moveObj);
  OBJECTTYPE.push(obj);
  return obj;
}

function moveHwUp(){
  ABOUT.style.display = 'none';
  if (fuel < 11 ) {
	  document.getElementById('fuel').style.color = 'red';
  }
  if (fuel > 1) {
	  fuel -= .05;
	  var hwTop = HWIRE.style.top.replace('px', '');
	  var hwt = parseInt(hwTop, 10);
	  if (hwt > 0) {
		$('#hwire').animate({top: '-=5'}, 0);
		id = requestAnimationFrame(moveHwUp);
	  }
	  else if (hwt = 10 && ghost === true) {
		$('#hwire').animate({top: '+444'}, 0);
		id = requestAnimationFrame(moveHwUp);
	  }
	  else if (hwt = 10 && ghost != true) {
		endGame();
	  }
  }
  else {
	  moveHwDown();
  }
}

function moveHwDown(){
  var hwTop = HWIRE.style.top.replace('px', '');
  var hwt = parseInt(hwTop, 10);
  $('#hwire').animate({top: '+=3'}, 0);
  id = requestAnimationFrame(moveHwDown);
  if (hwt >= 435 && ghost != true) {
	endGame();
  }
  else if (hwt > 435 && ghost === true) {
  	$('#hwire').animate({top: '-25'}, 0);
  }
}
	
function moveShip(){
  start();
  GAME.removeEventListener('mousedown', takeoff);
  GAME.removeEventListener('touchstart', takeoff);
  window.addEventListener('keydown', hFill);
  window.addEventListener('touchstart', hFill);
  window.addEventListener('mouseup', thrustoff);
  window.addEventListener('mousedown', thrust);
  window.addEventListener('touchstart', thrust);
  window.addEventListener('touchend', thrustoff);
  id = requestAnimationFrame(moveHwUp);
}
 
function thrust(e){
  e.preventDefault();
  e.stopPropagation();
  cancelAnimationFrame(id);
  if (e.type === 'touchstart' || e.type === 'mousedown') {
    moveHwUp();
  }
  else {
	moveHwDown();
  }
}

function thrustoff(e){
	cancelAnimationFrame(id);
	e.preventDefault();
	e.stopPropagation();
	moveHwDown();
}

function takeoff(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'mousedown' || e.targetTouches.length > 1){
	moveShip();
	$('#hwire').animate({top: '-=5'}, 0);
  }
}

function hFill(e) {
	e.preventDefault();
    e.stopPropagation();
	if (bomb === true && (e.which === 66 || e.targetTouches.length > 1)) {
		bomb = false;
		HFILL.style.opacity = 1;
		HFILL.style.zIndex = 1;
		bombs.innerHTML = "R-Fill: " + 0;
		hBomber();
		sethBombInterval();
		for (var x = 0; x < OBJECTTYPE.length; x++){
			if (OBJECTTYPE[x].className === 'ast'){
				OBJECTTYPE[x].className = 'ast2';
				OBJECTTYPE[x].remove();
			}
		}
	}
}

function hBomber() {
  HFILL.style.opacity -= .1;
  HFILL.style.opacity === .1 ? HFILL.style.opacity = 0 : setTimeout(hBomber, 250);
}

function displayScore() {
	var times = document.getElementById('count');
	counter++;
	times.innerHTML = "Occupancy: " + counter;
}

function displayFuel(){
	var fuels = document.getElementById('fuel');
    fuels.innerHTML = "RevPAR: " + parseInt(fuel);
}

function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function display() {
	ENDGAME.style.zIndex = 0;
	if(cdown >=1){
		cdown--;
	}
	ENDGAME.innerHTML = "Game Over!!! " + "<br />" + "Occupancy: " + counter + "<br />" + "New Game in... " + cdown;
}

function endGame(){
  endgame = true;
  window.removeEventListener('mousedown', thrust);
  window.removeEventListener('mouseup', thrustoff);
  window.removeEventListener('touchstart', thrust);
  window.removeEventListener('touchend', thrustoff);
  cancelAnimationFrame(id);
  clearInterval(gameInterval);
  clearInterval(asteroidInterval);
  clearInterval(ghostInterval);
  clearInterval(hBombInterval);
  clearInterval(scoreInterval);
  clearInterval(fuelInterval);
  display();
  setInterval(display, 1000);
  setTimeout(reload, 5000);
}


function reload() {
  window.location.reload(true);
}

function setAsteroidInterval(velocity = 2) {
	if (astint > 50){
		astint -= 75;
	}
	if (counter < 20) {
		velocity = 2;
	}
	else if (counter >= 20 && counter < 40) {
		velocity = 3;
	}
	else if (counter >= 40 && counter < 60) {
		velocity = 4;
	}
	else if (counter >= 60 && counter < 80) {
		velocity = 5;
	}
	else if (counter >= 80 && counter < 100) {
		velocity = 6;
	}
	else if (counter >= 100 && counter < 120) {
		velocity = 7;
	}
	else if (counter >= 120 && counter < 140) {
		velocity = 8;
	}
	else if (counter >= 140 && counter < 160) {
		velocity = 9;
	}
	else if (counter >= 160) {
		velocity = 10;
	}
	gameInterval = setInterval(function() {
      createFlyingObj('ast', Math.floor(Math.random()*(GAME_HEIGHT)), 0, Math.random() + velocity)}
    , astint);
}

function sethBombInterval() {
	if (bomb != true) {
		hBombInterval = setInterval(function() {
    		createFlyingObj('bomb' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  		,15000);
	}
}

function hwGhost() {
	HWIRE.style.opacity = 1;
	ghost = false;
}

function start() {
	
  AUDIO.play();
  
  START.style.opacity = 0;
  START.style.zIndex = -1;
  ABOUT.style.display = 'none';
  
  scoreInterval = setInterval(displayScore, 1000);
  fuelInterval = setInterval(displayFuel, 100);
  
  fuelTankInterval = setInterval(function() {
    createFlyingObj('fueltank' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 30000);
  
  ghostInterval = setInterval(function() {
    createFlyingObj('ghost' , Math.floor(Math.random()*(GAME_HEIGHT)), 0, 3)}
  , 25000);
  
  sethBombInterval();
  
  setAsteroidInterval();
  asteroidInterval = setInterval(setAsteroidInterval, 20000);

}

$(function() {
    $("#abouthh").click(function() {
    }, function() {
        $("#about").toggle();
		$("#start").toggle();
    });
});

document.addEventListener('keydown', (e) => {
  cursor = (e.keyCode == KC[cursor]) ? cursor + 1 : 0;
  if (cursor == KC.length) {
  	openInNewTab('https://www.hotwire.com/');
  }
});

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
};

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)){
	stars = false;
	AUDIO.style.display = "none";
	START.innerHTML = "DOUBLE TAP to Start";
	GAME.addEventListener('touchstart', takeoff);
	GAME.style.width = "95%";
	GAME.style.borderBottom = '2px solid white';
	SB.style.width = "95%";
	HFILL.style.width = "95%";
	ABOUT.style.width = "95%";
	ABOUT.style.left = "2.5%";
	ABOUT.style.fontSize = "28px";
	HFILL.style.left = "2.5%";
	window.addEventListener('touchstart', musicOn);
}

function musicOn(e){
	if (e.targetTouches.length > 3) {
		AUDIO.muted == true ? AUDIO.muted = false : AUDIO.muted = true;
	}
}

displayScore();
displayFuel();
bombs.innerHTML = "R-Fill: " + 0;
GAME.addEventListener('mousedown', takeoff);





