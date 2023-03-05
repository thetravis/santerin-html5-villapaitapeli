import { playSound, stopSound } from './sound';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const startBtn = $('.start-button') as HTMLButtonElement;
const noBtn = $('.no-button') as HTMLButtonElement;
const yesBtn = $('.yes-button') as HTMLButtonElement;
const noBtnFinalBoss = $('.no-button-final-boss') as HTMLButtonElement;
const yesBtnFinalBoss = $('.yes-button-final-boss') as HTMLButtonElement;
const retryButtons = Array.from($$('.retry-button')) as HTMLButtonElement[];
const MAX_WINS = 10;

let wins = 0;

const gameStates = {
  intro: () => {
    playSound('santerin_villapaitapeli');
  },
  question: () => {
    playSound('pue_santerille_villapaita');
  },
  finalBoss: () => {
    playSound('pue_jonnalle_villapaita');
  },
  selectedNo: async () => {
    await playSound('hmm');
    wins = 0;
    changeGameState('gameLost');
  },
  selectedYes: () => {
    stopSound();
    setTimeout(() => {
      changeGameState('tickling');
    }, 1500);
  },
  selectedYesFinalBoss: async () => {
    stopSound();
    setTimeout(async () => {
      changeGameState('notGoingToWork');
    }, 2000);
  },
  notGoingToWork: async () => {
    await playSound('eihan_se_onnistu');
    wins = 0;
    changeGameState('gameLost');
  },

  tickling: async () => {
    await playSound('naurunremakka_kutittaa');
    wins++;
    setCookie(wins, 7);
    changeGameState('gameWon');
  },
  gameLost: () => {
    playSound('havisit_pelin');
  },
  gameWon: () => {
    playSound('voitit_pelin');
  },
};

function bindEventListeners() {
  startBtn.onclick = () => {
    if (wins >= MAX_WINS) {
      changeGameState('finalBoss');
    } else {
      changeGameState('question');
    }
  };
  noBtn.onclick = () => {
    changeGameState('selectedNo');
  };
  noBtnFinalBoss.onclick = () => {
    changeGameState('selectedNo');
  };
  yesBtnFinalBoss.onclick = () => {
    changeGameState('selectedYesFinalBoss');
  };
  yesBtn.onclick = () => {
    changeGameState('selectedYes');
  };
  retryButtons.forEach(
    btn =>
    (btn.onclick = () => {
      if (wins >= MAX_WINS) {
        changeGameState('finalBoss');
      } else {
        changeGameState('intro');
      }
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

  if (!document.cookie || isNaN(parseInt(getCookieValue("wins")))) {
    setCookie(0, 7);
  }

  wins = parseInt(getCookieValue("wins"));

  bindEventListeners();

  changeGameState('intro');
}

function setCookie(wins: number, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = "wins=" + wins + ";" + expires + ";";
}

function getCookieValue(cname: string) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

start();
