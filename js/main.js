let app = new Vue({
  el: ".main",
  data: {
    showMain: true,
    showSocial: false,
    showAchivment: false,
    showQuestions: false,
    showResult: false,
    number: 0,
    score: {
      zerg: 0,
      primal: 0,
      protoss: 0,
      taldarim: 0,
      terran: 0,
    },
    totalGame: localStorage.getItem("sc2TotalGame")
      ? JSON.parse(localStorage.getItem("sc2TotalGame"))
      : {
          zerg: 0,
          primal: 0,
          protoss: 0,
          taldarim: 0,
          terran: 0,
          infested: 0,
          hybrid: 0,
        },
    totalGames: localStorage.getItem("sc2TotalGames")
      ? localStorage.getItem("sc2TotalGames")
      : 0,
    questions: questions,
    results: results,
    resultRace: "infested",
  },
  methods: {
    goToMain() {
      this.showMain = true;
      this.showSocial = false;
      this.showAchivment = false;
      this.showQuestions = false;
      this.showResult = false;
    },
    goToSocial() {
      this.showMain = false;
      this.showSocial = true;
      this.showAchivment = false;
      this.showQuestions = false;
      this.showResult = false;
    },
    goToAchivments() {
      if (this.totalGames > 0) {
        this.showMain = false;
        this.showSocial = false;
        this.showQuestions = false;
        this.showAchivment = true;
        this.showResult = false;
      } else {
        this.goToQuestions();
      }
    },
    goToQuestions() {
      this.score = {
        zerg: 0,
        primal: 0,
        protoss: 0,
        taldarim: 0,
        terran: 0,
      };
      this.showMain = false;
      this.showSocial = false;
      this.showQuestions = true;
      this.showAchivment = false;
      this.showResult = false;
    },
    goToResult(race) {
      this.showMain = false;
      this.showSocial = false;
      this.showQuestions = false;
      this.showAchivment = false;
      this.showResult = true;
      this.resultRace = race;
    },
    nextQuestions(answer) {
      if (this.number == 24) {
        this.number = 0;
        this.endGame();
      } else {
        this.number++;
      }
      eval(answer);
    },
    endGame() {
      this.totalGames++;
      localStorage.setItem("sc2TotalGames", this.totalGames);
      // zerg
      if (
        this.score.zerg > this.score.protoss &&
        this.score.zerg > this.score.terran &&
        this.score.primal < 8 &&
        Math.abs(this.score.protoss - this.score.zerg) > 3
      ) {
        this.goToResult("zerg");
        this.totalGame.zerg++;
      }
      // primal
      else if (
        this.score.primal > this.score.protoss &&
        this.score.primal > this.score.terran &&
        this.score.primal == 8
      ) {
        this.goToResult("primal");
        this.totalGame.primal++;
      }
      // protoss
      else if (
        this.score.protoss > this.score.protoss &&
        this.score.protoss > this.score.terran &&
        this.score.taldarim < 5 &&
        Math.abs(this.score.protoss - this.score.zerg) > 3
      ) {
        this.goToResult("protoss");
        this.totalGame.protoss++;
      }
      // taldarim
      else if (
        this.score.taldarim > this.score.zerg &&
        this.score.taldarim > this.score.terran &&
        this.score.taldarim == 5
      ) {
        this.goToResult("taldarim");
        this.totalGame.taldarim++;
      }
      // terran
      else if (
        this.score.terran > this.score.protoss &&
        this.score.terran > this.score.zerg
      ) {
        this.goToResult("terran");
        this.totalGame.terran++;
      }
      // hybrid
      else if (Math.abs(this.score.protoss - this.score.zerg) <= 3) {
        this.goToResult("hybrid");
        this.totalGame.hybrid++;
      }
      // infested
      else {
        this.goToResult("infested");
        this.totalGame.infested++;
      }
      localStorage.setItem("sc2TotalGame", JSON.stringify(this.totalGame));
    },
  },
  computed: {
    totalScore() {
      let score = 0;
      for (i in this.totalGame) {
        score += this.totalGame[i] * results[i].points;
      }
      return score;
    },
    openRaces() {
      let count = 0;
      for (i in this.totalGame) {
        if (this.totalGame[i] > 0) count++;
      }
      return count;
    },
    favoriteRace() {
      let max = "zerg";
      for (i in this.totalGame) {
        if (this.totalGame[i] > this.totalGame[max]) {
          max = i;
        }
      }
      return results[max].name;
    },
    showResultRace() {
      return {
        zerg: this.totalGame.zerg > 0 ? true : false,
        primal: this.totalGame.primal > 0 ? true : false,
        protoss: this.totalGame.protoss > 0 ? true : false,
        taldarim: this.totalGame.taldarim > 0 ? true : false,
        terran: this.totalGame.terran > 0 ? true : false,
        infested: this.totalGame.infested > 0 ? true : false,
        hybrid: this.totalGame.hybrid > 0 ? true : false,
      };
    },
  },
});
let audio = new Audio("audio/soundtrack.mp3");
let audio__btn = document.querySelector(".btn__sound");
let audio__icon = document.querySelector(".btn__sound i");

audio.muted = true;
audio.volume = 0.2;

audio.addEventListener("loadmetadata", function () {});

audio__btn.addEventListener("click", function () {
  if (audio.muted) {
    audio.muted = false;
    audio.currentTime = 0 + Math.random() * (audio.duration + 1 - 0);
    audio.play()
    audio__icon.classList.add("fa-volume-up");
    audio__icon.classList.remove("fa-volume-off");
  } else if (!audio.muted) {
    audio.muted = true;
    audio.pause()
    audio__icon.classList.add("fa-volume-off");
    audio__icon.classList.remove("fa-volume-up");
  }
});
