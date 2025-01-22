<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 响应式数据，用于存储接收到的 SSE 消息
const messages = ref<string[]>([]);

// 定义 EventSource 对象
let eventSource: EventSource | null = null;

// 初始化 SSE 连接
const connectToSSE = () => {
  // 先断开当前连接，确保只有一个连接
  if (eventSource) {
    eventSource.close();
  }

  const url = 'http://127.0.0.1:8000/SSE/events/'; // 替换为你的 SSE 路径
  eventSource = new EventSource(url);

  // 当接收到服务器推送的数据时触发
  eventSource.onmessage = (event) => {
    console.log('接收到消息:', event.data);
    messages.value.push(event.data); // 添加新消息到数组
  };

  // 监听错误事件，自动重连
  eventSource.onerror = () => {
    console.error('SSE 连接错误，正在尝试重新连接...');
    disconnectSSE();
    // setTimeout(connectToSSE, 5000); // 5 秒后重新连接
  };
};

// 断开 SSE 连接
const disconnectSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('SSE 连接已关闭');
  }
};

// 清空消息列表
const clearMessages = () => {
  messages.value = [];
};

// 生命周期钩子：组件挂载时建立连接
onMounted(() => {
  connectToSSE();
});

// 生命周期钩子：组件卸载时断开连接
onBeforeUnmount(() => {
  disconnectSSE();
});
</script>

<template>
  <div class="sse-demo">
    <h1>SSE 数据实时展示</h1>
    <div class="sse-content">
      <p v-if="messages.length === 0">正在等待服务器推送数据...</p>
      <ul>
        <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
      </ul>
    </div>
    <button @click="clearMessages" class="clear-button">清空消息</button>
  </div>
</template>

<style scoped>
.sse-demo {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.sse-content {
  margin: 20px 0;
}

.sse-content ul {
  padding: 0;
  list-style: none;
}

.sse-content li {
  padding: 10px;
  margin: 5px 0;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.clear-button {
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  background-color: #ff4d4f;
  border: none;
  border-radius: 5px;
}

.clear-button:hover {
  background-color: #d9363e;
}
</style>
