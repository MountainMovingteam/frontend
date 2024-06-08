import client from '../client';

const baseURL = 'http://47.93.19.22:8000/';

export function getQuestions(question_num: number) {
    let url = baseURL + 'api/question/query/problem';
    return client.withAuth(client.POST, url, {
        data: {
            question_num: question_num
        },
    });
}

export const getAnswers = (question_num: number,
                           list: {question_id: number, student_answer: number }[]) => {
    let url = baseURL + 'api/question/query/answer';
    return client.withAuth(client.POST, url, {
        data: {
            question_num: question_num,
            list: list
        },
    });
}