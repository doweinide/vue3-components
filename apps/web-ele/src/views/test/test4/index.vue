<script lang="ts" setup>
import { ref } from 'vue';

import axios from 'axios';

// 文件上传相关状态
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<File[]>([]);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadedFiles = ref<{ fileName: string; filePath: string }[]>([]);

// 文件选择变化处理函数
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input?.files) {
    selectedFiles.value = [...input.files];
  }
};

// 文件类型分类函数
const fileType = (file: File) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (fileExtension) {
    if (['bmp', 'gif', 'jpeg', 'jpg', 'png'].includes(fileExtension)) {
      return 'images';
    } else if (['avi', 'mkv', 'mov', 'mp4'].includes(fileExtension)) {
      return 'videos';
    } else if (['flac', 'mp3', 'wav'].includes(fileExtension)) {
      return 'audio';
    } else if (['doc', 'docx', 'pdf', 'xls', 'xlsx'].includes(fileExtension)) {
      return 'documents';
    } else if (['rar', 'tar', 'zip'].includes(fileExtension)) {
      return 'archives';
    } else {
      return 'others';
    }
  }
  return 'unknown';
};

// 上传文件函数
const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return;

  isUploading.value = true;
  uploadProgress.value = 0;

  const formData = new FormData();
  selectedFiles.value.forEach((file) => formData.append('file', file));

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/upload/upload/file',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
          }
        },
      },
    );

    // 上传成功后保存文件记录
    const uploadedFile = response.data;
    uploadedFiles.value.push({
      fileName: uploadedFile.fileName,
      filePath: uploadedFile.filePath,
    });
  } catch (error) {
    console.error('File upload failed:', error);
  } finally {
    isUploading.value = false;
  }
};
</script>

<template>
  <div class="upload-container">
    <h2>文件上传</h2>

    <!-- 文件上传按钮 -->
    <input type="file" ref="fileInput" @change="handleFileChange" multiple />

    <!-- 显示文件类型 -->
    <div v-if="selectedFiles.length > 0">
      <h3>选择的文件：</h3>
      <ul>
        <li v-for="(file, index) in selectedFiles" :key="index">
          {{ file.name }} ({{ fileType(file) }})
        </li>
      </ul>
    </div>

    <!-- 上传按钮和进度条 -->
    <button @click="uploadFiles" :disabled="isUploading">上传文件</button>
    <div v-if="isUploading" class="progress-container">
      <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
    </div>

    <!-- 成功上传文件记录 -->
    <div v-if="uploadedFiles.length > 0">
      <h3>上传成功的文件：</h3>
      <ul>
        <li v-for="(file, index) in uploadedFiles" :key="index">
          {{ file.fileName }} -
          <a :href="file.filePath" target="_blank">查看</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.upload-container {
  padding: 20px;
}

.progress-container {
  width: 100%;
  margin-top: 10px;
  background-color: #f3f3f3;
  border-radius: 5px;
}

.progress-bar {
  height: 20px;
  background-color: #4caf50;
  border-radius: 5px;
}

button {
  padding: 10px;
  margin-top: 20px;
  color: white;
  cursor: pointer;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
}

button:disabled {
  cursor: not-allowed;
  background-color: #ddd;
}

h3 {
  margin-top: 20px;
}

ul {
  padding-left: 0;
  list-style-type: none;
}

ul li {
  margin-bottom: 10px;
}
</style>
