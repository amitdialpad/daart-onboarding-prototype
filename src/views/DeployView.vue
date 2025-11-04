<template>
  <div class="deploy-view">
    <!-- Integration Info (Live Agents) -->
    <div v-if="agent.status === 'live' && !showReviewBeforeRepublish" class="integration-state">
      <div class="integration-header">
        <h1>Integration & Setup</h1>
        <p class="integration-description">Your agent is live. Use the information below to integrate with your systems.</p>
      </div>

      <div class="integration-content">
        <!-- Setup Instructions -->
        <div class="integration-section">
          <h2>Setup Instructions</h2>

          <div v-if="agent.agentType === 'phone'" class="setup-instructions">
            <div class="instruction-box">
              <h3>1. Your Phone Number</h3>
              <p class="phone-number-display">{{ agent.phoneNumber || '+1 (555) 123-4567' }}</p>
              <p>Customers can now call this number to reach your agent.</p>
            </div>

            <div class="instruction-box">
              <h3>2. Test Your Agent</h3>
              <p>Call the number above to test the live experience. All calls will be recorded and appear in your Monitor tab.</p>
            </div>

            <div class="instruction-box">
              <h3>3. Share With Your Team</h3>
              <p>Update your website, marketing materials, and customer communications with the new phone number.</p>
            </div>
          </div>

          <div v-else class="setup-instructions">
            <div class="instruction-box">
              <h3>1. Add Chat Widget to Your Website</h3>
              <pre class="code-snippet">&lt;script src="https://cdn.dialpad.com/agents/widget.js"&gt;&lt;/script&gt;
&lt;script&gt;
  DialpadAgents.init({
    agentId: '{{ agent.id }}',
    position: '{{ agent.chatPosition || 'bottom-right' }}'
  });
&lt;/script&gt;</pre>
              <button class="copy-button">Copy Code</button>
            </div>

            <div class="instruction-box" v-if="agent.smsEnabled">
              <h3>2. SMS Number</h3>
              <p class="phone-number-display">{{ agent.smsNumber || '+1 (555) 987-6543' }}</p>
              <p>Customers can text this number to reach your agent. Auto-replies are {{ agent.smsAutoReply ? 'enabled' : 'disabled' }}.</p>
            </div>

            <div class="instruction-box">
              <h3>{{ agent.smsEnabled ? '3' : '2' }}. Monitor Performance</h3>
              <p>Track conversations, response times, and customer satisfaction in the Monitor tab.</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="integration-actions">
          <button class="btn-primary" @click="goToMonitor">
            Start Monitoring
          </button>
        </div>
      </div>
    </div>

    <!-- Deploy Review State (Draft Agents) -->
    <div v-else class="deploy-content">
      <div class="deploy-header">
        <button class="back-button" @click="goBack">← Back</button>
        <h1>Review & Publish</h1>
        <p class="deploy-description">Confirm your agent configuration before publishing it live.</p>
      </div>

      <div class="deploy-layout">
        <!-- Main Content -->
        <div class="deploy-main">
          <!-- Agent Summary -->
          <div class="config-section">
            <h2>Agent Overview</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Name</span>
                <span class="summary-value">{{ agent.name }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Type</span>
                <span class="summary-value">{{ agent.agentType === 'phone' ? 'Voice Agent' : 'Digital Agent' }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Channels</span>
                <span class="summary-value">
                  {{ getChannelsSummary() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Configuration Completeness -->
          <div class="config-section">
            <h2>Configuration Checklist</h2>
            <div class="checklist">
              <div class="checklist-item" :class="{ complete: agent.instructions }">
                <span class="checkbox">{{ agent.instructions ? '✓' : '○' }}</span>
                <span>Instructions configured</span>
              </div>
              <div class="checklist-item" :class="{ complete: agent.knowledgeBase }">
                <span class="checkbox">{{ agent.knowledgeBase ? '✓' : '○' }}</span>
                <span>Knowledge base added</span>
              </div>
              <div class="checklist-item" :class="{ complete: hasSkills }">
                <span class="checkbox">{{ hasSkills ? '✓' : '○' }}</span>
                <span>Skills configured</span>
              </div>
              <div v-if="agent.agentType === 'phone'" class="checklist-item" :class="{ complete: agent.phoneNumber }">
                <span class="checkbox">{{ agent.phoneNumber ? '✓' : '○' }}</span>
                <span>Phone number assigned</span>
              </div>
              <div v-if="agent.agentType === 'chat' && agent.smsEnabled" class="checklist-item" :class="{ complete: agent.smsNumber }">
                <span class="checkbox">{{ agent.smsNumber ? '✓' : '○' }}</span>
                <span>SMS number configured</span>
              </div>
            </div>

            <!-- Warning if SMS enabled but not configured -->
            <div v-if="agent.agentType === 'chat' && agent.smsEnabled && !agent.smsNumber" class="warning-box">
              ⚠️ SMS is enabled but no phone number is configured. Please add a phone number in the Build tab before publishing.
            </div>
          </div>

          <!-- What Happens When You Publish -->
          <div class="config-section">
            <h2>What happens when you publish?</h2>
            <ul class="publish-info-list">
              <li v-if="agent.agentType === 'phone'">Your agent will start answering calls immediately on {{ agent.phoneNumber || 'your assigned phone number' }}</li>
              <li v-else>Your chat widget will go live on your website</li>
              <li v-if="agent.agentType === 'chat' && agent.smsEnabled">SMS messaging will be enabled on {{ agent.smsNumber || 'your assigned number' }}</li>
              <li>All conversations will be recorded and visible in the Monitor tab</li>
              <li>You can unpublish your agent at any time to make changes</li>
              <li>Usage will be tracked and billed according to your plan</li>
            </ul>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="deploy-sidebar">
          <!-- Trial Status -->
          <div class="sidebar-box">
            <h3>Free Trial Active</h3>
            <div class="trial-info">
              <div class="trial-stat">
                <span class="stat-label">Conversations Remaining</span>
                <span class="stat-value">847</span>
              </div>
              <div class="trial-stat">
                <span class="stat-label">Days Remaining</span>
                <span class="stat-value">23 days</span>
              </div>
              <div class="trial-stat">
                <span class="stat-label">Current Balance</span>
                <span class="stat-value">$445.00</span>
              </div>
            </div>
            <p class="trial-note">Trial ends when you reach 1,000 conversations OR 30 days (whichever comes first).</p>
          </div>

          <!-- Billing -->
          <div class="sidebar-box">
            <h3>Estimated Usage Cost</h3>
            <p>Based on your current configuration:</p>
            <ul class="billing-list">
              <li>${{ agent.agentType === 'phone' ? '0.10' : '0.05' }} per conversation</li>
              <li v-if="agent.agentType === 'phone'">Charged per minute of voice</li>
              <li v-else>Charged per chat session</li>
              <li>No setup fees or minimums</li>
            </ul>
            <p style="margin-top: 12px; font-size: 13px; color: #666;">You can add more credits anytime from the Billing page.</p>
          </div>

          <!-- Publish Button -->
          <button
            class="btn-publish"
            @click="publishAgent"
            :disabled="!canPublish">
            {{ canPublish ? 'Publish Agent' : 'Complete Configuration' }}
          </button>

          <button class="btn-cancel" @click="goBack">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const agent = ref({})

onMounted(() => {
  loadAgent()
})

function loadAgent() {
  const agents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  const found = agents.find(a => a.id === route.params.id)
  if (found) {
    agent.value = found
  } else {
    // Agent not found, redirect back
    router.push('/agents-v2')
  }
}

const hasSkills = computed(() => {
  return agent.value.skills && agent.value.skills.length > 0
})

const canPublish = computed(() => {
  // Must have instructions at minimum
  if (!agent.value.instructions) return false

  // If SMS is enabled for chat agents, must have SMS number
  if (agent.value.agentType === 'chat' && agent.value.smsEnabled && !agent.value.smsNumber) {
    return false
  }

  return true
})

function getChannelsSummary() {
  const channels = []

  if (agent.value.agentType === 'phone') {
    channels.push('Phone')
  } else {
    channels.push('Web Chat')
    if (agent.value.smsEnabled) {
      channels.push('SMS')
    }
  }

  return channels.join(', ')
}

function publishAgent() {
  if (!canPublish.value) return

  // Update agent status
  agent.value.status = 'live'
  if (!agent.value.hasBeenPublished) {
    agent.value.firstPublishedDate = new Date().toISOString()
    agent.value.hasBeenPublished = true
  }
  agent.value.lastPublishedDate = new Date().toISOString()

  // Save to localStorage
  const agents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  const index = agents.findIndex(a => a.id === agent.value.id)
  if (index !== -1) {
    agents[index] = agent.value
    localStorage.setItem('daart-agents', JSON.stringify(agents))
  }

  // Reload agent to trigger integration info display
  loadAgent()
}

function goToMonitor() {
  router.push(`/agents-v2/${agent.value.id}/monitor`)
}

function goBack() {
  router.push(`/agents-v2/${agent.value.id}/build`)
}
</script>

<style scoped>
.deploy-view {
  background: #fff;
  min-height: 100vh;
}

/* Deploy Review State */
.deploy-content {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

.deploy-header {
  margin-bottom: 40px;
}

.back-button {
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 8px 0;
  transition: color 0.2s;
}

.back-button:hover {
  color: #000;
}

.deploy-header h1 {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.deploy-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.deploy-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
}

.deploy-main {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.config-section {
  padding: 32px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.config-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}

.checklist-item.complete {
  border-color: #4caf50;
  background: #f1f8f4;
  color: #000;
}

.checkbox {
  font-size: 18px;
  font-weight: 600;
  color: #4caf50;
}

.checklist-item:not(.complete) .checkbox {
  color: #ccc;
}

.warning-box {
  margin-top: 16px;
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  font-size: 14px;
  line-height: 1.5;
}

.publish-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.publish-info-list li {
  padding-left: 24px;
  position: relative;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.publish-info-list li:before {
  content: '•';
  position: absolute;
  left: 8px;
  color: #666;
}

/* Review Content */
.review-content {
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
}

.review-text {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
}

/* Skills List */
.skills-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #ddd;
}

.skill-icon {
  font-size: 16px;
}

.skill-name {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

/* Settings Grid */
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
}

.setting-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.setting-value {
  font-size: 14px;
  font-weight: 500;
  color: #000;
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: inline-block;
}

/* Test Scenarios */
.scenarios-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scenario-item {
  padding: 16px;
  background: #fff;
  border: 1px solid #ddd;
}

.scenario-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.scenario-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50%;
}

.scenario-name {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.scenario-description {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  padding-left: 36px;
}

/* Sidebar */
.deploy-sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: sticky;
  top: 24px;
  align-self: flex-start;
}

.sidebar-box {
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.sidebar-box h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.sidebar-box p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.trial-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.trial-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.trial-note {
  font-size: 12px !important;
  color: #999 !important;
  margin-top: 16px !important;
}

.billing-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.billing-list li {
  font-size: 13px;
  color: #666;
  padding-left: 16px;
  position: relative;
}

.billing-list li:before {
  content: '•';
  position: absolute;
  left: 0;
}

.btn-publish {
  width: 100%;
  padding: 16px 24px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-publish:hover:not(:disabled) {
  background: #333;
}

.btn-publish:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-cancel {
  width: 100%;
  padding: 12px 24px;
  background: #fff;
  color: #666;
  border: 1px solid #ddd;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #000;
  color: #000;
}

/* Integration State (Live Agents) */
.integration-state {
  padding: 60px 40px;
  max-width: 900px;
  margin: 0 auto;
}

.integration-header {
  margin-bottom: 48px;
}

.integration-header h1 {
  font-size: 36px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.integration-description {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.integration-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.integration-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.setup-instructions {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.instruction-box {
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.instruction-box h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.instruction-box p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.phone-number-display {
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #000 !important;
  margin: 12px 0 !important;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
}

.code-snippet {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 16px;
  font-family: 'SF Mono', Monaco, 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 12px 0;
  white-space: pre;
}

.copy-button {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-button:hover {
  border-color: #000;
}

.integration-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #000;
  color: #fff;
  border: 2px solid #000;
}

.btn-primary:hover {
  background: #333;
  border-color: #333;
}

.btn-secondary {
  background: #fff;
  color: #000;
  border: 2px solid #ddd;
}

.btn-secondary:hover {
  border-color: #000;
}
</style>
