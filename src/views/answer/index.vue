<template>
  <div>
    <div v-for="(question, index) in questions" :key="index">
      <el-card class="question_card">

        <template #header>
          <div class="card-header">
            <span>{{index + 1}}.{{question.type === 1? '（多选题）': '（单选题）'}}{{ question.content.title }}</span>
          </div>
        </template>

        <div>
          <el-checkbox
              v-model="answers[index].a_option"
              :label="'A. ' + question.content.a_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'a_option')"
          />
          <br>
          <el-checkbox
              v-model="answers[index].b_option"
              :label="'B. ' + question.content.b_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'b_option')"
          />
          <br>
          <el-checkbox
              v-model="answers[index].c_option"
              :label="'C. ' + question.content.c_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'c_option')"
          />
          <br>
          <el-checkbox
              v-model="answers[index].d_option"
              :label="'D. ' + question.content.d_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'd_option')"
          />
        </div>

        <template #footer v-if="showResult">
          <el-alert v-if="isAnswerCorrect(question.question_id)" title="回答正确" type="success" :closable="false"/>
          <el-alert v-else :title="'回答错误，您的回答是' + myAnswer(index) + '，正确答案是' + getCorrectAnswer(question.question_id)"
                    type="error" :closable="false"/>
        </template>
      </el-card>
      <el-divider />
    </div>

    <div class="flex-warp-item-box" style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
      <el-button type="success" size="large" @click="submitAnswers">
        <el-icon>
          <ele-Check />
        </el-icon>
        提交
      </el-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue';
import {getQuestions} from "/@/api/answer";

export interface Question {
  question_id: number;
  type: number;
  content: Content;
  [property: string]: any;
}

export interface Content {
  a_option: string;
  b_option: string;
  c_option: string;
  d_option: string;
  title: string;
  [property: string]: any;
}

export interface Answer {
  a_option: boolean;
  b_option: boolean;
  c_option: boolean;
  d_option: boolean;
}

const questions = ref<Question[]>([]);
const answers = ref<Answer[]>([]);
const showResult = ref(false);

const state = reactive<any>({
  answerData: {
    list: [
      {
        question_id: 0,
        correct: true,
        correct_ans: 0,
      }
    ],
    correct_rate: 0,
  },
  questionList: [
    {
      question_id: 0,
      type: 0,
      content: {
        a_option: "",
        b_option: "",
        c_option: "",
        d_option: "",
        title: "",
      }
    }
  ],
});

const correctType = computed(() => {
  return state.answerData.list.reduce((acc: any, curr: any) => {
    acc[curr.question_id] = curr.correct ? 'success' : 'error';
    return acc;
  }, {});
});

const isAnswerCorrect = (question_id: number) => {
  const correctTypeForQuestion = correctType.value[question_id];
  return correctTypeForQuestion === 'success';
};

const correctAnswer = computed(() => {
  return state.answerData.list.reduce((acc: any, curr: any) => {
    acc[curr.question_id] = curr.correct_ans;
    return acc;
  }, {});
})

const getCorrectAnswer = (question_id: number) => {
  let answer = ' ';
  const correctNumber = correctAnswer.value[question_id];
  if (correctNumber & 8) {
    answer = answer.concat("A ");
  }
  if (correctNumber & 4) {
    answer = answer.concat("B ");
  }
  if (correctNumber & 2) {
    answer = answer.concat("C ");
  }
  if (correctNumber & 1) {
    answer = answer.concat("D ");
  }
  return answer;
}


const myAnswer = (index: number) => {
  let answer = ' ';
  if (answers.value[index].a_option) {
    answer = answer.concat("A ");
  }
  if (answers.value[index].b_option) {
    answer = answer.concat("B ");
  }
  if (answers.value[index].c_option) {
    answer = answer.concat("C ");
  }
  if (answers.value[index].d_option) {
    answer = answer.concat("D ");
  }
  return answer;
}

const handleCheckboxChange = (index: number, selectedOption: string) => {
  const question = questions.value[index];
  if (question.type === 0) {
    const answerOptions = answers.value[index] as Record<string, boolean>;
    Object.keys(answerOptions).forEach(option => {
      if (option !== selectedOption) {
        answerOptions[option] = false;
      }
    });
  }
};

const fetchQuestions =  () => {
  // ********** TODO ***************** 实际调用接口接受questionList的值
  const response = getQuestions(10);
  response.then(response =>{
    state.questionList = response.data;
    questions.value = response.data;
  });
};

const pushStaticQuestions = () => {
  for (let i = 1; i <= 10; i++) {
    let content = {
      a_option: `${i}a`,
      b_option: `${i}b`,
      c_option: `${i}c`,
      d_option: `${i}d`,
      title: `这个题目的序号为${i}`,
    };
    let question = {
      question_id: i,
      type: i % 2,
      content: content,
    }
    questions.value.push(question);
    let answer = {
      a_option: false,
      b_option: false,
      c_option: false,
      d_option: false,
    }
    answers.value.push(answer);
  }
  state.questionList = questions.value;
}

const generateNumberArray = (a: boolean, b: boolean, c: boolean, d: boolean): number[] => {
  const result: number[] = [];
  result.push(a ? 1 : 0);
  result.push(b ? 1 : 0);
  result.push(c ? 1 : 0);
  result.push(d ? 1 : 0);
  return result;
};

onMounted(() => {
  //fetchQuestions();
  pushStaticQuestions();
});

const submitAnswers = () => {
  let list: { question_id: number; student_answer: number[] }[] = [];
  questions.value.forEach((item) => {
    let student_answer = generateNumberArray(item.a_option, item.b_option, item.c_option,item.d_option);
    list.push({question_id: item.question_id, student_answer: student_answer});
  });
  // ********** TODO ***************** 实际调用接口接受answerData的值
  // const response = getAnswers(10, list);
  // response.then(response=>{
  //   state.answerData = response.data;
  //   showResult.value = true;
  // })
  let objects = [];
  for (let i = 1;i <= 10;i++) {
    let object = {
      question_id: i,
      correct: i % 2 == 0,
      correct_ans: i,
    }
    objects.push(object);
  }
  state.answerData.list = objects;
  //console.log(state.answerData.list)
  showResult.value = true;
};
</script>

<style scoped lang="scss">
.question_card{
  width: 92%;
  margin-left: 4%;
  margin-right: 4%;
  margin-top: 10px;
}

.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>