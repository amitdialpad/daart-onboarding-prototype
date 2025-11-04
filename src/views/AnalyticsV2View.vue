<template>
  <div class="insights-container">
    <!-- Content -->
    <div class="insights-content">
      <!-- Header -->
      <div class="insights-header">
        <div>
          <h1>Analytics</h1>
          <p class="insights-subtitle">Real-time monitoring and performance analytics</p>
        </div>
        <select v-model="selectedAgent" class="agent-select">
          <option value="all">All Agents</option>
          <option value="1">Support Assistant</option>
          <option value="2">Sales Bot</option>
        </select>
      </div>

      <!-- Live Section -->
      <div id="live" class="section-anchor">
        <h2 class="section-title">Live</h2>
        <div class="live-metrics">
          <div class="live-metric-card">
            <div class="live-metric-label">Active Now</div>
            <div class="live-metric-value">{{ activeConversations }}</div>
          </div>
          <div class="live-metric-card">
            <div class="live-metric-label">Conversations/min</div>
            <div class="live-metric-value">{{ conversationsPerMin }}</div>
          </div>
          <div class="live-metric-card">
            <div class="live-metric-label">Avg Response Time</div>
            <div class="live-metric-value">{{ liveResponseTime }}s</div>
          </div>
          <div class="live-metric-card">
            <div class="live-metric-label">Handovers Today</div>
            <div class="live-metric-value">{{ handoversToday }}</div>
          </div>
          <div class="live-metric-card">
            <div class="live-metric-label">Errors (last hour)</div>
            <div class="live-metric-value">{{ errors }}</div>
          </div>
        </div>

        <div class="live-stream">
          <h3>Live Conversation Stream</h3>
          <div class="stream-list">
            <div v-for="convo in liveConversations" :key="convo.id" class="stream-item">
              <div class="stream-time">{{ convo.time }}</div>
              <div class="stream-agent">{{ convo.agent }}</div>
              <div class="stream-message">{{ convo.lastMessage }}</div>
              <div class="stream-status" :class="convo.status">{{ convo.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Section -->
      <div id="performance" class="section-anchor">
        <h2 class="section-title">Performance</h2>
        <div class="metrics-summary">
          <div class="summary-card">
            <div class="summary-label">Total Conversations</div>
            <div class="summary-value">1,247</div>
            <div class="summary-change positive">+12%</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Deflection Rate</div>
            <div class="summary-value">73%</div>
            <div class="summary-change positive">+5%</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Avg Response Time</div>
            <div class="summary-value">1.2s</div>
            <div class="summary-change positive">-0.3s</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Customer Satisfaction</div>
            <div class="summary-value">4.6/5</div>
            <div class="summary-change positive">+0.2</div>
          </div>
        </div>

        <div class="chart-section-insights">
          <h3>Conversations Over Time</h3>
          <div class="chart-placeholder-insights">
            [Chart visualization would go here]
          </div>
        </div>

        <div class="performance-breakdown">
          <h3>Performance by Agent</h3>
          <table class="performance-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Conversations</th>
                <th>Deflection</th>
                <th>Response Time</th>
                <th>CSAT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Support Assistant</td>
                <td>1,247</td>
                <td>73%</td>
                <td>1.2s</td>
                <td>4.6/5</td>
              </tr>
              <tr>
                <td>Sales Bot</td>
                <td>892</td>
                <td>68%</td>
                <td>1.5s</td>
                <td>4.4/5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Conversations Section -->
      <div id="conversations" class="section-anchor">
        <h2 class="section-title">Conversations</h2>
        <div class="conversations-filters">
          <input type="text" placeholder="Search conversations..." class="search-input-insights">
          <select class="filter-select">
            <option>All Status</option>
            <option>Resolved</option>
            <option>Handed off to Human</option>
            <option>Escalated</option>
          </select>
        </div>

        <table class="conversations-table-insights">
          <thead>
            <tr>
              <th>Time</th>
              <th>Agent</th>
              <th>Customer</th>
              <th>Topic</th>
              <th>Duration</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2:34 PM</td>
              <td>Support Assistant</td>
              <td>Anonymous</td>
              <td>Order Status</td>
              <td>2:15</td>
              <td class="status-resolved">Resolved</td>
            </tr>
            <tr>
              <td>2:28 PM</td>
              <td>Sales Bot</td>
              <td>john@example.com</td>
              <td>Product Info</td>
              <td>4:32</td>
              <td class="status-escalated">Escalated</td>
            </tr>
            <tr>
              <td>2:15 PM</td>
              <td>Support Assistant</td>
              <td>Anonymous</td>
              <td>Business Hours</td>
              <td>1:05</td>
              <td class="status-resolved">Resolved</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Feedback Section -->
      <div id="feedback" class="section-anchor">
        <h2 class="section-title">Feedback</h2>
        <div class="rating-overview">
          <div class="rating-summary-insights">
            <div class="rating-large">4.6</div>
            <div class="rating-stars-large">★★★★★</div>
            <div class="rating-count-large">918 ratings</div>
          </div>

          <div class="rating-distribution">
            <div class="rating-bar-row">
              <span>5★</span>
              <div class="rating-bar-insights">
                <div class="rating-bar-fill-insights" style="width: 75%"></div>
              </div>
              <span>75%</span>
            </div>
            <div class="rating-bar-row">
              <span>4★</span>
              <div class="rating-bar-insights">
                <div class="rating-bar-fill-insights" style="width: 15%"></div>
              </div>
              <span>15%</span>
            </div>
            <div class="rating-bar-row">
              <span>3★</span>
              <div class="rating-bar-insights">
                <div class="rating-bar-fill-insights" style="width: 6%"></div>
              </div>
              <span>6%</span>
            </div>
            <div class="rating-bar-row">
              <span>2★</span>
              <div class="rating-bar-insights">
                <div class="rating-bar-fill-insights" style="width: 2%"></div>
              </div>
              <span>2%</span>
            </div>
            <div class="rating-bar-row">
              <span>1★</span>
              <div class="rating-bar-insights">
                <div class="rating-bar-fill-insights" style="width: 2%"></div>
              </div>
              <span>2%</span>
            </div>
          </div>
        </div>

        <div class="feedback-list-insights">
          <h3>Recent Feedback</h3>
          <div class="feedback-items">
            <div class="feedback-item-insights">
              <div class="feedback-header-insights">
                <div class="feedback-stars">★★★★★</div>
                <div class="feedback-date-insights">2 hours ago</div>
              </div>
              <div class="feedback-text-insights">"Super quick response! Got exactly what I needed."</div>
              <div class="feedback-agent-insights">Support Assistant</div>
            </div>

            <div class="feedback-item-insights">
              <div class="feedback-header-insights">
                <div class="feedback-stars">★★★★</div>
                <div class="feedback-date-insights">5 hours ago</div>
              </div>
              <div class="feedback-text-insights">"Helpful, but had to repeat my question."</div>
              <div class="feedback-agent-insights">Sales Bot</div>
            </div>

            <div class="feedback-item-insights">
              <div class="feedback-header-insights">
                <div class="feedback-stars">★★★</div>
                <div class="feedback-date-insights">1 day ago</div>
              </div>
              <div class="feedback-text-insights">"Couldn't handle my complex issue."</div>
              <div class="feedback-agent-insights">Support Assistant</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Usage Tracking
const usageData = ref({
  callsUsed: 0,
  callsLimit: 100,
  resetDate: null
})

onMounted(() => {
  const saved = localStorage.getItem('daart-usage')
  if (saved) {
    usageData.value = JSON.parse(saved)
  }
})

const usagePercentage = computed(() => {
  return Math.round((usageData.value.callsUsed / usageData.value.callsLimit) * 100)
})

const usageColor = computed(() => {
  const pct = usagePercentage.value
  if (pct < 70) return 'green'
  if (pct < 90) return 'yellow'
  return 'red'
})

// State
const selectedAgent = ref('all')

// Live metrics
const activeConversations = ref(12)
const conversationsPerMin = ref(3.2)
const liveResponseTime = ref(1.3)
const handoversToday = ref(18)
const errors = ref(2)

// Live conversations
const liveConversations = ref([
  { id: 1, time: '14:32:15', agent: 'Support Assistant', lastMessage: 'Let me check that for you...', status: 'active' },
  { id: 2, time: '14:31:58', agent: 'Sales Bot', lastMessage: 'Thank you! Have a great day!', status: 'completed' },
  { id: 3, time: '14:31:42', agent: 'Support Assistant', lastMessage: 'Transferring to human agent...', status: 'handed-off' },
  { id: 4, time: '14:31:20', agent: 'Support Assistant', lastMessage: 'Your order #12345 is...', status: 'active' },
  { id: 5, time: '14:30:55', agent: 'Sales Bot', lastMessage: 'Let me connect you with our sales team...', status: 'handed-off' }
])
</script>

<style scoped>
.insights-container {
  background: #fff;
  font-family: apple-system, BlinkMacSystemFont, "SF Pro", "Segoe UI Adjusted", "Segoe UI", SFMono, "Helvetica Neue", Cantarell, Ubuntu, Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

/* Content */
.insights-content {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.insights-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.insights-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.insights-subtitle {
  font-size: 14px;
  color: #666;
}

.agent-select {
  padding: 8px 16px;
  border: 1px solid #ccc;
  font-size: 13px;
}

/* Section Anchors */
.section-anchor {
  scroll-margin-top: 20px;
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #000;
}

/* Content */
.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Live Metrics */
.live-metrics {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.live-metric-card {
  padding: 20px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.live-metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.live-metric-value {
  font-size: 28px;
  font-weight: 600;
}

/* Live Stream */
.live-stream h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.stream-list {
  border: 1px solid #ddd;
}

.stream-item {
  display: grid;
  grid-template-columns: 80px 150px 1fr 100px;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-size: 12px;
}

.stream-item:last-child {
  border-bottom: none;
}

.stream-time {
  color: #666;
}

.stream-agent {
  font-weight: 500;
}

.stream-message {
  color: #666;
}

.stream-status {
  text-align: right;
  font-weight: 600;
}

.stream-status.active {
  color: #00aa00;
}

.stream-status.completed {
  color: #666;
}

.stream-status.handed-off {
  color: #ff8800;
}

/* Metrics Summary */
.metrics-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  padding: 20px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.summary-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 4px;
}

.summary-change {
  font-size: 12px;
}

.summary-change.positive {
  color: #00aa00;
}

/* Chart */
.chart-section-insights {
  margin-bottom: 32px;
  padding: 20px;
  border: 1px solid #ddd;
}

.chart-section-insights h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.chart-placeholder-insights {
  height: 200px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

/* Performance Table */
.performance-breakdown h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.performance-table {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
}

.performance-table th,
.performance-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.performance-table th {
  background: #fafafa;
  font-weight: 600;
}

/* Conversations */
.conversations-filters {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input-insights,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  font-size: 13px;
}

.search-input-insights {
  flex: 1;
}

.conversations-table-insights {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
}

.conversations-table-insights th,
.conversations-table-insights td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 13px;
}

.conversations-table-insights th {
  background: #fafafa;
  font-weight: 600;
}

.status-resolved {
  color: #00aa00;
}

.status-escalated {
  color: #ff8800;
}

/* Feedback */
.rating-overview {
  display: flex;
  gap: 48px;
  margin-bottom: 32px;
  padding: 24px;
  border: 1px solid #ddd;
  background: #fafafa;
}

.rating-summary-insights {
  text-align: center;
}

.rating-large {
  font-size: 48px;
  font-weight: 600;
  margin-bottom: 8px;
}

.rating-stars-large {
  font-size: 20px;
  color: #ff8800;
  margin-bottom: 8px;
}

.rating-count-large {
  font-size: 12px;
  color: #666;
}

.rating-distribution {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.rating-bar-row span:first-child {
  width: 30px;
}

.rating-bar-row span:last-child {
  width: 40px;
  text-align: right;
}

.rating-bar-insights {
  flex: 1;
  height: 8px;
  background: #e5e5e5;
  border: 1px solid #ddd;
}

.rating-bar-fill-insights {
  height: 100%;
  background: #000;
}

/* Feedback List */
.feedback-list-insights h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.feedback-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-item-insights {
  padding: 16px;
  border: 1px solid #ddd;
  background: #fff;
}

.feedback-header-insights {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.feedback-stars {
  color: #ff8800;
  font-size: 14px;
}

.feedback-date-insights {
  font-size: 11px;
  color: #666;
}

.feedback-text-insights {
  font-size: 13px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.feedback-agent-insights {
  font-size: 11px;
  color: #666;
}
</style>
