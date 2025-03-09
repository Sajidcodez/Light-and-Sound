//Global Variables
let tonePlaying = false;
let volume = 0.5; // used the suggested volume of 0.5
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0; 
let gamePlaying = false;
let guessCounter = 0 ;
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

function startGame() {
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  playClueSequence()

  // swap the Start and Stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
}

function stopGame() {
  gamePlaying = false ;
  startBtn.classList.remove("hidden")
  stopBtn.classList.add("hidden")
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  guessCounter = 0 ;
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame()
  alert("Game Over! You lost.")
}

function winGame(){
  stopGame()
  alert("You won. CONGRATS!!")
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  if(pattern[guessCounter] == btn) {
    if(guessCounter == progress){
      if(progress == pattern.length-1){
        winGame()
      }else{
        //pattern is valid. keep going
        progress++;
        playClueSequence();
      }
    }else{
      // keep going and check for the next guesses
      guessCounter++;
    }
  }else{
    // user guessed wrong 
    loseGame();
  }
}


// Sound Synthesis Functions 
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)