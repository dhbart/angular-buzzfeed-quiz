import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions_beta.json"

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})

export class QuizzComponent implements OnInit {

  title:string = ""

  questions:any
  questionSelected:any

  answers:string[] = []
  answerSelected:string =""

  questionIndex:number =0
  questionMaxIndex:number=0

  finished:boolean = false

  calculating: boolean = false;

  loadingMessage: string = "";

  loadingMessages: string[] = [
    "🧠 Calculando sua aura...",
    "📈 Medindo seu nível de Sigma...",
    "🥖 Contando a quantidade de farinha...",
    "🤖 Consultando o Conselho dos Brainrots...",
    "💀 Evitando virar Betinha...",
    "🔥 Farmando Aura...",
    "📡 Procurando seu animal espiritual...",
    "✨ Resultado quase pronto..."
  ];

  constructor() { }

 ngOnInit(): void {
  this.startQuiz();
}

  private showLoadingAnimation(callback: () => void) {

    this.calculating = true;

    let index = 0;

    this.loadingMessage = this.loadingMessages[index];

    const interval = setInterval(() => {

    const random =
        Math.floor(Math.random() * this.loadingMessages.length);

      this.loadingMessage = this.loadingMessages[random];

    }, 900);

    setTimeout(() => {
      clearInterval(interval);
      this.calculating = false;
      callback();
  }, 10000);

}

  startQuiz() {
    this.answers = [];
    this.answerSelected = "";
    this.questionIndex = 0;
    this.finished = false;

    this.title = quizz_questions.title;
    this.questions = quizz_questions.questions;
    this.questionMaxIndex = this.questions.length;
    this.questionSelected = this.questions[this.questionIndex];
  }

  restartQuiz() {
    this.startQuiz();
  }

  playerChoose(value:string){
    this.answers.push(value)
    this.nextStep()

  }

  async nextStep(){
    this.questionIndex+=1

    if(this.questionMaxIndex > this.questionIndex){
        this.questionSelected = this.questions[this.questionIndex]
    }else{
      this.showLoadingAnimation(async () => {

      const finalAnswer = await this.checkResult(this.answers);

      this.answerSelected =
        quizz_questions.results[
          finalAnswer as keyof typeof quizz_questions.results
        ];

      this.finished = true;

    });
    }
  }

  async checkResult(answers:string[]){

    const counts = new Map<string, number>();

    for (const answer of answers) {
      counts.set(answer, (counts.get(answer) ?? 0) + 1);
    }

    let winner = "";
    let maxCount = 0;

    for (const [answer, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        winner = answer;
      }
    }

    return winner;

  }


}
