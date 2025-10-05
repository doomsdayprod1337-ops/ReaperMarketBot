<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Telegram Bot Control Center</h1>
        <p class="text-gray-300 text-lg">Advanced bot management and real-time communication</p>
      </div>

      <!-- Bot Status Dashboard -->
      <div class="grid gap-4 md:grid-cols-4 mb-8">
        <div class="bg-gray-800/80 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">Online</div>
              <div class="text-xs text-gray-300">Bot Status</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">1,247</div>
              <div class="text-xs text-gray-300">Active Users</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">89</div>
              <div class="text-xs text-gray-300">Messages Today</div>
            </div>
          </div>
        </div>

        <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            <div>
              <div class="text-2xl font-bold text-white font-mono">12</div>
              <div class="text-xs text-gray-300">Commands</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Interface -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Chat Panel -->
        <div class="lg:col-span-2">
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg backdrop-blur-sm h-[600px] flex flex-col">
            <!-- Chat Header -->
            <div class="p-4 border-b border-gray-700">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <span class="text-red-400 text-xl">🤖</span>
                  </div>
                  <div>
                    <h3 class="text-white font-semibold">Reaper Market Bot</h3>
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="text-green-400 text-sm">Online</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleBotStatus"
                    :class="`px-3 py-1 rounded text-sm transition-colors ${
                      botOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`"
                  >
                    {{ botOnline ? 'Online' : 'Offline' }}
                  </button>
                  <button class="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                    ⚙️
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
              <div
                v-for="message in messages"
                :key="message.id"
                :class="`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`"
              >
                <div
                  :class="`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white'
                  }`"
                >
                  <div class="flex items-start gap-2">
                    <div v-if="message.sender === 'bot'" class="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span class="text-red-400 text-xs">🤖</span>
                    </div>
                    <div class="flex-1">
                      <p class="text-sm">{{ message.text }}</p>
                      <div class="text-xs opacity-70 mt-1">{{ message.timestamp }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Typing Indicator -->
              <div v-if="botTyping" class="flex justify-start">
                <div class="bg-gray-700 text-white p-3 rounded-lg">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <span class="text-red-400 text-xs">🤖</span>
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

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-700">
              <div class="flex gap-2">
                <input
                  v-model="newMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Type your message..."
                  class="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20"
                />
                <button
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
              
              <!-- Quick Actions -->
              <div class="flex flex-wrap gap-2 mt-3">
                <button
                  v-for="action in quickActions"
                  :key="action.text"
                  @click="sendQuickMessage(action.text)"
                  class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
                >
                  {{ action.text }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bot Control Panel -->
        <div class="space-y-6">
          <!-- Bot Commands -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4">Bot Commands</h3>
            <div class="space-y-2">
              <div
                v-for="command in botCommands"
                :key="command.name"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="executeCommand(command)"
              >
                <div>
                  <div class="text-white font-medium text-sm">{{ command.name }}</div>
                  <div class="text-gray-400 text-xs">{{ command.description }}</div>
                </div>
                <span class="text-red-400 text-sm">/{{ command.command }}</span>
              </div>
            </div>
          </div>

          <!-- Bot Analytics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4">Bot Analytics</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">Response Time</span>
                  <span class="text-white">1.2s</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full" style="width: 85%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">Success Rate</span>
                  <span class="text-white">94.2%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full" style="width: 94.2%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-300">Uptime</span>
                  <span class="text-white">99.8%</span>
                </div>
                <div class="w-full bg-gray-700 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full" style="width: 99.8%"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Support -->
          <CustomerSupport />

          <!-- Bot Settings -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4">Bot Settings</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-300 text-sm">Auto-respond</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="autoRespond" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300 text-sm">Notifications</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="notifications" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-300 text-sm">Logging</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input v-model="logging" type="checkbox" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import CustomerSupport from '@/components/CustomerSupport.vue'

// State
const botOnline = ref(true)
const botTyping = ref(false)
const newMessage = ref('')
const autoRespond = ref(true)
const notifications = ref(true)
const logging = ref(true)
const messagesContainer = ref(null)

// Messages
const messages = ref([
  {
    id: 1,
    sender: 'bot',
    text: 'Welcome to Reaper Market Bot! I can help you with bot management, purchases, and support. How can I assist you today?',
    timestamp: '10:30 AM'
  }
])

// Quick actions
const quickActions = ref([
  { text: 'Show Bots' },
  { text: 'My Orders' },
  { text: 'Help' },
  { text: 'Support' }
])

// Bot commands
const botCommands = ref([
  {
    name: 'Start Bot',
    command: 'start',
    description: 'Initialize the bot session'
  },
  {
    name: 'Show Help',
    command: 'help',
    description: 'Display available commands'
  },
  {
    name: 'List Bots',
    command: 'bots',
    description: 'Show available bots'
  },
  {
    name: 'My Profile',
    command: 'profile',
    description: 'View user profile'
  },
  {
    name: 'Support',
    command: 'support',
    description: 'Contact support'
  }
])

// Methods
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: newMessage.value,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  messages.value.push(userMessage)
  const messageText = newMessage.value
  newMessage.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Show typing indicator
  botTyping.value = true

  // Simulate bot response
  setTimeout(() => {
    botTyping.value = false
    const botResponse = generateBotResponse(messageText)
    messages.value.push(botResponse)
    scrollToBottom()
  }, 1500)
}

const sendQuickMessage = (text) => {
  newMessage.value = text
  sendMessage()
}

const generateBotResponse = (userMessage) => {
  const responses = {
    'show bots': 'Here are the available bots: [Bot List]',
    'my orders': 'Your recent orders: [Order History]',
    'help': 'Available commands: /start, /help, /bots, /profile, /support',
    'support': 'I\'m here to help! What specific issue are you experiencing?',
    'hello': 'Hello! Welcome to Reaper Market. How can I assist you today?',
    'price': 'Bot prices range from $50 to $500 depending on data quality and country.',
    'payment': 'We accept Bitcoin, Ethereum, and other cryptocurrencies.',
    'refund': 'Refunds are available within 24 hours if the bot data is invalid.'
  }

  const lowerMessage = userMessage.toLowerCase()
  let response = 'I understand you\'re asking about: "' + userMessage + '". How can I help you with this?'

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      response = value
      break
    }
  }

  return {
    id: Date.now() + 1,
    sender: 'bot',
    text: response,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const toggleBotStatus = () => {
  botOnline.value = !botOnline.value
}

const executeCommand = (command) => {
  const commandMessage = `Executing command: ${command.name} (/${command.command})`
  const userMessage = {
    id: Date.now(),
    sender: 'user',
    text: commandMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  messages.value.push(userMessage)
  scrollToBottom()
}

const openSupportTicket = () => {
  console.log('Opening support ticket')
  // Implement support ticket functionality
}

const openLiveChat = () => {
  console.log('Opening live chat')
  // Implement live chat functionality
}

const openKnowledgeBase = () => {
  console.log('Opening knowledge base')
  // Implement knowledge base functionality
}

const openFAQ = () => {
  console.log('Opening FAQ')
  // Implement FAQ functionality
}

onMounted(() => {
  scrollToBottom()
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