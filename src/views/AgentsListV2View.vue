<template>
  <div class="agents-list-v2">
    <div class="page-header">
      <h1>Agents</h1>
      <button class="btn-primary" @click="goToOnboarding">+ Create Agent</button>
    </div>

    <div v-if="agents.length === 0" class="empty-state">
      <h2>No agents yet</h2>
      <p>Create your first AI agent to get started</p>
      <button class="btn-primary" @click="goToOnboarding">Create First Agent</button>
    </div>

    <div v-else class="agents-grid">
      <div v-for="agent in agents" :key="agent.id" class="agent-card" @click="selectAgent(agent.id)">
        <div class="agent-header">
          <div class="agent-name">{{ agent.name }}</div>
          <div class="agent-status" :class="agent.status">{{ agent.statusText }}</div>
        </div>
        <div class="agent-type">{{ agent.agentType === 'phone' ? 'Voice Agent' : 'Digital Agent' }}</div>
        <div class="agent-meta">
          <div>Updated {{ agent.lastUpdated }}</div>
          <div>{{ agent.conversations }} conversations</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const agents = ref([])

onMounted(() => {
  loadAgents()
})

function loadAgents() {
  const savedAgents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  agents.value = savedAgents
}

function goToOnboarding() {
  router.push('/onboarding-v2')
}

function selectAgent(agentId) {
  const agent = agents.value.find(a => a.id === agentId)
  // If agent is live, go to MONITOR tab
  // If agent is draft, go to BUILD tab
  const defaultTab = agent?.status === 'live' ? 'monitor' : 'build'
  router.push(`/agents-v2/${agentId}/${defaultTab}`)
}
</script>

<style scoped>
.agents-list-v2 {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}

.btn-primary {
  padding: 12px 24px;
  background: #000;
  color: #fff;
  border: 1px solid #000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #333;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.agent-card {
  padding: 24px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.agent-card:hover {
  border-color: #999;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.agent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.agent-name {
  font-size: 18px;
  font-weight: 600;
}

.agent-status {
  font-size: 12px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  text-transform: uppercase;
}

.agent-status.draft {
  border-color: #999;
  color: #666;
}

.agent-status.live {
  border-color: #000;
  color: #000;
  font-weight: 600;
}

.agent-type {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.agent-meta {
  font-size: 12px;
  color: #999;
  display: flex;
  justify-content: space-between;
}
</style>
