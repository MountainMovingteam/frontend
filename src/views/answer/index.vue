<template>
  <keep-alive>
  <div>
    <el-card v-if="showOriginal" class="main-card" shadow="always">
      <el-alert
          title="欢迎来到答题界面！"
          type="success"
          description=" "
          center
          :closable="false"
          style="margin-top: 40px"
      />
      <div style="margin-top: 60px;text-align: center;line-height: 2;">
      <el-text class="mx-1">
        在这里巩固你的安全知识吧！
        <br>
        点击下方开始答题进行练习，共10道题，总分100分。题型包括单选、多选。
      </el-text>
      </div>

      <div class="start-button">
      <el-button color="#626aef" size="large" plain @click="switch2Questions">
        开始答题
      </el-button>
      </div>
    </el-card>

    <div v-if="showQuestions" >
      <div class="scrollbar-container">

    <div v-for="(question, index) in questions" :key="index">
      <el-card class="question_card" shadow="hover">

        <template #header>
          <div class="card-header">
            <span style="font-size: medium">{{index + 1}}.{{question.type === 1? '（多选题）': '（单选题）'}}{{ question.content.title }}</span>
          </div>
        </template>

        <div>
          <div>
          <el-checkbox
              v-model="answers[index].a_option"
              :label="'A. ' + question.content.a_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'a_option')"
              class="option-box"
          >
            <span style="font-size: small;line-height: 1.5;">
            {{'A. ' + question.content.a_option}}
            </span>
          </el-checkbox>
          </div>
          <div>
          <el-checkbox
              v-model="answers[index].b_option"
              :label="'B. ' + question.content.b_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'b_option')"
              class="option-box"
          >
            <span style="font-size: small;line-height: 1.5;">
            {{'B. ' + question.content.b_option}}
            </span>
          </el-checkbox>
          </div>
          <div style="display: block">
          <el-checkbox
              v-model="answers[index].c_option"
              :label="'C. ' + question.content.c_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'c_option')"
              class="option-box"
          >
            <span style="font-size: small;line-height: 1.5;">
            {{'C. ' + question.content.c_option}}
            </span>
          </el-checkbox>
          </div>
          <div>
          <el-checkbox
              v-model="answers[index].d_option"
              :label="'D. ' + question.content.d_option"
              size="large"
              :disabled="showResult"
              @change="handleCheckboxChange(index, 'd_option')"
              class="option-box"
          >
            <span style="font-size: small;line-height: 1.5;">
            {{'D. ' + question.content.d_option}}
            </span>
          </el-checkbox>
          </div>
        </div>

        <template #footer v-if="showResult">
          <el-alert v-if="isAnswerCorrect(question.question_id)" title="回答正确" type="success" :closable="false"/>
          <el-alert v-else :title="'回答错误，您的回答是' + myAnswer(index) + '，正确答案是' + getCorrectAnswer(question.question_id)"
                    type="error" :closable="false"/>
        </template>
      </el-card>
      <el-divider />
    </div>
      </div>

    <div class="flex-warp-item-box" style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
      <el-button v-if="showQuestions && !showResult" type="success" size="large" @click="submitAnswers">
        <el-icon>
          <ele-Check />
        </el-icon>
        提交
      </el-button>
      <el-button v-if="showQuestions && showResult" type="info" size="large" @click="switch2Main">
        <el-icon>
          <RefreshLeft />
        </el-icon>
        返回
      </el-button>
    </div>
    </div>

  </div>
  </keep-alive>
</template>

<script setup lang="ts">

import {computed, onMounted, ref} from 'vue';
import {useRouter} from "vue-router";
import {RefreshLeft} from "@element-plus/icons-vue";
import {getAnswers, getQuestions} from "/@/api/answer";

export interface Question {
  question_id: number;
  type: number;
  content: Content;
}

export interface Content {
  a_option: string;
  b_option: string;
  c_option: string;
  d_option: string;
  title: string;
}

export interface Answer {
  a_option: boolean;
  b_option: boolean;
  c_option: boolean;
  d_option: boolean;
}

export interface Result {
  question_id: number;
  correct: boolean;
  correct_ans: number;
}

const questions = ref<Question[]>([]);
const answers = ref<Answer[]>([]);
const results = ref<Result[]>([]);
const showOriginal = ref(true);
const showQuestions = ref(false);
const showResult = ref(false);

const correctType = computed(() => {
  return results.value.reduce((acc: any, curr: any) => {
    acc[curr.question_id] = curr.correct ? 'success' : 'error';
    return acc;
  }, {});
});

const isAnswerCorrect = (question_id: number) => {
  const correctTypeForQuestion = correctType.value[question_id];
  return correctTypeForQuestion === 'success';
};

const correctAnswer = computed(() => {
  return results.value.reduce((acc: any, curr: any) => {
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

const initQuestions = () => {
  const response = getQuestions(10);
  response.then(response =>{
    questions.value =  Object.values(response.data).find(Array.isArray);
    console.log(questions.value)
  });
}

const initAnswers = () => {
  answers.value.splice(0, answers.value.length);
  for (let i = 1; i <= 10; i++) {
    let answer = {
      a_option: false,
      b_option: false,
      c_option: false,
      d_option: false,
    }
    answers.value.push(answer);
  }
}

const generateNumberArray = (a: boolean, b: boolean, c: boolean, d: boolean): number[] => {
  const result: number[] = [];
  result.push(a ? 1 : 0);
  result.push(b ? 1 : 0);
  result.push(c ? 1 : 0);
  result.push(d ? 1 : 0);
  return result;
};

const router = useRouter();

router.beforeEach((to, from, next) => {
  // 切换路由之前存储
  saveDataToLocalStorage();
  next();
});

onMounted(() => {
  // 加载页面时先加载本地存储，如果不存在就手动赋初值
  restoreDataFromLocalStorage();
});

window.addEventListener('beforeunload', () => {
  saveDataToLocalStorage();
});

// 保存数据到本地存储
function saveDataToLocalStorage() {
  localStorage.setItem('questions', JSON.stringify(questions.value));
  localStorage.setItem('answers', JSON.stringify(answers.value));
  localStorage.setItem('results', JSON.stringify(results.value));
  localStorage.setItem('showOriginal', JSON.stringify(showOriginal.value));
  localStorage.setItem('showQuestions', JSON.stringify(showQuestions.value));
  localStorage.setItem('showResult', JSON.stringify(showResult.value));
}

// 从本地存储中恢复数据
function restoreDataFromLocalStorage() {
  const storedQuestions = localStorage.getItem('questions');
  if (storedQuestions !== null){
    questions.value = JSON.parse(storedQuestions);
  } else {
    initQuestions();
  }

  const storedAnswers = localStorage.getItem('answers');
  if (storedAnswers !== null) {
    answers.value = JSON.parse(storedAnswers);
  } else {
    initAnswers();
  }

  const storedResults = localStorage.getItem('results');
  if (storedResults !== null) {
    results.value = JSON.parse(storedResults);
  }

  const storedShowOriginal = localStorage.getItem('showOriginal');
  if (storedShowOriginal !== null) {
    showOriginal.value = JSON.parse(storedShowOriginal);
  } else {
    showOriginal.value = true;
  }

  const storedShowQuestions = localStorage.getItem('showQuestions');
  if (storedShowQuestions !== null) {
    showQuestions.value = JSON.parse(storedShowQuestions);
  } else {
    showQuestions.value = false;
  }

  const storedShowResult = localStorage.getItem('showResult');
  if (storedShowResult !== null) {
    showResult.value = JSON.parse(storedShowResult);
  } else {
    showResult.value = false;
  }
}

const switch2Questions = () => {
  initQuestions();
  initAnswers();
  showOriginal.value = false;
  showQuestions.value = true;
  showResult.value = false;
}

const switch2Main = () => {
  showOriginal.value = true;
  showQuestions.value = false;
  showResult.value = false;
}

const submitAnswers = () => {
  let list: { question_id: number; student_answer: number[] }[] = [];
  answers.value.forEach((item, index) => {
    let student_answer = generateNumberArray(item.a_option, item.b_option, item.c_option,item.d_option);
    list.push({question_id: questions.value[index].question_id, student_answer: student_answer});
  });
  console.log(list);
  // ********** TODO ***************** 实际调用接口接受answerData的值
  const response = getAnswers(10, list);
  response.then(response =>{
    results.value = Object.values(response.data.list).find(Array.isArray);
    console.log(results.value);
    showResult.value = true;
  })
};
</script>

<style scoped lang="scss">
.main-card{
  width: 70%;
  height: 450px;
  margin-top: 10%;
  margin-left: 15%;
  margin-right: 15%;
}

@media screen and (max-width: 768px) {
  .main-card {
    width: 80%;
    height: 500px;
    margin-top: 20%;
    margin-left: 10%;
    margin-right: 10%;
  }
}

.start-button{
  margin-top: 130px;
  display: flex;
  justify-content: center;
}

.scrollbar-container {
  height: 80vh;
  overflow-y: auto;
}

.question_card{
  width: 92%;
  margin-left: 4%;
  margin-right: 4%;
  margin-top: 10px;
}

.option-box{
  display: inline-block;
  white-space: pre-wrap;
  padding: 20px 0;
  overflow-wrap: break-word;
}
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>