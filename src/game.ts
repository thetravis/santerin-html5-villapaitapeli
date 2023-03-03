import { playSound, stopSound } from './sound';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const startBtn = $('.start-button') as HTMLButtonElement;
const noBtn = $('.no-button') as HTMLButtonElement;
const yesBtn = $('.yes-button') as HTMLButtonElement;
const retryButtons = Array.from($$('.retry-button')) as HTMLButtonElement[];

let wins = 0;

const gameStates = {
  intro: () => {
    playSound('santerin_villapaitapeli');
  },
  question: () => {
    playSound('pue_santerille_villapaita');
  },
  selectedNo: async () => {
    await playSound('hmm');
    changeGameState('gameLost');
  },
  selectedYes: () => {
    wins++;
    stopSound();
    setTimeout(() => {
      changeGameState('tickling');
    }, 1500);
  },
  tickling: async () => {
    await playSound('naurunremakka_kutittaa');
    changeGameState('gameWon');
  },
  gameLost: () => {
    playSound('hävisit_pelin');
  },
  gameWon: () => {
    playSound('voitit_pelin');
  },
};

function bindEventListeners() {
  startBtn.onclick = () => {
    changeGameState('question');
  };
  noBtn.onclick = () => {
    changeGameState('selectedNo');
  };
  yesBtn.onclick = () => {
    changeGameState('selectedYes');
  };
  retryButtons.forEach(
    btn =>
      (btn.onclick = () => {
        changeGameState('intro');
      })
  );
}

function changeGameState(name: keyof typeof gameStates) {
  const children = Array.from($$('.game > div')) as HTMLElement[];
  children.forEach(c => (c.style.display = 'none'));

  const stageElement = $(`div[data-stage="${name}"]`) as HTMLDivElement;
  stageElement.style.display = 'block';

  const winsElement = $("#wins") as HTMLSpanElement
  winsElement.innerHTML = "" + wins;

  gameStates[name]();
}

function start() {
  bindEventListeners();
  changeGameState('intro');
}

start();
