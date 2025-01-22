<script lang="ts" setup>
import { ref } from 'vue';

interface EmailData {
  subject: string;
  message: string;
  recipients: string[];
}

const emailData = ref<EmailData>({
  subject: 'adf',
  message: 'asdf',
  recipients: ['3089013954@qq.com'],
});

const responseMessage = ref('');
const responseStatus = ref('');

const sendEmail = async () => {
  try {
    // 确保 recipients 是数组格式
    const recipients = emailData.value.recipients;
    // .split(',') // 将多个收件人邮箱通过逗号分隔
    // .map((email) => email.trim()); // 去掉邮箱两端空格

    const emailPayload = {
      ...emailData.value,
      recipients, // 使用更新后的 recipients 数组
    };

    const response = await fetch('http://127.0.0.1:8000/email/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();

    if (response.ok) {
      responseMessage.value = '邮件发送成功！';
      responseStatus.value = 'success';
    } else {
      responseMessage.value = `邮件发送失败: ${data.error || '未知错误'}`;
      responseStatus.value = 'error';
    }
  } catch (error) {
    responseMessage.value = `请求失败: ${error.message}`;
    responseStatus.value = 'error';
  }
};
</script>

<template>
  <div class="email-sender">
    <h2>发送邮件</h2>
    <form @submit.prevent="sendEmail">
      <div class="form-group">
        <label for="subject">邮件主题</label>
        <input
          v-model="emailData.subject"
          id="subject"
          type="text"
          placeholder="请输入邮件主题"
          required
        />
      </div>

      <div class="form-group">
        <label for="message">邮件内容</label>
        <textarea
          v-model="emailData.message"
          id="message"
          placeholder="请输入邮件内容"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="recipients">收件人</label>
        <input
          v-model="emailData.recipients"
          id="recipients"
          type="email"
          placeholder="请输入收件人邮箱"
          required
        />
      </div>

      <button type="submit">发送邮件</button>
    </form>

    <div v-if="responseMessage" :class="responseStatus">
      {{ responseMessage }}
    </div>
  </div>
</template>

<style scoped>
.email-sender {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.7rem;
  color: white;
  cursor: pointer;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
