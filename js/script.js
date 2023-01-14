var speed=500, iddqd=false;
var speedID, scoreID;

async function initMap() {
    let lines;
    let checkLvl = document.querySelector('#check1');
      if (!checkLvl.checked) {
        const route=await getRoute();
        if (route) { 
          lines = route.lines;
         }
      }else{
        routeLength = document.querySelector('#routeLength').value;
        difficult = document.querySelector('#difficult').value;
        lines = generate_lvl(routeLength,difficult);
      }
      let top=0;
      lines.forEach(element => {
        top=top-20;
          for (let i=0; i<5; i++) {
            if (element.line[i]===1) {
              let box=document.createElement("div");
              box.classList.add('blocks');
              let tmp = Math.floor(Math.random() * 2); 
              box.style.backgroundImage = "url(./img/block"+tmp+".svg)";
              box.style.top=top+"vh";
              box.style.left=i*16+"vw";
              document.body.appendChild(box);
            }
          }
      });
}

function initCar() {
    const car = document.querySelector('#player1');
    car.style.top='50'+'vh';
    car.style.left='38'+'vw';
}
function initStrips(){
  strips_num = 6;
  for(let j=0;j<5;j++){
      let leftofSet=j*16+"vw";
      for (let i=-2;i<=(strips_num+2);i++){
        let strip=document.createElement("div");
        strip.classList.add('strips');
        strip.style.top=Math.floor(i*20)+"vh";
        strip.style.left=leftofSet;
        strip.style.height="10vh";
        document.querySelector('.gameArea').appendChild(strip);
      }
  }
}
/* manage car */
function carUp(car) {
    const top=parseInt(car.style.top);
    car.style.top=top-20+'vh';
    if (top<20) {car.style.top=top+'vh';}
    check();
}

function carDown(car) {
    const top=parseInt(car.style.top);
    car.style.top=top+20+'vh';
    if (top>80) {car.style.top=top+'vh';}
    check();
}

function carLeft(car) {
  const left=parseInt(car.style.left);
    car.style.left=left-16+'vw';
    car.style.transform='rotate(-25deg)';
    if (left<20){car.style.left=left+'vw';}
    check();
}

function carRight(car) {
    const left=parseInt(car.style.left);
    car.style.left=left+16+'vw';
    car.style.transform='rotate(25deg)';
    if (left>60){car.style.left=left+'vw';}
    check();
}

function changeSpeed(val) {
    speed+=val;
    if (speed<=0) {speed=100; }
    if (speed>=2000) {speed=2000; }
    let timerDiv=document.querySelector('#speed');
    timerDiv.innerText=21-Math.floor(speed/100) ; 
    if (document.querySelector('.start button').innerText == 'STOP') {
      blocks=document.querySelectorAll(".blocks");
      blocks.forEach(block=>{
        block.style.transitionDuration=Math.round(speed/100)/10+'s'; 
      });
      clearInterval(speedID);
      speedID = setInterval(function(){step()},speed);  
    }
}

function step() {
    const blocks=document.querySelectorAll(".blocks");
    let car=document.querySelector(".car");
    let finish = true; 
    if (iddqd) {car.style.zIndex='6';car.style.opacity=".7";}else{car.style.zIndex='2';car.style.opacity="1";};
    blocks.forEach(block=>{
      const top=parseInt(block.style.top);
      if (top<200) {finish=false;}
      block.style.top=top+20+'vh';
    });
    const strips=document.querySelectorAll(".strips");
    strips.forEach(strip=>{
      let top=parseInt(strip.style.top);
      if (top<=-20) {strip.style.display="block";}
      if (top>100) {top=-60; strip.style.display="none";} 
      strip.style.top=top+20+'vh';
    });
    check();
     if (finish) {  
      clearInterval(speedID);
      clearInterval(scoreID);
      /* document.removeEventListener("keydown",handler, false); */
      document.removeEventListener("keyup", drowNormalCar, false);
      let btnW = document.querySelector(".btnW"); if (btnW) {btnW.removeEventListener("touchstart",screenHandler); }
      let btnS = document.querySelector(".btnS"); if (btnS) {btnS.removeEventListener("touchstart",screenHandler); }
      let btnA = document.querySelector(".btnA"); if (btnA) {btnA.removeEventListener("touchstart",screenHandler); }
      let btnD = document.querySelector(".btnD"); if (btnD) {btnD.removeEventListener("touchstart",screenHandler); }
      document.removeEventListener("touchend", drowNormalCar, false);

      document.querySelector('.game_over h2').style.color="green";
      let bestScore = 0;
      if(isSupported(window.localStorage)) {
        bestScore = localStorage.bestScore;
        if (!bestScore || bestScore<parseInt(document.querySelector('.score').innerText)) {
          localStorage.bestScore= parseInt(document.querySelector('.score').innerText);
          document.querySelector(".game_over h2").innerHTML = "YOU WIN! ваш счет:"+parseInt(document.querySelector('.score').innerText)+"<br/>ЭТО НОВЫЙ РЕКОРД!";
        }else{
          document.querySelector(".game_over h2").innerHTML = "YOU WIN! ваш счет:"+(parseInt(document.querySelector('.score').innerText))+"Рекорд: "+bestScore;
        }
      }else{
        document.querySelector(".game_over h2").innerHTML = "YOU WIN! ваш счет:"+(parseInt(document.querySelector('.score').innerText));
      }
      document.querySelector(".game_over").style.display = "block";
     }
}

/* check accident */
function check() {
    let car=document.querySelector('#player1');
    let blocks=document.querySelectorAll('.blocks');
    let result=false;
    if (iddqd) {return result;}
    else{
      blocks.forEach(block=>{
        collapse=( car.offsetLeft <= block.offsetLeft + block.offsetWidth && car.offsetLeft + car.offsetWidth  >=  block.offsetLeft && car.offsetTop + car.offsetHeight >=  block.offsetTop && car.offsetTop <= block.offsetTop +  block.offsetHeight );
        if (collapse) result = true;
      });
      if (result) {
        clearInterval(speedID);
        clearInterval(scoreID);
        /* document.removeEventListener("keydown",handler, false); */
        document.removeEventListener("keyup", drowNormalCar, false);
        let btnW = document.querySelector(".btnW"); if (btnW) {btnW.removeEventListener("touchstart",screenHandler); }
        let btnS = document.querySelector(".btnS"); if (btnS) {btnS.removeEventListener("touchstart",screenHandler); }
        let btnA = document.querySelector(".btnA"); if (btnA) {btnA.removeEventListener("touchstart",screenHandler); }
        let btnD = document.querySelector(".btnD"); if (btnD) {btnD.removeEventListener("touchstart",screenHandler); }
        document.removeEventListener("touchend", drowNormalCar, false);
        document.querySelector(".game_over h2").innerText = "GAME OVER! ваш счет:"+Math.round((parseInt(document.querySelector('.score').innerText)))
        document.querySelector(".game_over").style.display = "block";
      }
    }
    return result;
}
/* read json router map */
async function getRoute() {
    let response = await fetch('./route.json');
    let result = await response.json();
    return result;
}

function handler(e) {
    e.preventDefault();
    const car = document.querySelector('#player1');
    switch(String(e.code)) {
      case 'KeyW' : carUp(car); break;
      case 'KeyA' : carLeft(car); break;
      case 'KeyS' : carDown(car); break;
      case 'KeyD' : carRight(car); break;
      case 'KeyQ' : changeSpeed(100); break;
      case 'KeyE' : changeSpeed(-100); break;
      case 'Escape' : if (document.querySelector(".game_over").style.display == "block") { clearBoard(); } break;
      case 'Space' : if (document.querySelector(".game_over").style.display == "none") { startGame(); } break;
      default: break;
    }
}
function screenHandler(e) {
  const car = document.querySelector('#player1');
  switch(String(e.target.innerText)) {
    case 'W' : carUp(car); break;
    case 'A' : carLeft(car); break;
    case 'S' : carDown(car); break;
    case 'D' : carRight(car); break;
    default: break;
  }
}
function drowNormalCar(e) {
  const car = document.querySelector('#player1');
  car.style.transform='rotate(0deg)';
}

window.onload = function() {
    initCar();
    initStrips();
    document.querySelector('.game_over').addEventListener('click', clearBoard);
    document.querySelector('.game_over').addEventListener('touchstart', clearBoard);
    document.addEventListener("keydown", handler);
    document.addEventListener("keyup", drowNormalCar);
    let btnW = document.querySelector(".btnW"); if (btnW) {btnW.addEventListener("touchstart",screenHandler); }
    let btnS = document.querySelector(".btnS"); if (btnS) {btnS.addEventListener("touchstart",screenHandler); }
    let btnA = document.querySelector(".btnA"); if (btnA) {btnA.addEventListener("touchstart",screenHandler); }
    let btnD = document.querySelector(".btnD"); if (btnD) {btnD.addEventListener("touchstart",screenHandler); }
    document.addEventListener("touchend", drowNormalCar);
    
    document.querySelector('.start button').addEventListener('click', startGame());
}

function clearBoard(){
    clearInterval(speedID);
    clearInterval(scoreID);
    document.querySelector('.score').innerText='0';
    document.querySelector('.start button').innerText = 'START';
    document.querySelector('.game_over').style.display="none";
    document.querySelector('.game_over h2').style.color="red";
    document.querySelector(".game_over h2").innerText = "GAME OVER";
    document.querySelectorAll('.blocks').forEach(block => {block.remove();});
    document.querySelectorAll('.strips').forEach(strip => {strip.remove();});
    document.addEventListener("keydown", handler);
    document.addEventListener("keyup", drowNormalCar);
    let btnW = document.querySelector(".btnW"); if (btnW) {btnW.addEventListener("touchstart",screenHandler); }
    let btnS = document.querySelector(".btnS"); if (btnS) {btnS.addEventListener("touchstart",screenHandler); }
    let btnA = document.querySelector(".btnA"); if (btnA) {btnA.addEventListener("touchstart",screenHandler); }
    let btnD = document.querySelector(".btnD"); if (btnD) {btnD.addEventListener("touchstart",screenHandler); }
    document.addEventListener("touchend", drowNormalCar);
    initCar();
    initStrips();
}

function startGame() {
  if (document.querySelector('.start button').innerText === 'START') {
    initMap();
    speedID = setInterval(function(){step()},speed);
    scoreID = setInterval(function(){
      let difficult = document.querySelector('#difficult').value;
      if (!difficult) {difficult = 5;}
      let score = document.querySelector('.score');
      score.innerText = Math.round(parseInt(score.innerText) + ((2000-speed)*difficult)/100);
    },100);         
      document.querySelector('.start button').innerText = 'STOP';
    }else{
        clearInterval(scoreID);
        clearInterval(speedID);
        document.querySelector('.start button').innerText = 'START';
    }
}
function generate_lvl(lines=25, difficult=10) {
  if (lines<0) {lines=25;}
  if ((difficult<0)||(difficult>10)) {difficult=5;}
  let result=[], res=[], tmp=0;
    for (let j=0; j<lines; j++)
    {
      res =[];
      for (let i=0; i<5; i++) {
        tmp = Math.floor(Math.random() * Math.floor(12-difficult));
        if (tmp>1) {tmp = 0 };
        res.push(tmp);
      }
      result.push({"line":res});
    }
  return result;
}

function isSupported(storage) {
  try {
    const key = "_123abc!@##@!cba321_";
    storage.setItem(key, key);
    storage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}
