<template>
    <div class="chatContainer">
        <div class="chatContent" ref="chatBox">
            <li v-for="(item, index) in info" :key="index" :class="[item.isRobot ? 'robot' : 'user']">
                <div v-if="item.isRobot" class="robotMessage">
                    <div class="cardList" v-if="item.cards">
                        <div class="cardItem" v-for="(card, cardIndex) in item.cards" :key="cardIndex"
                            @click="showDetails(card)">
                            {{ card.title }}
                        </div>
                    </div>
                    <div v-else>
                        <span>{{ item.content }}</span>
                    </div>
                </div>
                <div v-else class="userMessage">
                    <span>{{ item.content }}</span>
                </div>
                <span class="messageTime">{{ item.time }}</span>
            </li>
        </div>
        <div class="sendBox">
            <el-input v-model="msg" placeholder="请输入消息" class="input-with-select" @keyup.enter="sendMessage">
                <template #append>
                    <el-button @click="sendMessage" type="primary">发送</el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { ElInput, ElButton, ElMessage } from 'element-plus';

const msg = ref('');
const info = ref<Array<{ isRobot: boolean; content: string; time: string; cards?: Array<{ title: string; details: string }> }>>([]);

// Function to send message
function sendMessage() {
    if (!msg.value.trim()) {
        ElMessage({ message: '不能发送空消息！', type: 'error' });
        return;
    }

    // Simulate user message
    info.value.push({ isRobot: false, content: msg.value.trim(), time: getTime() });

    // Simulate robot reply with cards
    const cards = [
        { title: '卡片一', details: '卡片一的详细内容' },
        { title: '卡片二', details: '卡片二的详细内容' },
        { title: '卡片三', details: '卡片三的详细内容' },
        { title: '卡片四', details: '卡片四的详细内容' },
        { title: '卡片五', details: '卡片五的详细内容' },
    ];
    info.value.push({ isRobot: true, cards: cards, time: getTime(), content: '' });

    msg.value = ''; // Clear input
    scrollToBottom();
}

// Scroll to the bottom of chat content
function scrollToBottom() {
    nextTick(() => {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
}

// Helper function to get current time
function getTime() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

// Show details of selected card
function showDetails(card: { title: string; details: string }) {
    info.value.push({
        isRobot: true,
        content: card.details,
        time: getTime(),
    });
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
    margin-bottom: 10px;
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
}

@media (max-width: 768px) {
    .cardItem {
        width: 70vw;
    }
}
</style>
