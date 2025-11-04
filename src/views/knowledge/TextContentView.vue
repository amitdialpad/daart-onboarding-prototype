<template>
  <div class="knowledge-view">
    <div class="knowledge-header">
      <div class="header-content">
        <h1>Text Content</h1>
        <p class="header-description">Add policies, FAQs, and product information that your agents can reference</p>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <div class="info-content">
        <div class="info-text">
          <strong>Shared across all agents:</strong> This knowledge base is used by all {{ agentCount }} of your agents. Any changes you make here will update the knowledge available to every agent.
        </div>
      </div>
    </div>

    <!-- Knowledge Editor -->
    <div class="knowledge-editor">
      <div class="editor-header">
        <h2>Content Editor</h2>
        <div class="editor-meta">
          <span class="last-updated">Last updated: {{ lastUpdated }}</span>
          <button v-if="hasChanges" @click="saveKnowledge" class="btn-save" :disabled="isSaving">
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div class="editor-help">
        <p>Add information about your products, services, policies, and common questions. This content will be available to all your agents.</p>
      </div>

      <textarea
        v-model="knowledgeContent"
        @input="handleInput"
        class="knowledge-textarea"
        placeholder="Enter your knowledge base content here...

Example:
Company: Acme Inc.
Website: www.acme.com
Support Hours: Monday-Friday, 9 AM - 5 PM EST

Products:
- Widget Pro: Our flagship product for businesses
- Widget Lite: Perfect for individual users

Policies:
- Returns: 30-day money-back guarantee
- Shipping: Free shipping on orders over $50">
      </textarea>

      <div class="editor-footer">
        <div class="character-count">
          {{ knowledgeContent.length.toLocaleString() }} characters
        </div>
      </div>
    </div>

    <!-- Agents Using This Knowledge -->
    <div class="agents-using-section">
      <h2>Agents Using This Knowledge</h2>
      <p class="section-description">All agents automatically use this knowledge base</p>

      <div v-if="agents.length === 0" class="empty-state">
        <p>No agents created yet. <a href="#/onboarding-v2">Create your first agent</a></p>
      </div>

      <div v-else class="agents-grid">
        <div v-for="agent in agents" :key="agent.id" class="agent-card">
          <div class="agent-info">
            <div class="agent-name">{{ agent.name }}</div>
            <div class="agent-meta">
              <span class="agent-status" :class="agent.status">{{ agent.status === 'live' ? 'Live' : 'Draft' }}</span>
              <span class="agent-type">{{ getAgentType(agent) }}</span>
            </div>
          </div>
          <a :href="`#/agents-v2/${agent.id}/build`" class="agent-link">View →</a>
        </div>
      </div>
    </div>

    <!-- Tips Section -->
    <div class="tips-section">
      <h3>💡 Tips for Better Knowledge Bases</h3>
      <ul>
        <li><strong>Be specific:</strong> Include detailed information about your products, services, and policies</li>
        <li><strong>Stay current:</strong> Update your knowledge base when products or policies change</li>
        <li><strong>Use clear language:</strong> Write in simple, direct sentences that AI can easily understand</li>
        <li><strong>Include common questions:</strong> Add FAQs and their answers to help agents respond accurately</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const knowledgeContent = ref('')
const originalContent = ref('')
const agents = ref([])
const isSaving = ref(false)
const lastUpdated = ref('Never')

const hasChanges = computed(() => knowledgeContent.value !== originalContent.value)
const agentCount = computed(() => agents.value.length)

onMounted(() => {
  loadKnowledge()
  loadAgents()
})

function loadKnowledge() {
  // Load organization-level knowledge base
  const orgKnowledge = localStorage.getItem('daart-org-knowledge')
  if (orgKnowledge) {
    const parsed = JSON.parse(orgKnowledge)
    knowledgeContent.value = parsed.content || ''
    originalContent.value = parsed.content || ''
    lastUpdated.value = parsed.updatedAt ? formatDate(parsed.updatedAt) : 'Never'
  }
}

function loadAgents() {
  agents.value = JSON.parse(localStorage.getItem('daart-agents') || '[]')
}

function handleInput() {
  // Auto-save functionality could be added here
}

function saveKnowledge() {
  isSaving.value = true

  // Save to localStorage
  const orgKnowledge = {
    content: knowledgeContent.value,
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem('daart-org-knowledge', JSON.stringify(orgKnowledge))

  // Update originalContent to mark as saved
  originalContent.value = knowledgeContent.value
  lastUpdated.value = formatDate(orgKnowledge.updatedAt)

  // Simulate save delay
  setTimeout(() => {
    isSaving.value = false
  }, 500)
}

function getAgentType(agent) {
  if (agent.agentType === 'phone') return 'Voice Agent'
  if (agent.channels?.voice?.enabled) return 'Voice Agent'
  return 'Digital Agent'
}

function formatDate(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}
</script>

<style scoped>
.knowledge-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

.knowledge-header {
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

/* Knowledge Editor */
.knowledge-editor {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 40px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.editor-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.editor-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.last-updated {
  font-size: 13px;
  color: #666;
}

.btn-save {
  padding: 8px 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #333;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.editor-help {
  margin-bottom: 16px;
}

.editor-help p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.knowledge-textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
}

.knowledge-textarea:focus {
  outline: none;
  border-color: #000;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.character-count {
  font-size: 12px;
  color: #999;
}

/* Agents Using Section */
.agents-using-section {
  margin-bottom: 40px;
}

.agents-using-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 24px 0;
}

.empty-state {
  padding: 40px;
  text-align: center;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.empty-state p {
  margin: 0;
  color: #666;
}

.empty-state a {
  color: #0066cc;
  text-decoration: none;
}

.empty-state a:hover {
  text-decoration: underline;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.agent-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: all 0.2s;
}

.agent-card:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.agent-info {
  flex: 1;
}

.agent-name {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 6px;
}

.agent-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.agent-status {
  padding: 2px 8px;
  border-radius: 3px;
  font-weight: 500;
  text-transform: uppercase;
}

.agent-status.live {
  background: #d4f4dd;
  color: #1e7e34;
}

.agent-status.draft {
  background: #f0f0f0;
  color: #666;
}

.agent-type {
  color: #666;
}

.agent-link {
  font-size: 14px;
  color: #0066cc;
  text-decoration: none;
  font-weight: 500;
}

.agent-link:hover {
  text-decoration: underline;
}

/* Tips Section */
.tips-section {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
}

.tips-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.tips-section ul {
  margin: 0;
  padding-left: 20px;
}

.tips-section li {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 8px;
}

.tips-section li:last-child {
  margin-bottom: 0;
}
</style>
