<template>
  <div class="documents-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Documents</h1>
        <p class="header-description">Upload PDFs, Word documents, spreadsheets, and text files</p>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <div class="info-content">
        <div class="info-text">
          All documents are automatically processed and made available to your agents. Supported formats: PDF, DOCX, TXT, CSV (max 10MB each).
        </div>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="upload-section">
      <div class="upload-box">
        <div class="upload-text">Drag and drop files here, or click to browse</div>
        <button class="btn-primary" @click="handleUploadClick">Upload Documents</button>
        <div class="upload-hint">Supports PDF, TXT, CSV, DOCX (max 10MB each)</div>
        <input ref="fileInput" type="file" multiple accept=".pdf,.txt,.csv,.docx,.doc" style="display: none" @change="handleFileSelect">
      </div>
    </div>

    <!-- Documents List -->
    <div v-if="documents.length > 0" class="documents-section">
      <div class="section-header">
        <h2>Uploaded Documents</h2>
        <span class="document-count">{{ documents.length }} {{ documents.length === 1 ? 'file' : 'files' }}</span>
      </div>

      <div class="documents-list">
        <div v-for="doc in documents" :key="doc.id" class="document-item">
          <div class="doc-info">
            <div class="doc-name">{{ doc.name }}</div>
            <div class="doc-meta">{{ doc.size }} • Uploaded {{ doc.uploadedAt }} • {{ doc.topics }} topics extracted</div>
          </div>
          <div class="doc-status" :class="doc.status">
            {{ doc.status }}
          </div>
          <button class="btn-icon-delete" @click="deleteDocument(doc.id)" title="Delete">
            ×
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h3>No documents uploaded yet</h3>
      <p>Upload your first document to make it available to your agents</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const documents = ref([])
const fileInput = ref(null)

onMounted(() => {
  loadDocuments()
})

function loadDocuments() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  documents.value = sources.documents || []
}

function handleUploadClick() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files || [])

  files.forEach(file => {
    // Simulate upload
    const newDoc = {
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      uploadedAt: 'Just now',
      topics: Math.floor(Math.random() * 20) + 5, // Random for demo
      status: 'ready'
    }

    documents.value.push(newDoc)
  })

  // Save to localStorage
  saveDocuments()

  // Clear input
  event.target.value = ''
}

function deleteDocument(id) {
  if (confirm('Are you sure you want to delete this document?')) {
    documents.value = documents.value.filter(doc => doc.id !== id)
    saveDocuments()
  }
}

function saveDocuments() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  sources.documents = documents.value
  localStorage.setItem('daart-knowledge-sources', JSON.stringify(sources))
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

</script>

<style scoped>
.documents-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

.page-header {
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.header-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Info Banner */
.info-banner {
  padding: 16px 20px;
  background: #f0f7ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  margin-bottom: 32px;
}

.info-content {
  flex: 1;
}

.info-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

/* Upload Section */
.upload-section {
  margin-bottom: 40px;
}

.upload-box {
  border: 2px dashed #ddd;
  padding: 60px 40px;
  text-align: center;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.upload-box:hover {
  border-color: #999;
  background: #f5f5f5;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.btn-primary {
  padding: 12px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 12px;
}

.btn-primary:hover {
  background: #333;
}

.upload-hint {
  font-size: 13px;
  color: #999;
}

/* Documents Section */
.documents-section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.document-count {
  font-size: 13px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.document-item:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.doc-info {
  flex: 1;
}

.doc-name {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #000;
}

.doc-meta {
  font-size: 13px;
  color: #666;
}

.doc-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 3px;
}

.doc-status.ready {
  background: #d4f4dd;
  color: #1e7e34;
}

.doc-status.processing {
  background: #fff3cd;
  color: #856404;
}

.doc-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.btn-icon-delete {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 20px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-delete:hover {
  background: #ff4444;
  border-color: #ff4444;
  color: #fff;
}

/* Empty State */
.empty-state {
  padding: 80px 40px;
  text-align: center;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #666;
  margin: 0;
}
</style>
