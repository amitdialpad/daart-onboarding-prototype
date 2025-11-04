<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAgenticStandaloneStore } from './stores/agenticStandalone'

const agenticStore = useAgenticStandaloneStore()

// Migration: Move agent-level knowledge bases to organization level
function migrateToOrgKnowledge() {
  // Check if organization knowledge already exists
  const orgKnowledge = localStorage.getItem('daart-org-knowledge')
  if (orgKnowledge) {
    // Already migrated
    return
  }

  // Get all agents
  const agents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
  if (agents.length === 0) {
    // No agents to migrate
    return
  }

  // Consolidate all agent knowledge bases into one
  const allKnowledge = []
  agents.forEach(agent => {
    if (agent.knowledgeBase && agent.knowledgeBase.trim()) {
      allKnowledge.push(`# ${agent.name}\n${agent.knowledgeBase}\n`)
    }
  })

  // Create organization-level knowledge base
  const consolidatedKnowledge = allKnowledge.length > 0
    ? allKnowledge.join('\n---\n\n')
    : ''

  const newOrgKnowledge = {
    content: consolidatedKnowledge,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Save to localStorage
  localStorage.setItem('daart-org-knowledge', JSON.stringify(newOrgKnowledge))

  console.log('✅ Migrated agent knowledge bases to organization level')
}

onMounted(() => {
  // Run migration first
  migrateToOrgKnowledge()

  // Initialize store data
  agenticStore.fetchAccountData()
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
