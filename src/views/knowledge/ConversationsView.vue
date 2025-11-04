<template>
  <div class="conversations-view">
    <div class="page-header">
      <div class="header-content">
        <h1>Conversations</h1>
        <p class="header-description">Use historical conversations to improve agent responses</p>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="info-banner">
      <div class="info-content">
        <div class="info-text">
          Enable auto-learning to automatically extract insights from successful conversations and add them to your knowledge base.
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div class="settings-section">
      <div class="setting-row">
        <div class="setting-info">
          <div class="setting-title">Auto-learn from conversations</div>
          <div class="setting-description">
            Automatically analyze conversations and extract common patterns, successful responses, and FAQs to improve agent knowledge.
          </div>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="autoLearnEnabled" @change="saveSettings">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-info">
          <div class="setting-title">Minimum conversation rating</div>
          <div class="setting-description">
            Only learn from conversations with ratings of this value or higher (1-5 stars)
          </div>
        </div>
        <select v-model="minRating" @change="saveSettings" class="rating-select">
          <option value="1">1+ stars</option>
          <option value="2">2+ stars</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="5">5 stars only</option>
        </select>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="section-header">
        <h2>Conversation Stats</h2>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ totalConversations }}</div>
            <div class="stat-label">Total Conversations</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ learnedConversations }}</div>
            <div class="stat-label">Learned From</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ avgRating.toFixed(1) }}</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ extractedInsights }}</div>
            <div class="stat-label">Insights Extracted</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Conversations Section -->
    <div class="conversations-section">
      <div class="section-header">
        <h2>Recent Conversations</h2>
        <span class="conversation-count">{{ conversations.length }} conversations</span>
      </div>

      <div v-if="conversations.length === 0" class="empty-state">
        <h3>No conversations yet</h3>
        <p>Conversations from your agents will appear here once they start handling customer interactions</p>
      </div>

      <div v-else class="conversations-list">
        <div v-for="conv in conversations" :key="conv.id" class="conversation-item">
          <div class="conv-info">
            <div class="conv-header">
              <div class="conv-agent">{{ conv.agentName }}</div>
              <div class="conv-date">{{ conv.date }}</div>
            </div>
            <div class="conv-preview">{{ conv.preview }}</div>
            <div class="conv-meta">
              <span class="conv-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= conv.rating }">★</span>
              </span>
              <span class="conv-messages">{{ conv.messageCount }} messages</span>
              <span class="conv-duration">{{ conv.duration }}</span>
            </div>
          </div>
          <div class="conv-status" :class="{ learned: conv.learned }">
            {{ conv.learned ? 'Learned' : 'Not learned' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Help Section -->
    <div class="help-section">
      <h3>How Auto-Learning Works</h3>
      <ul>
        <li><strong>Conversation Analysis:</strong> We analyze successful conversations to identify common questions and effective responses</li>
        <li><strong>Pattern Recognition:</strong> Detects frequently asked questions and the answers that received positive feedback</li>
        <li><strong>Knowledge Extraction:</strong> Automatically adds verified information to your knowledge base</li>
        <li><strong>Quality Control:</strong> Only learns from conversations that meet your minimum rating threshold</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const autoLearnEnabled = ref(true)
const minRating = ref('4')
const conversations = ref([])

// Mock stats
const totalConversations = computed(() => conversations.value.length)
const learnedConversations = computed(() => conversations.value.filter(c => c.learned).length)
const avgRating = computed(() => {
  if (conversations.value.length === 0) return 0
  const sum = conversations.value.reduce((acc, conv) => acc + conv.rating, 0)
  return sum / conversations.value.length
})
const extractedInsights = computed(() => Math.floor(learnedConversations.value * 2.5))

onMounted(() => {
  loadSettings()
  loadConversations()
})

function loadSettings() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  autoLearnEnabled.value = sources.conversations?.enabled !== false
  minRating.value = sources.conversations?.minRating || '4'
}

function loadConversations() {
  // Generate some mock conversation data for demo
  const agents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  if (agents.length === 0) return

  // Create mock conversations
  const mockConversations = [
    {
      id: '1',
      agentName: agents[0]?.name || 'Agent',
      date: '2 hours ago',
      preview: 'Customer asked about return policy and shipping times...',
      rating: 5,
      messageCount: 8,
      duration: '4m 23s',
      learned: true
    },
    {
      id: '2',
      agentName: agents[0]?.name || 'Agent',
      date: '5 hours ago',
      preview: 'Question about product availability and pricing...',
      rating: 4,
      messageCount: 12,
      duration: '6m 15s',
      learned: true
    },
    {
      id: '3',
      agentName: agents[0]?.name || 'Agent',
      date: '1 day ago',
      preview: 'Technical support question about account setup...',
      rating: 3,
      messageCount: 15,
      duration: '8m 42s',
      learned: false
    }
  ]

  conversations.value = mockConversations
}

function saveSettings() {
  const sources = JSON.parse(localStorage.getItem('daart-knowledge-sources') || '{}')
  sources.conversations = {
    enabled: autoLearnEnabled.value,
    minRating: minRating.value,
    count: conversations.value.length
  }
  localStorage.setItem('daart-knowledge-sources', JSON.stringify(sources))
}
</script>

<style scoped>
.conversations-view {
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

/* Settings Section */
.settings-section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 20px;
}

.setting-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #000;
}

.setting-description {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #000;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.rating-select {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.rating-select:focus {
  outline: none;
  border-color: #000;
}

/* Stats Section */
.stats-section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.conversation-count {
  font-size: 13px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* Conversations Section */
.conversations-section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 32px;
}

.conversations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.2s;
}

.conversation-item:hover {
  background: #f5f5f5;
  border-color: #ccc;
}

.conv-info {
  flex: 1;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.conv-agent {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.conv-date {
  font-size: 12px;
  color: #999;
}

.conv-preview {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.5;
}

.conv-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.conv-rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 14px;
}

.star.filled {
  color: #ffa500;
}

.conv-messages,
.conv-duration {
  color: #666;
}

.conv-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 3px;
  background: #f0f0f0;
  color: #666;
  white-space: nowrap;
}

.conv-status.learned {
  background: #d4f4dd;
  color: #1e7e34;
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

/* Help Section */
.help-section {
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
}

.help-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.help-section ul {
  margin: 0;
  padding-left: 20px;
}

.help-section li {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 8px;
}

.help-section li:last-child {
  margin-bottom: 0;
}
</style>
