<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleClose"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-black/70 backdrop-blur-sm"
            @click="handleClose"
          ></div>

          <!-- Modal -->
          <div
            class="relative w-full max-w-2xl transform rounded-xl bg-gray-900 border border-gray-700 shadow-2xl transition-all"
          >
            <!-- Header -->
            <div class="flex items-start justify-between p-6 border-b border-gray-700">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <i class="pi pi-exclamation-triangle text-yellow-400 text-2xl"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">
                    Incompatible Configuration
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    The selected options are not compatible with each other
                  </p>
                </div>
              </div>
              <button
                @click="handleClose"
                class="text-gray-400 hover:text-white transition-colors"
              >
                <i class="pi pi-times text-xl"></i>
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-6">
              <!-- Reason -->
              <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p class="text-sm text-gray-300">
                  {{ reason }}
                </p>
              </div>

              <!-- Current Selection -->
              <div v-if="currentSelection" class="space-y-3">
                <h4 class="text-sm font-semibold text-white">
                  Your Current Selection:
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div v-if="currentSelection.network" class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="text-xs text-gray-400 mb-1">Network:</p>
                    <p class="text-sm font-medium text-white">{{ currentSelection.network }}</p>
                  </div>
                  <div v-if="currentSelection.standard" class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="text-xs text-gray-400 mb-1">Standard:</p>
                    <p class="text-sm font-medium text-white">{{ currentSelection.standard }}</p>
                  </div>
                  <div v-if="currentSelection.wallet" class="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                    <p class="text-xs text-gray-400 mb-1">Wallet:</p>
                    <p class="text-sm font-medium text-white">{{ currentSelection.wallet }}</p>
                  </div>
                </div>
              </div>

              <!-- Alternatives -->
              <div v-if="alternatives && alternatives.length > 0" class="space-y-3">
                <h4 class="text-sm font-semibold text-white flex items-center gap-2">
                  <i class="pi pi-lightbulb text-biatec-accent"></i>
                  Suggested Alternatives:
                </h4>
                <div class="space-y-2">
                  <button
                    v-for="(alt, index) in alternatives"
                    :key="index"
                    :class="[
                      'w-full p-4 rounded-lg border-2 text-left transition-all',
                      'hover:border-biatec-accent hover:bg-biatec-accent/5',
                      'border-gray-700 bg-gray-800/50'
                    ]"
                    @click="handleSelectAlternative(alt)"
                  >
                    <div class="flex items-start gap-3">
                      <i class="pi pi-arrow-right text-biatec-accent mt-1"></i>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-white mb-1">
                          {{ alt.label }}
                        </p>
                        <p class="text-xs text-gray-400">
                          {{ alt.description }}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Learn More -->
              <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div class="flex items-start gap-3">
                  <i class="pi pi-info-circle text-blue-400 text-lg mt-0.5"></i>
                  <div class="flex-1">
                    <h5 class="text-sm font-semibold text-blue-400 mb-1">
                      Why does this matter?
                    </h5>
                    <p class="text-xs text-gray-400 mb-3">
                      Different blockchain networks support different token standards.
                      AVM networks (Algorand-based) support ASA and ARC standards, while
                      EVM networks (Ethereum-compatible) support ERC standards.
                    </p>
                    <button
                      @click="handleLearnMore"
                      class="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      Learn more about token standards
                      <i class="pi pi-external-link text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse md:flex-row gap-3 p-6 border-t border-gray-700">
              <button
                @click="handleClose"
                class="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                v-if="showViewMatrixButton"
                @click="handleViewMatrix"
                class="flex-1 px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-all font-medium flex items-center justify-center gap-2"
              >
                <i class="pi pi-table"></i>
                View Compatibility Matrix
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Alternative {
  label: string
  description: string
  action: () => void
}

interface CurrentSelection {
  network?: string
  standard?: string
  wallet?: string
}

interface Props {
  isOpen: boolean
  reason: string
  currentSelection?: CurrentSelection
  alternatives?: Alternative[]
  showViewMatrixButton?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'selectAlternative', alternative: Alternative): void
  (e: 'learnMore'): void
  (e: 'viewMatrix'): void
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  reason: '',
  alternatives: () => [],
  showViewMatrixButton: true,
})

const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}

const handleSelectAlternative = (alternative: Alternative) => {
  emit('selectAlternative', alternative)
  alternative.action()
  handleClose()
}

const handleLearnMore = () => {
  emit('learnMore')
}

const handleViewMatrix = () => {
  emit('viewMatrix')
  handleClose()
}
</script>
