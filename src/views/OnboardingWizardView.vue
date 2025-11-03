<template>
  <div class="onboarding-container">
    <!-- Progress Bar -->
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- Step Indicators -->
    <div class="step-indicators">
      <div v-for="(step, index) in steps"
           :key="index"
           class="step-indicator"
           :class="{
             active: currentStep === index,
             completed: currentStep > index || (currentStep === 2 && index < 2)
           }">
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-label">{{ step.label }}</div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Step 1: Agent Type Selection (with Welcome) -->
      <div v-if="currentStep === 0" class="step-view">
        <div class="welcome-header">
          <h1>Build Your Agent</h1>
          <p class="subtitle">Create your first AI agent in under 2 minutes</p>
        </div>

        <h2 class="section-title">What type of agent do you want to create?</h2>
        <p class="section-subtitle">Choose how your agent will communicate with customers</p>

        <div class="agent-type-grid">
          <div class="agent-type-option"
               :class="{ selected: agentType === 'phone' }"
               @click="agentType = 'phone'">
            <div class="agent-type-name">Voice Agent</div>
            <div class="agent-type-desc">
              Your agent handles phone calls and voice conversations
            </div>
            <div class="agent-type-benefits">
              <div class="benefit-label">Best for:</div>
              <ul>
                <li>Call centers</li>
                <li>Appointment booking</li>
                <li>Customer support lines</li>
              </ul>
            </div>
            <div v-if="agentType === 'phone'" class="checkmark">✓</div>
          </div>

          <div class="agent-type-option"
               :class="{ selected: agentType === 'chat' }"
               @click="agentType = 'chat'">
            <div class="agent-type-name">Digital Agent</div>
            <div class="agent-type-desc">
              Your agent handles text-based conversations across multiple channels
            </div>
            <div class="agent-type-benefits">
              <div class="benefit-label">Best for:</div>
              <ul>
                <li>Website chat, SMS, WhatsApp</li>
                <li>Support & sales inquiries</li>
                <li>Quick responses</li>
              </ul>
            </div>
            <div v-if="agentType === 'chat'" class="checkmark">✓</div>
          </div>
        </div>
      </div>

      <!-- Step 2: Choose Template -->
      <div v-if="currentStep === 1" class="step-view">
        <h1>Choose a Template</h1>
        <p class="subtitle">Start with a pre-built agent or create from scratch</p>

        <div class="templates-grid">
          <div v-for="template in filteredTemplates"
               :key="template.id"
               class="template-card"
               :class="{ selected: selectedTemplate === template.id }">
            <div @click="selectTemplate(template.id)">
              <div class="template-header">
                <div class="template-name">{{ template.name }}</div>
                <div v-if="selectedTemplate === template.id" class="checkmark">✓</div>
              </div>
              <div class="template-desc">{{ template.description }}</div>

              <!-- Metadata Display -->
              <div class="template-metadata">
                <div class="metadata-item">
                  Knowledge: {{ getTemplateMetadata(template).knowledgeCount }} document{{ getTemplateMetadata(template).knowledgeCount !== 1 ? 's' : '' }} • {{ getTemplateMetadata(template).totalSize }} • {{ getTemplateMetadata(template).totalTopics }} topics
                </div>
                <div class="metadata-item">
                  Skills: {{ getTemplateMetadata(template).skillsCount }} configured
                </div>
                <div class="metadata-item">
                  Scenarios: {{ getTemplateMetadata(template).scenariosCount }} test scenario{{ getTemplateMetadata(template).scenariosCount !== 1 ? 's' : '' }}
                </div>
                <div class="metadata-item instructions-preview">
                  Instructions: "{{ getInstructionsPreview(template) }}"
                </div>
              </div>

              <div class="template-channels">
                <span v-for="channel in template.channels" :key="channel" class="channel-badge">
                  {{ channelLabel(channel) }}
                </span>
              </div>
            </div>

            <!-- Preview Button -->
            <a href="#" class="preview-link" @click.prevent.stop="openPreview(template.id)">
              Preview Details
            </a>
          </div>

          <div class="template-card blank"
               :class="{ selected: selectedTemplate === 'blank' }">
            <div @click="selectTemplate('blank')">
              <div class="template-header">
                <div class="template-name">Start from Scratch</div>
                <div v-if="selectedTemplate === 'blank'" class="checkmark">✓</div>
              </div>
              <div class="template-desc">Build your agent from the ground up</div>

              <!-- Blank Template Metadata -->
              <div class="template-metadata">
                <div class="metadata-item">
                  Knowledge: 0 documents
                </div>
                <div class="metadata-item">
                  Skills: 0 configured
                </div>
                <div class="metadata-item">
                  Scenarios: 0 test scenarios
                </div>
                <div class="metadata-item instructions-preview">
                  You'll configure everything yourself: instructions, knowledge base, skills, and test scenarios.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Modal -->
        <div v-if="showPreviewModal" class="preview-modal-overlay" @click="closePreview">
          <div class="preview-modal" @click.stop>
            <div class="preview-modal-header">
              <h2>{{ previewTemplate?.name }}</h2>
              <button class="close-button" @click="closePreview">×</button>
            </div>

            <div class="preview-modal-body">
              <!-- Instructions Section -->
              <div class="preview-section">
                <h3>Instructions</h3>
                <div class="preview-content">
                  {{ previewTemplate?.sampleAgent?.instructions }}
                </div>
              </div>

              <!-- Knowledge Base Section -->
              <div class="preview-section">
                <h3>Knowledge Base ({{ previewTemplate?.sampleAgent?.knowledge?.length || 0 }} document{{ (previewTemplate?.sampleAgent?.knowledge?.length || 0) !== 1 ? 's' : '' }})</h3>
                <div v-for="doc in previewTemplate?.sampleAgent?.knowledge" :key="doc.id" class="preview-knowledge-item">
                  <div class="preview-knowledge-header">
                    <strong>{{ doc.name }}</strong>
                    <span class="preview-knowledge-meta">{{ doc.size }} • {{ doc.topics }} topics</span>
                  </div>
                  <div class="preview-content-snippet">
                    {{ getContentPreview(doc.content) }}
                  </div>
                </div>
                <div v-if="!previewTemplate?.sampleAgent?.knowledge?.length" class="preview-empty">
                  No knowledge base documents included in this template.
                </div>
              </div>

              <!-- Skills Section -->
              <div class="preview-section">
                <h3>Skills ({{ previewTemplate?.sampleAgent?.skills?.length || 0 }} configured)</h3>
                <div v-for="skill in previewTemplate?.sampleAgent?.skills" :key="skill.id" class="preview-skill-item">
                  <div class="preview-skill-header">
                    <strong>{{ skill.name }}</strong>
                    <span class="preview-skill-status">{{ skill.enabled ? 'Enabled' : 'Disabled' }}</span>
                  </div>
                  <div class="preview-skill-desc">{{ skill.description }}</div>
                </div>
                <div v-if="!previewTemplate?.sampleAgent?.skills?.length" class="preview-empty">
                  No skills configured in this template.
                </div>
              </div>

              <!-- Test Scenarios Section -->
              <div class="preview-section">
                <h3>Test Scenarios ({{ previewTemplate?.sampleAgent?.testScenarios?.length || 0 }})</h3>
                <div v-for="scenario in previewTemplate?.sampleAgent?.testScenarios" :key="scenario.id" class="preview-scenario-item">
                  <div class="preview-scenario-header">
                    <strong>{{ scenario.name }}</strong>
                  </div>
                  <div class="preview-scenario-prompt">Prompt: "{{ scenario.prompt }}"</div>
                  <div class="preview-scenario-keywords">
                    Expected keywords: {{ scenario.expectedKeywords.join(', ') }}
                  </div>
                </div>
                <div v-if="!previewTemplate?.sampleAgent?.testScenarios?.length" class="preview-empty">
                  No test scenarios included in this template.
                </div>
              </div>
            </div>

            <div class="preview-modal-footer">
              <p class="preview-note">You can customize everything after selection</p>
              <div class="preview-modal-actions">
                <button class="btn-secondary" @click="closePreview">Close</button>
                <button class="btn-primary" @click="confirmTemplate(previewTemplateId)">Use This Template</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Almost Done: Final confirmation (not a numbered step) -->
      <div v-if="currentStep === 2" class="step-view">
        <div class="success-view">
          <div class="success-icon">✓</div>
          <h1>Almost Done!</h1>
          <p class="subtitle">Give your agent a name, and you're all set to customize it in the workspace</p>

          <div class="form-section center-form">
            <div class="form-group">
              <label>Agent Name</label>
              <input v-model="agentName"
                     type="text"
                     placeholder="e.g., Support Assistant, Sales Bot"
                     class="input-field"
                     @keyup.enter="goToWorkspace">
            </div>
          </div>

          <div class="success-summary">
            <div class="summary-item">
              <strong>Type:</strong> {{ agentType === 'phone' ? 'Voice Agent' : 'Digital Agent' }}
            </div>
            <div class="summary-item">
              <strong>Template:</strong> {{ templateName }}
            </div>
            <div class="summary-item">
              <strong>Status:</strong> Draft
            </div>
          </div>

          <div class="next-steps">
            <h3>What You'll Do Next in the Workspace</h3>
            <ul>
              <li>Customize agent behavior and instructions</li>
              <li>Upload your own knowledge base (docs, FAQs, URLs)</li>
              <li>Test with sample conversations</li>
              <li>Deploy and go live</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="nav-buttons">
      <button v-if="currentStep === 1"
              @click="previousStep"
              class="btn-secondary">
        ← Back
      </button>
      <div class="spacer"></div>
      <button v-if="currentStep < 2"
              @click="nextStep"
              :disabled="!canProceed"
              class="btn-primary">
        Continue →
      </button>
      <button v-if="currentStep === 2"
              @click="goToWorkspace"
              :disabled="!agentName.trim()"
              class="btn-primary">
        Go to Workspace →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { agentTemplates, createAgentFromTemplate } from '../data/templates'

const router = useRouter()

// Steps - Only 2 actual steps, then "Almost Done" confirmation screen
const steps = [
  { label: 'Agent Type' },
  { label: 'Template' }
]

const currentStep = ref(0)

const progressPercent = computed(() => {
  // Show 100% when on "Almost Done" screen (currentStep === 2)
  if (currentStep.value >= 2) return 100
  return (currentStep.value / (steps.length - 1)) * 100
})

// Agent Type selection
const agentType = ref(null) // 'phone' or 'chat'

// Template selection - filtered by agent type
const templates = agentTemplates
const selectedTemplate = ref(null)

// Preview modal state
const showPreviewModal = ref(false)
const previewTemplateId = ref(null)

const previewTemplate = computed(() => {
  if (!previewTemplateId.value) return null
  return templates.find(t => t.id === previewTemplateId.value)
})

const filteredTemplates = computed(() => {
  if (!agentType.value) return templates

  if (agentType.value === 'phone') {
    return templates.filter(t => t.channels.includes('phone'))
  } else if (agentType.value === 'chat') {
    return templates.filter(t => t.channels.includes('web-chat'))
  }

  return templates
})

function selectTemplate(templateId) {
  selectedTemplate.value = templateId

  // Pre-fill agent name from template
  if (templateId !== 'blank') {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      agentName.value = template.sampleAgent.name
    }
  } else {
    agentName.value = ''
  }
}

function channelLabel(channel) {
  const labels = {
    'web-chat': 'Web Chat',
    'phone': 'Voice',
    'sms': 'SMS'
  }
  return labels[channel] || channel
}

// Template metadata and preview functions
function getTemplateMetadata(template) {
  const knowledge = template.sampleAgent?.knowledge || []
  const skills = template.sampleAgent?.skills || []
  const scenarios = template.sampleAgent?.testScenarios || []

  // Calculate total size and topics
  let totalSize = '0KB'
  let totalTopics = 0

  if (knowledge.length > 0) {
    totalTopics = knowledge.reduce((sum, doc) => sum + (doc.topics || 0), 0)
    // Use first doc's size as representative (in real app would sum all)
    totalSize = knowledge[0].size || '0KB'
  }

  return {
    knowledgeCount: knowledge.length,
    skillsCount: skills.length,
    scenariosCount: scenarios.length,
    totalSize,
    totalTopics
  }
}

function getInstructionsPreview(template) {
  const instructions = template.sampleAgent?.instructions || ''
  const maxLength = 50
  if (instructions.length <= maxLength) return instructions
  return instructions.substring(0, maxLength) + '...'
}

function getContentPreview(content) {
  const maxLength = 200
  if (!content) return ''
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

function openPreview(templateId) {
  previewTemplateId.value = templateId
  showPreviewModal.value = true
}

function closePreview() {
  showPreviewModal.value = false
  previewTemplateId.value = null
}

function confirmTemplate(templateId) {
  selectTemplate(templateId)
  closePreview()
}

// Agent customization
const agentName = ref('')
const agentDescription = ref('')
const agentInstructions = ref('')
const showKnowledge = ref(false)

const templateKnowledgeCount = computed(() => {
  if (selectedTemplate.value === 'blank') return 0
  const template = templates.find(t => t.id === selectedTemplate.value)
  return template?.sampleAgent?.knowledge?.length || 0
})

const currentTemplateKnowledge = computed(() => {
  if (selectedTemplate.value === 'blank') return []
  const template = templates.find(t => t.id === selectedTemplate.value)
  return template?.sampleAgent?.knowledge || []
})

const templateName = computed(() => {
  if (selectedTemplate.value === 'blank') return 'Blank Template'
  const template = templates.find(t => t.id === selectedTemplate.value)
  return template?.name || 'Custom'
})

// Testing
const testScenarios = ref([])
const testResults = ref({})
const chatMessages = ref([])
const testMessage = ref('')
const testing = ref(false)

function runTest(scenario) {
  testing.value = true

  chatMessages.value.push({
    id: Date.now(),
    sender: 'user',
    text: scenario.prompt
  })

  setTimeout(() => {
    const responses = [
      `Based on our knowledge base, ${scenario.expectedKeywords[0]}.`,
      `Great question! ${scenario.expectedKeywords.join(' and ')}.`,
      `I can help with that. ${scenario.expectedKeywords[0]}.`
    ]

    chatMessages.value.push({
      id: Date.now() + 1,
      sender: 'agent',
      text: responses[Math.floor(Math.random() * responses.length)]
    })

    testResults.value[scenario.id] = true
    testing.value = false
  }, 1500)
}

function sendTestMessage() {
  if (!testMessage.value.trim()) return

  testing.value = true

  chatMessages.value.push({
    id: Date.now(),
    sender: 'user',
    text: testMessage.value
  })

  const msg = testMessage.value
  testMessage.value = ''

  setTimeout(() => {
    chatMessages.value.push({
      id: Date.now() + 1,
      sender: 'agent',
      text: `I understand you're asking about "${msg}". Let me help you with that based on my training.`
    })
    testing.value = false
  }, 1500)
}

// Deployment
const deployChannel = ref(null)
const widgetPosition = ref('bottom-right')
const phoneNumber = ref('+1-555-0123')
const smsNumber = ref('+1-555-0125')

// Auto-select deployment channel based on agent type
watch(agentType, (newType) => {
  if (newType === 'phone') {
    deployChannel.value = 'phone'
  } else if (newType === 'chat') {
    deployChannel.value = 'web-chat'
  }
})

// Success
const agentId = ref('agent-' + Date.now())

// Navigation
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0: return agentType.value !== null // Agent type selected
    case 1: return selectedTemplate.value !== null // Template selected
    default: return true
  }
})

function nextStep() {
  // Allow moving to step 1, and then to "Almost Done" screen (step 2)
  if (canProceed.value && currentStep.value < 2) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function goToWorkspace() {
  // Get the template data to include knowledge, skills, and testScenarios
  const template = selectedTemplate.value !== 'blank'
    ? templates.find(t => t.id === selectedTemplate.value)
    : null

  // Save agent to localStorage for demo
  const agent = {
    id: agentId.value,
    name: agentName.value,
    description: template?.sampleAgent?.description || '',
    instructions: template?.sampleAgent?.instructions || '',
    status: 'draft',
    statusText: 'Draft',
    channel: deployChannel.value,
    channels: [deployChannel.value],
    agentType: agentType.value, // Store agent type for workspace
    conversations: 0,
    deflectionRate: 0,
    satisfaction: '-',
    createdAt: new Date().toISOString(),
    lastUpdated: 'Just now',
    templateId: selectedTemplate.value,
    // Include template data
    knowledge: template?.sampleAgent?.knowledge || [],
    skills: template?.sampleAgent?.skills || [],
    testScenarios: template?.sampleAgent?.testScenarios || []
  }

  const existingAgents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  existingAgents.push(agent)
  localStorage.setItem('daart-agents', JSON.stringify(existingAgents))
  localStorage.setItem('daart-onboarding-complete', 'true')
  // Store the newly created agent ID so workspace can select it
  localStorage.setItem('daart-new-agent-id', agent.id)

  router.push('/agents-workspace')
}
</script>

<style scoped>
.onboarding-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Progress Bar */
.progress-bar {
  height: 4px;
  background: #eee;
}

.progress-fill {
  height: 100%;
  background: #000;
  transition: width 0.3s ease;
}

/* Step Indicators */
.step-indicators {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 40px 20px 20px;
  border-bottom: 1px solid #ddd;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  border: 2px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #999;
  transition: all 0.3s;
}

.step-indicator.active .step-number {
  border-color: #000;
  background: #000;
  color: #fff;
}

.step-indicator.completed .step-number {
  border-color: #00aa00;
  background: #00aa00;
  color: #fff;
}

.step-label {
  font-size: 12px;
  color: #999;
}

.step-indicator.active .step-label {
  color: #000;
  font-weight: 600;
}

/* Step Content */
.step-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px 20px;
}

.step-view {
  max-width: 900px;
  margin: 0 auto;
}

.step-view h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
}

.hint-box {
  background: #f0f9ff;
  border-left: 3px solid #0ea5e9;
  padding: 12px 16px;
  margin: 0 auto 32px auto;
  max-width: 600px;
  font-size: 14px;
  color: #0c4a6e;
  border-radius: 4px;
}

/* Value Props */
.value-props {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.value-prop {
  padding: 24px;
  border: 1px solid #ddd;
  text-align: center;
}

.prop-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 8px;
}

.prop-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.cta-box {
  text-align: center;
  padding: 40px;
  border: 2px solid #000;
  background: #fafafa;
}

.cta-box h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.cta-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.cta-steps {
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 0 auto 32px;
  max-width: 400px;
}

.cta-steps li {
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.cta-steps li::before {
  content: "→ ";
  margin-right: 8px;
  font-weight: 600;
}

.btn-get-started {
  padding: 16px 40px;
  border: 2px solid #000;
  background: #000;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-get-started:hover {
  background: #333;
  border-color: #333;
}

/* Agent Type Grid */
.agent-type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.agent-type-option {
  padding: 32px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.agent-type-option:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.agent-type-option.selected {
  border-color: #000;
  background: #fafafa;
}

.agent-type-name {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 12px;
}

.agent-type-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.agent-type-benefits {
  margin-top: 16px;
}

.benefit-label {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.agent-type-benefits ul {
  margin: 0;
  padding-left: 20px;
  list-style: disc;
}

.agent-type-benefits li {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}

/* Templates Grid */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.template-card {
  padding: 24px;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.template-card:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.template-card.selected {
  border-color: #000;
  background: #fafafa;
}

.template-card.blank {
  background: #f9f9f9;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.template-name {
  font-weight: 600;
  font-size: 18px;
}

.checkmark {
  width: 24px;
  height: 24px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.template-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.template-channels {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.channel-badge {
  padding: 4px 12px;
  background: #eee;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

/* Template Metadata */
.template-metadata {
  margin: 16px 0 12px 0;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.metadata-item {
  font-size: 12px;
  color: #333;
  margin-bottom: 6px;
  line-height: 1.5;
}

.metadata-item.instructions-preview {
  margin-top: 8px;
  color: #666;
  font-style: italic;
}

.preview-link {
  display: inline-block;
  margin-top: 12px;
  font-size: 13px;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
}

.preview-link:hover {
  color: #000;
}

/* Preview Modal */
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.preview-modal {
  background: #fff;
  border: 2px solid #000;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.preview-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-modal-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: #000;
}

.preview-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.preview-section {
  margin-bottom: 32px;
}

.preview-section:last-child {
  margin-bottom: 0;
}

.preview-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.preview-content {
  padding: 12px;
  background: #fafafa;
  border: 1px solid #ddd;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.preview-knowledge-item,
.preview-skill-item,
.preview-scenario-item {
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  background: #fafafa;
}

.preview-knowledge-item:last-child,
.preview-skill-item:last-child,
.preview-scenario-item:last-child {
  margin-bottom: 0;
}

.preview-knowledge-header,
.preview-skill-header,
.preview-scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.preview-knowledge-header strong,
.preview-skill-header strong,
.preview-scenario-header strong {
  font-size: 14px;
  font-weight: 600;
}

.preview-knowledge-meta {
  font-size: 12px;
  color: #666;
}

.preview-skill-status {
  font-size: 12px;
  color: #666;
  padding: 2px 8px;
  border: 1px solid #ddd;
  background: #fff;
}

.preview-skill-desc,
.preview-scenario-prompt,
.preview-scenario-keywords {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.preview-scenario-prompt {
  margin-bottom: 6px;
}

.preview-content-snippet {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  white-space: pre-wrap;
}

.preview-empty {
  font-size: 14px;
  color: #999;
  font-style: italic;
  padding: 12px;
  text-align: center;
}

.preview-modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #ddd;
  background: #fafafa;
}

.preview-note {
  font-size: 13px;
  color: #666;
  margin: 0 0 16px 0;
  text-align: center;
}

.preview-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Form Section */
.form-section {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-field {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: #000;
}

textarea.input-field {
  resize: vertical;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.knowledge-preview {
  padding: 16px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.knowledge-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.knowledge-empty {
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.knowledge-note {
  margin-top: 12px;
  padding: 12px;
  background: #fff4e5;
  border: 1px solid #ffcc80;
  font-size: 13px;
  line-height: 1.6;
  color: #663c00;
}

.knowledge-note strong {
  font-weight: 600;
}

.btn-link {
  background: none;
  border: none;
  color: #0066cc;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.knowledge-content {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
}

.knowledge-doc {
  margin-bottom: 16px;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.doc-name {
  font-weight: 600;
  font-size: 14px;
}

.doc-meta {
  font-size: 12px;
  color: #999;
}

.doc-content {
  padding: 12px;
  background: #fff;
  border: 1px solid #ddd;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  max-height: 300px;
  overflow-y: auto;
  font-family: apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Test Section */
.test-section {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

.test-scenarios h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.scenario-item {
  padding: 12px;
  border: 1px solid #ddd;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.scenario-prompt {
  font-size: 14px;
  flex: 1;
}

.btn-test {
  padding: 6px 16px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.btn-test:hover {
  background: #000;
  color: #fff;
}

.test-chat {
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
  background: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.chat-message.user {
  background: #000;
  color: #fff;
  align-self: flex-end;
}

.chat-message.agent {
  background: #f0f0f0;
  align-self: flex-start;
}

.message-text.typing {
  font-style: italic;
  color: #666;
}

.chat-input {
  padding: 12px;
  border-top: 1px solid #ddd;
  display: flex;
  gap: 8px;
}

.chat-input .input-field {
  flex: 1;
  margin: 0;
}

.btn-send {
  padding: 8px 20px;
  border: 1px solid #000;
  background: #000;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
}

/* Channels Grid */
.channels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.channel-option {
  padding: 32px 24px;
  border: 2px solid #ddd;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  position: relative;
  min-height: 180px;
}

.channel-option:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.channel-option.selected {
  border-color: #000;
  background: #fafafa;
}

.channel-name {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 12px;
}

.recommended-badge {
  font-size: 10px;
  font-weight: 500;
  border: 1px solid #999;
  padding: 2px 6px;
  margin-left: 8px;
  letter-spacing: 0.5px;
}

.channel-desc {
  font-size: 13px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 12px;
}

.channel-desc strong {
  color: #000;
  display: block;
  margin-bottom: 4px;
}

.channel-benefit {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.channel-option .checkmark {
  position: absolute;
  top: 16px;
  right: 16px;
}

.deployment-preview {
  max-width: 600px;
  margin: 0 auto;
}

.deployment-preview h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.settings-form {
  border: 1px solid #ddd;
  padding: 24px;
  background: #fafafa;
}

/* Welcome Header */
.welcome-header {
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eee;
}

.welcome-header h1 {
  margin-bottom: 8px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.section-subtitle {
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
}

/* Center Form */
.center-form {
  max-width: 400px;
  margin: 32px auto;
}

/* Success Summary */
.success-summary {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin: 32px 0;
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.summary-item {
  font-size: 14px;
  color: #666;
}

.summary-item strong {
  color: #000;
  font-weight: 600;
  margin-right: 6px;
}

/* Success View */
.success-view {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #00aa00;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin: 0 auto 24px;
}

.success-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.detail-value {
  font-size: 18px;
  font-weight: 600;
}

.status-live {
  color: #00aa00;
}

.status-draft {
  color: #ff8800;
}

.integration-code,
.integration-info {
  margin: 40px 0;
  text-align: left;
}

.integration-code h3,
.integration-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.code-block {
  padding: 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 12px;
  overflow-x: auto;
}

.btn-copy {
  padding: 8px 20px;
  border: 1px solid #000;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.phone-display {
  font-size: 32px;
  font-weight: 600;
  margin: 20px 0;
}

.next-steps {
  text-align: left;
  margin-top: 40px;
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.next-steps h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  padding: 8px 0;
  font-size: 14px;
}

.next-steps li::before {
  content: "→ ";
  margin-right: 8px;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-top: 1px solid #ddd;
  background: #fafafa;
}

.spacer {
  flex: 1;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: 1px solid #000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  color: #000;
}

.btn-secondary:hover {
  background: #f5f5f5;
}
</style>
