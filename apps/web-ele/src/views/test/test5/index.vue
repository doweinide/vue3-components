<script lang="ts" setup>
import { ref } from 'vue';

import axios from 'axios';

const file = ref<File | null>(null);
const fileHash = ref<string>('');
const chunkSize = 5 * 1024 * 1024; // 每个分块大小（5MB）
const uploadedChunks = ref<number[]>([]);
const progress = ref<number>(0);
const paused = ref<boolean>(false);
const uploading = ref<boolean>(false);

// API 路径
const uploadChunkApi = ref<string>('http://127.0.0.1:8000/upload/upload/files');
const getUploadedChunksApi = ref<string>(
  'http://127.0.0.1:8000/upload/upload/uploaded-chunks',
);
const completeUploadApi = ref<string>(
  'http://127.0.0.1:8000/upload/upload/complete',
);

// 监听文件变化
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
  console.log(file.value);
  if (file.value) {
    calculateFileHash();
  }
};

// 计算文件哈希（简单示例）
const calculateFileHash = async () => {
  if (!file.value) return;
  const buffer = await file.value.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  fileHash.value = [...new Uint8Array(hashBuffer)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  await checkUploadedChunks();
};

// 检查已上传的分块或是否已完成
const checkUploadedChunks = async () => {
  try {
    const response = await axios.get(getUploadedChunksApi.value, {
      params: { fileHash: fileHash.value },
    });

    if (response.data.uploadedChunks === 'completed') {
      alert('文件已上传完成！');
      progress.value = 100; // 设置进度为 100%
      return true; // 文件已完成上传
    }

    uploadedChunks.value = response.data.uploadedChunks || [];
    return false; // 文件未完成上传
  } catch (error) {
    console.error('Error checking uploaded chunks:', error);
    return false;
  }
};

// 开始上传
const startUpload = async () => {
  if (!file.value) return;
  paused.value = false;
  uploading.value = true;

  // 检查是否已上传完成
  const isCompleted = await checkUploadedChunks();
  if (isCompleted) {
    uploading.value = false;
    return;
  }

  const totalChunks = Math.ceil(file.value.size / chunkSize);
  for (let i = 0; i < totalChunks; i++) {
    if (paused.value) break;
    if (uploadedChunks.value.includes(i)) {
      progress.value = ((i + 1) / totalChunks) * 100;
      continue; // 跳过已上传的分块
    }
    const chunk = file.value.slice(i * chunkSize, (i + 1) * chunkSize);
    const formData = new FormData();
    formData.append('file', chunk);
    formData.append('chunkIndex', i.toString());
    formData.append('fileHash', fileHash.value);
    formData.append('totalChunks', totalChunks.toString());

    try {
      await axios.post(uploadChunkApi.value, formData);
      uploadedChunks.value.push(i);
      progress.value = ((i + 1) / totalChunks) * 100;
    } catch (error) {
      console.error('Error uploading chunk:', error);
      paused.value = true;
      break;
    }
  }

  if (!paused.value && progress.value === 100) {
    completeUpload();
  }
  uploading.value = false;
};

// 暂停上传
const pauseUpload = () => {
  paused.value = true;
  uploading.value = false;
};

// 继续上传
const resumeUpload = () => {
  paused.value = false;
  startUpload();
};

// 合并分块
const completeUpload = async () => {
  try {
    console.log(file.value);
    await axios.post(completeUploadApi.value, {
      fileHash: fileHash.value,
      fileExtension: file.value?.name.split('.').pop(),
      fileName: file.value?.name,
    });
    alert('文件上传完成！');
  } catch (error) {
    console.error('Error completing upload:', error);
  }
};
</script>

<template>
  <div class="upload">
    <h2>断点上传</h2>
    <input type="file" @change="onFileChange" />
    <div v-if="file">
      <p>文件名: {{ file.name }}</p>
      <p>文件大小: {{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
      <progress :value="progress" max="100"></progress>
      <div class="actions">
        <button @click="startUpload" :disabled="uploading">开始上传</button>
        <button @click="pauseUpload" :disabled="!uploading">暂停上传</button>
        <button @click="resumeUpload" :disabled="uploading || !paused">
          继续上传
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upload {
  width: 400px;
  margin: 20px auto;
}

.actions {
  margin-top: 10px;
}

button {
  margin-right: 10px;
}

progress {
  width: 100%;
  height: 20px;
  margin-top: 10px;
}
</style>
