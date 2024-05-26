<template>
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

    <div class="flex-warp-item-box" style="display: flex; justify-content: center; margin-top: 20px; margin-bottom: 20px;">
      <el-button type="success" size="large" @click="submitAnswers">
        <el-icon>
          <ele-Check />
        </el-icon>
        提交
      </el-button>
    </div>
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
const showOriginal = ref(true);
const showQuestions = ref(false);
const showResult = ref(false);
ref(false);
const generateQuestionList = () => {
  const questionList = [];
  for (let i = 0; i < 10; i++) {
    const content = {
      a_option: `Option A for Question ${i + 1}`,
      b_option: `Option B for Question ${i + 1}`,
      c_option: `Option C for Question ${i + 1}`,
      d_option: `Option D for Question ${i + 1}`,
      title: `Title for Question ${i + 1}`,
    };
    const question = {
      question_id: i + 1,
      type: i % 2,
      content: content,
    };
    questionList.push(question);
  }
  return questionList;
};

const generateInitialAnswers = () => {
  const initialAnswers = [];
  for (let i = 0; i < 10; i++) {
    const initialAnswer = {
      a_option: false,
      b_option: false,
      c_option: false,
      d_option: false,
    };
    initialAnswers.push(initialAnswer);
  }
  return initialAnswers;
};

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
  questionList: generateQuestionList(),
  answers: generateInitialAnswers(),
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
      a_option: `${i}a******************** ******************** ******************************** **************** *********** *********************8`,
      b_option: `${i}b问页面时：在哪里，去哪里，若是不合型网站。不合适就会引起用户操作不适（方向不明确）。 以下是索条、帮助按钮、`,
      c_option: `${i}c哪里，去哪里，怎样去的问题。 一般导航会有「侧栏导航」和「顶部导航」2 种类型。选择合适的导航#选择哪里，去哪里，怎样去的问题。 一般导航会有「侧栏导航」和「顶部导航」2 种类型。选择合适的导航#选择 文字太多会溢出 只能这样调整`,
      d_option: `${i}d侧栏导航#可导航栏固定在左侧，提高导航可见性，方便页面之间切换侧栏导航#可导航栏固定在左侧，提高导航可见性，方便页面之间切换`,
      title: `这个题目的序号为${i}导航可以解决用户在访问页面时：在哪里，去哪里，怎样去的问题。 一般导航会有「侧栏导航」和「顶部导航」2 种类型。选择合适的导航#选择合适的导航可以让用户在产品的使用过程中非常流畅，相反若是不合适就会引起用户操作不适（方向不明确）。 以下是「侧栏导航」和 「顶部导航」的区别。
      侧栏导航#可导航栏固定在左侧，提高导航可见性，方便页面之间切换； `,
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

const switch2Questions = () => {
  showOriginal.value = false;
  showQuestions.value = true;
}

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