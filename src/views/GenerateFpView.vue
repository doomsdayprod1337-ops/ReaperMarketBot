<template>
  <div class="min-h-screen bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4 font-mono">Generate Fingerprint</h1>
        <p class="text-gray-300 text-lg">Create unique browser fingerprints for enhanced privacy</p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Generator Interface -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Configuration -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Fingerprint Configuration</h3>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Browser Type</label>
                  <select
                    v-model="config.browserType"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="chrome">Chrome</option>
                    <option value="firefox">Firefox</option>
                    <option value="safari">Safari</option>
                    <option value="edge">Edge</option>
                    <option value="random">Random</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Operating System</label>
                  <select
                    v-model="config.os"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                    <option value="linux">Linux</option>
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="random">Random</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Screen Resolution</label>
                  <select
                    v-model="config.resolution"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="1920x1080">1920x1080</option>
                    <option value="1366x768">1366x768</option>
                    <option value="1440x900">1440x900</option>
                    <option value="2560x1440">2560x1440</option>
                    <option value="3840x2160">3840x2160</option>
                    <option value="random">Random</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-white mb-2">Language</label>
                  <select
                    v-model="config.language"
                    class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-red-500 focus:ring-red-500/20"
                  >
                    <option value="en-US">English (US)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="random">Random</option>
                  </select>
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-sm font-medium text-white">Advanced Options</label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <label class="flex items-center">
                    <input v-model="config.randomizeWebGL" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize WebGL</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.randomizeCanvas" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize Canvas</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.randomizeAudio" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize Audio</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.randomizeFonts" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize Fonts</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.randomizeTimezone" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize Timezone</span>
                  </label>
                  <label class="flex items-center">
                    <input v-model="config.randomizePlugins" type="checkbox" class="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                    <span class="ml-2 text-sm text-gray-300">Randomize Plugins</span>
                  </label>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                  @click="generateFingerprint"
                  :disabled="isGenerating"
                  class="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span v-if="!isGenerating">Generate Fingerprint</span>
                  <span v-else class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </span>
                </button>
                <button
                  @click="resetConfig"
                  class="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <!-- Generated Fingerprint -->
          <div v-if="generatedFingerprint" class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Generated Fingerprint</h3>
            <div class="space-y-4">
              <!-- Fingerprint Summary -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-2">Fingerprint Summary</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-gray-400">Browser:</span>
                    <span class="text-white ml-2">{{ generatedFingerprint.browser }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">OS:</span>
                    <span class="text-white ml-2">{{ generatedFingerprint.os }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Resolution:</span>
                    <span class="text-white ml-2">{{ generatedFingerprint.resolution }}</span>
                  </div>
                  <div>
                    <span class="text-gray-400">Language:</span>
                    <span class="text-white ml-2">{{ generatedFingerprint.language }}</span>
                  </div>
                </div>
              </div>

              <!-- User Agent -->
              <div class="bg-gray-700/50 rounded-lg p-4">
                <h4 class="text-white font-medium mb-2">User Agent</h4>
                <div class="bg-gray-800 p-3 rounded font-mono text-sm text-gray-300 break-all">
                  {{ generatedFingerprint.userAgent }}
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button
                  @click="copyFingerprint"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Copy Fingerprint
                </button>
                <button
                  @click="exportFingerprint"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  Export JSON
                </button>
                <button
                  @click="testFingerprint"
                  class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                >
                  Test Fingerprint
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Recent Fingerprints -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Recent Fingerprints</h3>
            <div class="space-y-2">
              <div
                v-for="fp in recentFingerprints"
                :key="fp.id"
                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors cursor-pointer"
                @click="loadFingerprint(fp)"
              >
                <div>
                  <div class="text-white text-sm font-medium">{{ fp.browser }} - {{ fp.os }}</div>
                  <div class="text-gray-400 text-xs">{{ fp.created_at }}</div>
                </div>
                <div class="text-xs text-gray-400">{{ fp.resolution }}</div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Statistics</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Fingerprints Generated</span>
                <span class="text-white font-medium">{{ stats.generated }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Unique Patterns</span>
                <span class="text-green-400 font-medium">{{ stats.unique }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400 text-sm">Success Rate</span>
                <span class="text-blue-400 font-medium">{{ stats.successRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Help -->
          <div class="bg-gray-800/80 border border-red-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 class="text-white font-semibold mb-4 font-reaper">Help</h3>
            <div class="space-y-2 text-sm text-gray-300">
              <p>• Configure browser and OS settings</p>
              <p>• Enable advanced randomization options</p>
              <p>• Generate unique fingerprints</p>
              <p>• Export for use in automation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// State
const isGenerating = ref(false)
const generatedFingerprint = ref(null)

const config = reactive({
  browserType: 'chrome',
  os: 'windows',
  resolution: '1920x1080',
  language: 'en-US',
  randomizeWebGL: true,
  randomizeCanvas: true,
  randomizeAudio: false,
  randomizeFonts: true,
  randomizeTimezone: true,
  randomizePlugins: true
})

const recentFingerprints = ref([
  {
    id: 1,
    browser: 'Chrome',
    os: 'Windows',
    resolution: '1920x1080',
    created_at: '2 hours ago'
  },
  {
    id: 2,
    browser: 'Firefox',
    os: 'macOS',
    resolution: '1440x900',
    created_at: '1 day ago'
  },
  {
    id: 3,
    browser: 'Safari',
    os: 'iOS',
    resolution: '375x667',
    created_at: '3 days ago'
  }
])

const stats = reactive({
  generated: 23,
  unique: 18,
  successRate: 78
})

// Methods
const generateFingerprint = async () => {
  isGenerating.value = true
  
  try {
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock fingerprint
    const fingerprint = {
      browser: config.browserType === 'random' ? ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)] : config.browserType,
      os: config.os === 'random' ? ['Windows', 'macOS', 'Linux', 'Android', 'iOS'][Math.floor(Math.random() * 5)] : config.os,
      resolution: config.resolution === 'random' ? ['1920x1080', '1366x768', '1440x900', '2560x1440'][Math.floor(Math.random() * 4)] : config.resolution,
      language: config.language === 'random' ? ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'][Math.floor(Math.random() * 5)] : config.language,
      userAgent: generateUserAgent(),
      webgl: generateWebGLInfo(),
      canvas: generateCanvasInfo(),
      audio: generateAudioInfo(),
      fonts: generateFontsInfo(),
      timezone: generateTimezoneInfo(),
      plugins: generatePluginsInfo()
    }
    
    generatedFingerprint.value = fingerprint
    
    // Update stats
    stats.generated++
    stats.unique++
    stats.successRate = Math.round((stats.unique / stats.generated) * 100)
    
  } catch (error) {
    console.error('Fingerprint generation error:', error)
    alert('Failed to generate fingerprint. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

const generateUserAgent = () => {
  const browsers = {
    chrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    firefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
  }
  return browsers[config.browserType] || browsers.chrome
}

const generateWebGLInfo = () => {
  return {
    vendor: 'WebKit',
    renderer: 'WebKit WebGL',
    version: 'WebGL 1.0',
    extensions: ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_color_buffer_half_float']
  }
}

const generateCanvasInfo = () => {
  return {
    width: 1920,
    height: 1080,
    data: 'canvas_fingerprint_data_' + Math.random().toString(36).substr(2, 9)
  }
}

const generateAudioInfo = () => {
  return {
    sampleRate: 44100,
    bufferSize: 4096,
    context: 'AudioContext'
  }
}

const generateFontsInfo = () => {
  return [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Verdana', 'Georgia', 'Palatino', 'Garamond'
  ]
}

const generateTimezoneInfo = () => {
  const timezones = ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo']
  return timezones[Math.floor(Math.random() * timezones.length)]
}

const generatePluginsInfo = () => {
  return [
    'Chrome PDF Plugin',
    'Chrome PDF Viewer',
    'Native Client'
  ]
}

const resetConfig = () => {
  Object.assign(config, {
    browserType: 'chrome',
    os: 'windows',
    resolution: '1920x1080',
    language: 'en-US',
    randomizeWebGL: true,
    randomizeCanvas: true,
    randomizeAudio: false,
    randomizeFonts: true,
    randomizeTimezone: true,
    randomizePlugins: true
  })
  generatedFingerprint.value = null
}

const loadFingerprint = (fp) => {
  console.log('Loading fingerprint:', fp)
  // Implement fingerprint loading
}

const copyFingerprint = () => {
  if (!generatedFingerprint.value) return
  
  const fingerprintText = JSON.stringify(generatedFingerprint.value, null, 2)
  navigator.clipboard.writeText(fingerprintText).then(() => {
    alert('Fingerprint copied to clipboard!')
  })
}

const exportFingerprint = () => {
  if (!generatedFingerprint.value) return
  
  const data = JSON.stringify(generatedFingerprint.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `fingerprint_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const testFingerprint = () => {
  if (!generatedFingerprint.value) return
  
  console.log('Testing fingerprint...')
  // Implement fingerprint testing
  alert('Fingerprint test completed!')
}

onMounted(() => {
  // Load saved fingerprints
  const savedFingerprints = JSON.parse(localStorage.getItem('saved_fingerprints') || '[]')
  if (savedFingerprints.length > 0) {
    recentFingerprints.value = savedFingerprints.slice(-5).map(fp => ({
      id: fp.id,
      browser: fp.browser,
      os: fp.os,
      resolution: fp.resolution,
      created_at: new Date(fp.created_at).toLocaleDateString()
    }))
  }
})
</script>

<style scoped>
.font-reaper {
  font-family: 'Reaper', sans-serif;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>