<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue';

export default defineComponent({
  name: 'WebSocketPage',
  setup() {
    // 定义 WebSocket 地址
    const wsUrl = 'ws://127.0.0.1:8000/ws/chat/someroot/';
    const socket = new WebSocket(wsUrl);

    // 定义状态变量
    const status = ref<string>('未连接');
    const serverMessage = ref<string>('无');
    const message = ref<string>('');

    // WebSocket 事件处理
    socket.addEventListener('open', () => {
      status.value = '连接成功';
      console.log('WebSocket connection opened');
    });

    socket.onmessage = (event) => {
      serverMessage.value = event.data;
      console.log('Message from server:', event.data);
    };

    socket.addEventListener('close', () => {
      status.value = '连接关闭';
      console.log('WebSocket connection closed');
    });

    // 发送消息
    const sendMessage = () => {
      if (socket.readyState === WebSocket.OPEN && message.value.trim() !== '') {
        socket.send(JSON.stringify({ message: message.value }));
        console.log('Message sent:', message.value);
        message.value = ''; // 清空输入框
      } else {
        console.warn('WebSocket 未连接或消息为空');
      }
    };

    // 组件销毁时关闭 WebSocket
    onUnmounted(() => {
      socket.close();
    });

    return {
      status,
      serverMessage,
      message,
      sendMessage,
    };
  },
});
</script>

<template>
  <div class="websocket-page">
    <h1>WebSocket 示例</h1>
    <div>
      <p>状态: {{ status }}</p>
      <p>服务器消息: {{ serverMessage }}</p>
    </div>
    <input
      v-model="message"
      placeholder="请输入消息"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<style scoped>
.websocket-page {
  margin: 20px;
  font-family: Arial, sans-serif;
}

input {
  width: 200px;
  padding: 5px;
  margin-right: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
}

p {
  margin: 5px 0;
}
</style>
