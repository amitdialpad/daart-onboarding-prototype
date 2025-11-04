import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: () => {
      // Check if agents exist (use V2 onboarding flow)
      const agents = JSON.parse(localStorage.getItem('daart-agents') || '[]')
      if (agents.length > 0) {
        // If agents exist, go to first agent's workspace
        const agent = agents[0]
        let defaultTab = 'build'
        if (agent.status === 'live') {
          defaultTab = 'monitor'
        } else if (agent.status === 'draft' && agent.hasBeenPublished) {
          defaultTab = 'monitor'
        }
        return `/agents-v2/${agent.id}/${defaultTab}`
      }
      // Otherwise go to onboarding
      return '/onboarding-v2'
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue')
  },
  {
    path: '/onboarding-wizard',
    name: 'OnboardingWizard',
    component: () => import('../views/OnboardingWizardView.vue')
  },
  {
    path: '/agents-workspace',
    name: 'AgentsWorkspace',
    component: () => import('../views/AgentsWorkspaceView.vue')
  },
  {
    path: '/insights',
    name: 'Insights',
    component: () => import('../views/InsightsView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('../views/BillingView.vue')
  },
  // V2 Routes (New Problem-First Experience)
  {
    path: '/onboarding-v2',
    name: 'OnboardingV2',
    component: () => import('../views/OnboardingV2View.vue')
  },
  {
    path: '/agents-v2',
    component: () => import('../components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'AgentsListV2',
        component: () => import('../views/AgentsListV2View.vue')
      },
      {
        path: ':id',
        redirect: to => `/agents-v2/${to.params.id}/build`
      },
      {
        path: ':id/build',
        name: 'AgentBuildV2',
        component: () => import('../views/AgentsWorkspaceV2View.vue'),
        props: { activeTab: 'build' }
      },
      {
        path: ':id/test',
        name: 'AgentTestV2',
        component: () => import('../views/AgentsWorkspaceV2View.vue'),
        props: { activeTab: 'test' }
      },
      {
        path: ':id/monitor',
        name: 'AgentMonitorV2',
        component: () => import('../views/AgentsWorkspaceV2View.vue'),
        props: { activeTab: 'monitor' }
      },
      {
        path: ':id/deploy',
        name: 'AgentDeployV2',
        component: () => import('../views/DeployView.vue')
      }
    ]
  },
  {
    path: '/knowledge-v2',
    component: () => import('../components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/knowledge-v2/all-sources'
      },
      {
        path: 'all-sources',
        name: 'AllSources',
        component: () => import('../views/knowledge/AllSourcesView.vue')
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('../views/knowledge/DocumentsView.vue')
      },
      {
        path: 'text-content',
        name: 'TextContent',
        component: () => import('../views/knowledge/TextContentView.vue')
      },
      {
        path: 'website',
        name: 'Website',
        component: () => import('../views/knowledge/WebsiteView.vue')
      },
      {
        path: 'conversations',
        name: 'Conversations',
        component: () => import('../views/knowledge/ConversationsView.vue')
      }
    ]
  },
  {
    path: '/analytics-v2',
    component: () => import('../components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'AnalyticsV2',
        component: () => import('../views/AnalyticsV2View.vue')
      }
    ]
  },
  {
    path: '/billing-v2',
    component: () => import('../components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'BillingV2',
        component: () => import('../views/BillingV2View.vue')
      }
    ]
  },
  {
    path: '/settings-v2',
    component: () => import('../components/layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'SettingsV2',
        component: () => import('../views/SettingsV2View.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
