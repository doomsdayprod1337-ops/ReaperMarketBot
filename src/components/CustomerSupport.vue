<template>
  <div class="customer-support">
    <!-- Support Header -->
    <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-white font-semibold font-reaper">Customer Support</h3>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-green-400 text-sm">Support Online</span>
        </div>
      </div>
      <p class="text-gray-300 text-sm">Get help with your bot management, purchases, and technical issues</p>
    </div>

    <!-- Support Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <button
        @click="openLiveChat"
        class="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors text-center"
      >
        <div class="text-2xl mb-2">💬</div>
        <div class="font-medium">Live Chat</div>
        <div class="text-sm opacity-80">Instant support</div>
      </button>
      <button
        @click="createTicket"
        class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg transition-colors text-center"
      >
        <div class="text-2xl mb-2">🎫</div>
        <div class="font-medium">Support Ticket</div>
        <div class="text-sm opacity-80">Detailed help</div>
      </button>
      <button
        @click="openKnowledgeBase"
        class="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition-colors text-center"
      >
        <div class="text-2xl mb-2">📚</div>
        <div class="font-medium">Knowledge Base</div>
        <div class="text-sm opacity-80">Self-help guides</div>
      </button>
      <button
        @click="openFAQ"
        class="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition-colors text-center"
      >
        <div class="text-2xl mb-2">❓</div>
        <div class="font-medium">FAQ</div>
        <div class="text-sm opacity-80">Common questions</div>
      </button>
    </div>

    <!-- Live Chat Interface -->
    <div v-if="showLiveChat" class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm mb-6">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-white font-semibold">Live Chat Support</h4>
          <button
            @click="showLiveChat = false"
            class="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <!-- Chat Messages -->
        <div ref="chatContainer" class="h-64 overflow-y-auto border border-gray-700 rounded-lg p-4 mb-4 bg-gray-900/50">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`"
          >
            <div
              :class="`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
              }`"
            >
              <div class="flex items-start gap-2">
                <div v-if="message.sender === 'support'" class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-green-400 text-xs">👨‍💻</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm">{{ message.text }}</p>
                  <div class="text-xs opacity-70 mt-1">{{ message.timestamp }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="supportTyping" class="flex justify-start">
            <div class="bg-gray-700 text-white p-3 rounded-lg">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span class="text-green-400 text-xs">👨‍💻</span>
                </div>
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="flex gap-2">
          <input
            v-model="chatMessage"
            @keyup.enter="sendChatMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
          />
          <button
            @click="sendChatMessage"
            :disabled="!chatMessage.trim()"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <!-- Support Ticket Form -->
    <div v-if="showTicketForm" class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm mb-6">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-white font-semibold">Create Support Ticket</h4>
          <button
            @click="showTicketForm = false"
            class="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <form @submit.prevent="submitTicket" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Subject</label>
            <input
              v-model="ticketForm.subject"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
              placeholder="Brief description of your issue"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Category</label>
            <select
              v-model="ticketForm.category"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
            >
              <option value="">Select a category</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing Question</option>
              <option value="bot-management">Bot Management</option>
              <option value="security">Security Concern</option>
              <option value="feature-request">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Priority</label>
            <select
              v-model="ticketForm.priority"
              required
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              v-model="ticketForm.description"
              required
              rows="4"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
              placeholder="Please provide detailed information about your issue..."
            ></textarea>
          </div>
          
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showTicketForm = false"
              class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <span v-if="!isSubmitting">Submit Ticket</span>
              <span v-else>Submitting...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Knowledge Base -->
    <div v-if="showKnowledgeBase" class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm mb-6">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-white font-semibold">Knowledge Base</h4>
          <button
            @click="showKnowledgeBase = false"
            class="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="article in knowledgeBase"
            :key="article.id"
            class="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
            @click="openArticle(article)"
          >
            <div class="flex items-start gap-3">
              <div class="text-2xl">{{ article.icon }}</div>
              <div>
                <h5 class="text-white font-medium mb-1">{{ article.title }}</h5>
                <p class="text-gray-400 text-sm">{{ article.description }}</p>
                <div class="text-xs text-gray-500 mt-2">{{ article.views }} views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div v-if="showFAQ" class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm mb-6">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-white font-semibold">Frequently Asked Questions</h4>
          <button
            @click="showFAQ = false"
            class="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="faq in faqs"
            :key="faq.id"
            class="bg-gray-700/50 rounded-lg"
          >
            <button
              @click="toggleFAQ(faq.id)"
              class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-600/50 transition-colors"
            >
              <span class="text-white font-medium">{{ faq.question }}</span>
              <span class="text-gray-400">{{ faq.expanded ? '−' : '+' }}</span>
            </button>
            <div v-if="faq.expanded" class="px-4 pb-4">
              <p class="text-gray-300 text-sm">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Support Activity -->
    <div class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm">
      <div class="p-6">
        <h4 class="text-white font-semibold mb-4">Recent Support Activity</h4>
        <div class="space-y-3">
          <div
            v-for="activity in supportActivity"
            :key="activity.id"
            class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span class="text-blue-400 text-sm">{{ activity.icon }}</span>
              </div>
              <div>
                <div class="text-white font-medium text-sm">{{ activity.title }}</div>
                <div class="text-gray-400 text-xs">{{ activity.description }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-white text-sm">{{ activity.status }}</div>
              <div class="text-gray-400 text-xs">{{ activity.timestamp }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'

// State
const showLiveChat = ref(false)
const showTicketForm = ref(false)
const showKnowledgeBase = ref(false)
const showFAQ = ref(false)
const isSubmitting = ref(false)
const supportTyping = ref(false)
const chatMessage = ref('')
const chatContainer = ref(null)

// Chat messages
const chatMessages = ref([
  {
    id: 1,
    sender: 'support',
    text: 'Hello! I\'m here to help you with any questions or issues you might have. How can I assist you today?',
    timestamp: '10:30 AM'
  }
])

// Ticket form
const ticketForm = reactive({
  subject: '',
  category: '',
  priority: 'medium',
  description: ''
})

// Knowledge base
const knowledgeBase = ref([
  {
    id: 1,
    title: 'Getting Started with Bot Management',
    description: 'Learn how to set up and manage your bots effectively',
    icon: '🚀',
    views: 1234
  },
  {
    id: 2,
    title: 'Bot Security Best Practices',
    description: 'Essential security measures for protecting your bot data',
    icon: '🔒',
    views: 892
  },
  {
    id: 3,
    title: 'Troubleshooting Common Issues',
    description: 'Solutions for the most common bot-related problems',
    icon: '🔧',
    views: 567
  },
  {
    id: 4,
    title: 'API Integration Guide',
    description: 'How to integrate our bot API into your applications',
    icon: '⚡',
    views: 345
  }
])

// FAQ
const faqs = ref([
  {
    id: 1,
    question: 'How do I start using the bot management system?',
    answer: 'Simply navigate to the Dashboard and use the bot controls to start, stop, or restart your bots. You can also view detailed analytics and performance metrics.',
    expanded: false
  },
  {
    id: 2,
    question: 'What payment methods do you accept?',
    answer: 'We accept Bitcoin, Ethereum, and other major cryptocurrencies. All transactions are processed securely through our encrypted payment system.',
    expanded: false
  },
  {
    id: 3,
    question: 'How can I ensure my bot data is secure?',
    answer: 'We use end-to-end encryption for all bot data. Additionally, we recommend enabling two-factor authentication and regularly updating your security settings.',
    expanded: false
  },
  {
    id: 4,
    question: 'What is your refund policy?',
    answer: 'We offer a 24-hour refund policy for all bot purchases. If you\'re not satisfied with your purchase, contact our support team within 24 hours.',
    expanded: false
  }
])

// Support activity
const supportActivity = ref([
  {
    id: 1,
    title: 'Ticket #1234',
    description: 'Bot connection issue resolved',
    status: 'Resolved',
    timestamp: '2 hours ago',
    icon: '✅'
  },
  {
    id: 2,
    title: 'Ticket #1233',
    description: 'Payment processing inquiry',
    status: 'In Progress',
    timestamp: '1 day ago',
    icon: '⏳'
  },
  {
    id: 3,
    title: 'Live Chat Session',
    description: 'Bot management assistance',
    status: 'Completed',
    timestamp: '2 days ago',
    icon: '💬'
  }
])

// Methods
const openLiveChat = () => {
  showLiveChat.value = true
  showTicketForm.value = false
  showKnowledgeBase.value = false
  showFAQ.value = false
}

const createTicket = () => {
  showTicketForm.value = true
  showLiveChat.value = false
  showKnowledgeBase.value = false
  showFAQ.value = false
}

const openKnowledgeBase = () => {
  showKnowledgeBase.value = true
  showLiveChat.value = false
  showTicketForm.value = false
  showFAQ.value = false
}

const openFAQ = () => {
  showFAQ.value = true
  showLiveChat.value = false
  showTicketForm.value = false
  showKnowledgeBase.value = false
}

const sendChatMessage = async () => {
  if (!chatMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: chatMessage.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  chatMessages.value.push(userMessage)
  const messageText = chatMessage.value
  chatMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Show typing indicator
  supportTyping.value = true

  // Simulate support response
  setTimeout(() => {
    supportTyping.value = false
    const supportResponse = generateSupportResponse(messageText)
    chatMessages.value.push(supportResponse)
    scrollToBottom()
  }, 2000)
}

const generateSupportResponse = (userMessage) => {
  const responses = {
    'bot': 'I can help you with bot management issues. What specific problem are you experiencing?',
    'payment': 'For payment-related questions, please provide your transaction ID and I\'ll help you resolve the issue.',
    'security': 'Security is our top priority. Please describe your security concern and I\'ll provide immediate assistance.',
    'refund': 'I can help you with refund requests. Please provide your order number and reason for the refund.',
    'hello': 'Hello! I\'m here to help. What can I assist you with today?',
    'help': 'I\'m here to help! You can ask me about bot management, payments, security, or any other questions you have.'
  }

  const lowerMessage = userMessage.toLowerCase()
  let response = 'Thank you for your message. I\'m here to help you with any questions or issues. Could you please provide more details about what you need assistance with?'

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      response = value
      break
    }
  }

  return {
    id: Date.now() + 1,
    sender: 'support',
    text: response,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const submitTicket = async () => {
  isSubmitting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Ticket submitted:', ticketForm)
    
    // Reset form
    Object.assign(ticketForm, {
      subject: '',
      category: '',
      priority: 'medium',
      description: ''
    })
    
    showTicketForm.value = false
    alert('Support ticket created successfully! We\'ll get back to you soon.')
  } catch (error) {
    console.error('Error submitting ticket:', error)
    alert('Error creating support ticket. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const openArticle = (article) => {
  console.log('Opening article:', article.title)
  // Implement article opening functionality
}

const toggleFAQ = (faqId) => {
  const faq = faqs.value.find(f => f.id === faqId)
  if (faq) {
    faq.expanded = !faq.expanded
  }
}

onMounted(() => {
  // Initialize support system
  console.log('Customer support system initialized')
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.bg-reaper-dark-gray {
  background-color: #1a1a1a;
}

.text-reaper-red {
  color: #e53e3e;
}

.border-reaper-red\/30 {
  border-color: rgba(229, 62, 62, 0.3);
}
</style>
