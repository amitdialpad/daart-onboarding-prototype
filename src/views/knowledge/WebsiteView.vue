<template>
  <div class="website-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Website</h1>
        <p class="header-description">Add URLs to automatically sync content from your website</p>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <div class="info-content">
        <div class="info-text">
          Add website URLs to automatically scrape and sync content. Your agents will have access to the latest information from your website.
        </div>
      </div>
    </div>

    <!-- Add URL Section -->
    <div class="add-url-section">
      <div class="input-group">
        <input
          v-model="newUrl"
          type="url"
          class="url-input"
          placeholder="https://example.com/help"
          @keyup.enter="addWebsite">
        <button class="btn-primary" @click="addWebsite" :disabled="!newUrl.trim()">
          Add Website
        </button>
      </div>
    </div>

    <!-- Websites List -->
    <div v-if="websites.length > 0" class="websites-section">
      <div class="section-header">
        <h2>Added Websites</h2>
        <span class="website-count">{{ websites.length }} {{ websites.length === 1 ? 'site' : 'sites' }}</span>
      </div>

      <div class="websites-list">
        <div v-for="site in websites" :key="site.id" class="website-item">
          <div class="site-info">
            <div class="site-url">{{ site.url }}</div>
            <div class="site-meta">{{ site.pages}} pages • Last synced {{ site.lastSynced }}</div>
          </div>
          <div class="site-status" :class="site.status">
            {{ site.status }}
          </div>
          <button class="btn-icon-sync" @click="syncWebsite(site.id)" title="Sync now">
            ↻
          </button>
          <button class="btn-icon-delete" @click="deleteWebsite(site.id)" title="Delete">
            ×
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <h3>No websites added yet</h3>
      <p>Add a URL to automatically sync content from your website</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const websites = ref([])
const newUrl = ref('')

onMounted(() => {
  loadWebsites()
})

function loadWebsites() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  websites.value = sources.websites || []
}

function addWebsite() {
  if (!newUrl.value.trim()) return

  // Validate URL
  try {
    new URL(newUrl.value)
  } catch {
    alert('Please enter a valid URL')
    return
  }

  // Check for duplicates
  if (websites.value.some(site => site.url === newUrl.value)) {
    alert('This URL has already been added')
    return
  }

  // Add new website
  const newSite = {
    id: Date.now().toString(),
    url: newUrl.value,
    pages: Math.floor(Math.random() * 50) + 5, // Random for demo
    lastSynced: 'Just now',
    status: 'synced'
  }

  websites.value.push(newSite)
  saveWebsites()

  // Clear input
  newUrl.value = ''
}

function syncWebsite(id) {
  const site = websites.value.find(s => s.id === id)
  if (!site) return

  // Simulate sync
  site.status = 'syncing'
  saveWebsites()

  setTimeout(() => {
    site.status = 'synced'
    site.lastSynced = 'Just now'
    site.pages = Math.floor(Math.random() * 50) + 5
    saveWebsites()
  }, 2000)
}

function deleteWebsite(id) {
  if (confirm('Are you sure you want to remove this website?')) {
    websites.value = websites.value.filter(site => site.id !== id)
    saveWebsites()
  }
}

function saveWebsites() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  sources.websites = websites.value
  localStorage.setItem('daart-knowledge-sources', JSON.stringify(sources))
}
</script>

<style scoped>
.website-view {
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

/* Add URL Section */
.add-url-section {
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  gap: 12px;
}

.url-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.url-input:focus {
  outline: none;
  border-color: #000;
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
  white-space: nowrap;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Websites Section */
.websites-section {
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

.website-count {
  font-size: 13px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.websites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.website-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.website-item:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.site-info {
  flex: 1;
}

.site-url {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #0066cc;
}

.site-meta {
  font-size: 13px;
  color: #666;
}

.site-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 3px;
}

.site-status.synced {
  background: #d4f4dd;
  color: #1e7e34;
}

.site-status.syncing {
  background: #fff3cd;
  color: #856404;
}

.site-status.failed {
  background: #f8d7da;
  color: #721c24;
}

.btn-icon-sync,
.btn-icon-delete {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon-sync:hover {
  background: #0066cc;
  border-color: #0066cc;
  color: #fff;
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
