<template>
  <div>
    <ScoreBoard :winCount="this.winCount" :loseCount="this.loseCount" />

    <template v-if="this.question">
      <!-- quand on met v-html, il faut enlever ce qu'il y a dans la div sinon VueCompilerError: v-html will override element children. -->
      <h1 v-html="this.question"></h1>

      <template v-for="(answer, index) in this.answers" :key="index">
        <input
          :disabled="this.answerSubmitted"
          type="radio"
          name="options"
          :value="answer"
          v-model="this.chosenAnswer"
        />
        <label v-html="answer"></label><br />
      </template>

      <button
        v-if="!this.answerSubmitted"
        @click="this.submitAnswer()"
        class="send"
        type="button"
      >
        Send
      </button>

      <section v-if="this.answerSubmitted" class="result">
        <h4
          v-if="this.chosenAnswer == this.correctAnswer"
          v-html="
            '&#9989; Congratulations, the answer ' +
            this.correctAnswer +
            ' is correct.'
          "
        ></h4>
        <h4
          v-else
          v-html="
            '&#10060; I`m sorry, you picked the wrong answer. The correct is ' +
            this.correctAnswer +
            '.'
          "
        ></h4>

        <button @click="this.getNewQuestion()" class="send" type="button">
          Next question
        </button>
      </section>
    </template>
  </div>
</template>

<script>
import ScoreBoard from "./components/ScoreBoard.vue";
export default {
  name: "App",
  components: {
    ScoreBoard,
  },
  data() {
    return {
      question: undefined,
      incorrectAnswers: undefined,
      correctAnswer: undefined,
      category: undefined,
      difficulty: undefined,
      type: undefined,
      chosenAnswer: undefined,
      answerSubmitted: false,
      winCount: 0,
      loseCount: 0,
    };
  },
  // propriétés calculées
  computed: {
    answers() {
      // pour éviter liaison de données à double sens, les transformer en JSON
      var answers = JSON.parse(JSON.stringify(this.incorrectAnswers));
      // brassage des données du tableau
      // et placement aléatoire de la bonne réponse = Math.random() mais renvoie tjs un nb entre 0 et 1
      // Math.round() = arrondit en nb entier
      // on définit la longueur du tableau = answers.length
      // splice(position de l'élément, combien d'élément on supprime, l'élément qu'on veut rajouter)
      answers.splice(
        Math.round(Math.random() * answers.length),
        0,
        this.correctAnswer
      );
      return answers;
    },
  },
  methods: {
    submitAnswer() {
      if (!this.chosenAnswer) {
        alert("Pick one of the options");
      } else {
        this.answerSubmitted = true;
        if (this.chosenAnswer == this.correctAnswer) {
          this.winCount++;
          // console.log("YEAH!!!");
        } else {
          this.loseCount++;
          // console.log("You Suck!!!");
        }
        localStorage.setItem("winCount", this.winCount);
        localStorage.setItem("loseCount", this.loseCount);
      }
    },
    getNewQuestion() {
      this.answerSubmitted = false;
      this.chosenAnswer = undefined;
      this.question = undefined;

      this.axios
        .get("https://opentdb.com/api.php?amount=1&category=18")
        .then((response) => {
          this.question = response.data.results[0].question;
          this.incorrectAnswers = response.data.results[0].incorrect_answers;
          this.correctAnswer = response.data.results[0].correct_answer;
          this.category = response.data.results[0].category;
          this.difficulty = response.data.results[0].difficulty;
          this.type = response.data.results[0].type;
          // console.log(response.data.results[0])
        });
    },
  },
  created() {
    this.getNewQuestion();
    this.winCount = localStorage.getItem("winCount")
      ? localStorage.getItem("winCount")
      : this.winCount;
    this.loseCount = localStorage.getItem("loseCount")
      ? localStorage.getItem("loseCount")
      : this.loseCount;
  },
  updated() {
    localStorage.setItem("winCount", this.winCount);
    localStorage.setItem("loseCount", this.loseCount);
  },
};

// https://opentdb.com/api.php?amount=1&category=18
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 960px;

  input[type="radio"] {
    margin: 12px 4px;
  }

  button.send {
    margin-top: 12px;
    height: 40px;
    min-width: 120px;
    padding: 0 16px;
    color: #fff;
    background-color: #1867c0;
    border: 1px solid #1867c0;
    cursor: pointer;
  }
}
</style>
