<template>
    <div class="chatContainer" style="margin-top: 30px;">
        <div class="chatContent" ref="chatBox">
            <li v-for="(item, index) in info" :key="index" :class="[item.isRobot ? 'robot' : 'user']">
                <div style="display: flex;">
                    <div v-if="item.isRobot" class="avatar">
                        <img src="../../../public/logo.png">
                    </div>
                    <div style="display: block;" v-if="item.isRobot">
                        <div class="robotMessage">
                            <div class="cardList" v-if="item.cards">
                                <div class="cardItem" v-for="(card, cardIndex) in item.cards" :key="cardIndex"
                                    @click="showDetails(card)">
                                    {{ card.content }}
                                </div>
                            </div>
                            <div v-else>
                                <span>{{ item.content }}</span>
                            </div>
                        </div>
                        <span class="messageTime">{{ item.time }}</span>
                    </div>
                </div>
                <div style="display: flex;">
                    <div style="display: block;" v-if="!item.isRobot">
                        <div class="userMessage">
                            <span>{{ item.content }}</span>
                        </div>
                        <span class="messageTime">{{ item.time }}</span>
                    </div>
                    <div v-if="!item.isRobot" class="avatar">
                        <img :src="avatar">
                    </div>

                </div>
            </li>
        </div>
        <div class="sendBox">
            <el-input v-model="msg" placeholder="输入问题关键词获取相关问题" class="input-with-select" @keyup.enter="sendMessage">
                <template #append>
                    <el-button @click="sendMessage" type="primary">发送</el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';
import { search, answer, reqAvatar } from '/@/api/QandA';

const msg = ref('');
const avatar = ref('');
const info = ref<Array<{ isRobot: boolean; content: string; time: string; cards?: Array<{ problem_id: number; content: string }> }>>([]);

onMounted(async () => {
    await reqAvatar().then((res) => {
        avatar.value = 'http://47.93.19.22:8000' + res.data.avatar_url;
    });

    info.value.push({ isRobot: true, content: "输入问题关键词获取相关问题，点击即可获取回答，例：输入'体验馆'", time: getTime() });
    scrollToBottom();
});

async function sendMessage() {
    if (!msg.value.trim()) {
        ElMessage({ message: '不能发送空消息！', type: 'error' });
        return;
    }

    info.value.push({ isRobot: false, content: msg.value.trim(), time: getTime() });

    const result = await search({ keywords: msg.value.trim() });

    if (result.data.num == 0 || result.status != 200) {
        info.value.push({ isRobot: true, content: '对不起，我无法回答您的问题。', time: getTime() });
    } else {
        let cards: any = [];
        for (let i = 0; i < result.data.num; i++) {
            if (result.status == 200) {
                cards.push({ problem_id: result.data.list[i].problem_id, content: result.data.list[i].content });
            }
        }
        info.value.push({ isRobot: true, cards: cards, time: getTime(), content: '' });
    }

    msg.value = '';
    scrollToBottom();
}

function scrollToBottom() {
    nextTick(() => {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
}

function getTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

async function showDetails(card: { problem_id: number; content: string }) {
    const result = await answer({ problem_id: card.problem_id });
    if (result.status != 200) {
        ElMessage({ message: '无法获取答案，请稍后重试。', type: 'error' });
    } else {
        info.value.push({
            isRobot: true,
            content: result.data.answer,
            time: getTime(),
        });
    }

    scrollToBottom();
}
</script>

<style scoped>
.chatContainer {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.chatContent {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.user {
    align-items: flex-end;
}

.user .userMessage {
    background-color: #d3e3fc;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
    max-width: 60%;
    /* 控制消息框的最大宽度 */
    word-wrap: break-word;
    word-break: break-all;
}

.robot {
    align-items: flex-start;
}

.robot .robotMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 5px;
}

.cardList {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cardItem {
    cursor: pointer;
    padding: 15px;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    transition: background-color 0.3s ease;
}

.cardItem:hover {
    background-color: #f9f9f9;
}

.messageTime {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
    float: right;
}

.sendBox {
    padding: 10px;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    position: sticky;
    bottom: 0;
}

.input-with-select {
    flex: 1;
    margin-right: 10px;
}

@media (min-width: 769px) {
    .cardItem {
        width: 45vw;
    }

    .robot .robotMessage {
        max-width: 90vh;
    }
}

@media (max-width: 768px) {
    .cardItem {
        width: 70vw;
    }

    .robot .robotMessage {
        max-width: 40vh;
    }
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    margin-bottom: 10px;
    margin-top: -10px;
    margin-left: 10px;
}

.avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}
</style>
