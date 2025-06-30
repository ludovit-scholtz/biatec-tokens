<template>
  <MainLayout>
    <div class="min-h-screen px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Create New Token</h1>
          <p class="text-gray-300 text-lg">Choose your token standard and deploy in seconds</p>
        </div>

        <!-- Token Standard Selection -->
        <div class="glass-effect rounded-xl p-6 mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Select Token Standard</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              v-for="standard in tokenStore.tokenStandards"
              :key="standard.name"
              @click="selectedStandard = standard.name"
              :class="[
                'p-6 rounded-xl border-2 transition-all duration-200 text-left',
                selectedStandard === standard.name ? 'border-biatec-accent bg-biatec-accent/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5',
              ]"
            >
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="standard.bgClass">
                  <i :class="standard.icon + ' text-gray-900 dark:text-white'"></i>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ standard.name }}</h3>
                  <p class="text-sm text-gray-400">{{ standard.type }}</p>
                </div>
              </div>
              <p class="text-sm text-gray-300">{{ standard.description }}</p>
            </button>
          </div>
        </div>

        <!-- Token Creation Form -->
        <div v-if="selectedStandard" class="glass-effect rounded-xl p-6">
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Token Details</h2>
          <form @submit.prevent="createToken" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Token Name</label>
                <input
                  v-model="tokenForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent focus:ring-2 focus:ring-biatec-accent/20"
                  placeholder="e.g., My Awesome Token"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                <input
                  v-model="tokenForm.symbol"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent focus:ring-2 focus:ring-biatec-accent/20"
                  placeholder="e.g., MAT"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                v-model="tokenForm.description"
                required
                rows="3"
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent focus:ring-2 focus:ring-biatec-accent/20"
                placeholder="Describe your token's purpose and features..."
              ></textarea>
            </div>

            <!-- Token Type -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Token Type</label>
              <div class="flex space-x-4">
                <label class="flex items-center space-x-2">
                  <input v-model="tokenForm.type" type="radio" value="FT" class="w-4 h-4 text-biatec-accent focus:ring-biatec-accent" />
                  <span class="text-gray-900 dark:text-white">Fungible Token (FT)</span>
                </label>
                <label class="flex items-center space-x-2">
                  <input v-model="tokenForm.type" type="radio" value="NFT" class="w-4 h-4 text-biatec-accent focus:ring-biatec-accent" />
                  <span class="text-gray-900 dark:text-white">Non-Fungible Token (NFT)</span>
                </label>
              </div>
            </div>

            <!-- Supply and Decimals -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Total Supply</label>
                <input
                  v-model.number="tokenForm.supply"
                  type="number"
                  required
                  min="1"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent focus:ring-2 focus:ring-biatec-accent/20"
                  placeholder="1000000"
                />
              </div>
              <div v-if="tokenForm.type === 'FT'">
                <label class="block text-sm font-medium text-gray-300 mb-2">Decimals</label>
                <input
                  v-model.number="tokenForm.decimals"
                  type="number"
                  min="0"
                  max="18"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent focus:ring-2 focus:ring-biatec-accent/20"
                  placeholder="6"
                />
              </div>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Token Image</label>
              <div class="flex items-center space-x-4">
                <input type="file" @change="handleImageUpload" accept="image/*" class="hidden" ref="imageInput" />
                <button type="button" @click="imageInput?.click()" class="px-4 py-2 bg-biatec-accent/20 text-biatec-accent rounded-lg hover:bg-biatec-accent/30 transition-colors">
                  <i class="pi pi-upload mr-2"></i>
                  Upload Image
                </button>
                <span v-if="tokenForm.imageUrl" class="text-sm text-gray-300">Image uploaded</span>
              </div>
            </div>

            <!-- NFT Attributes (for NFTs only) -->
            <div v-if="tokenForm.type === 'NFT'" class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-gray-300">Attributes</label>
                <button type="button" @click="addAttribute" class="px-3 py-1 bg-biatec-accent/20 text-biatec-accent rounded-lg hover:bg-biatec-accent/30 transition-colors text-sm">
                  <i class="pi pi-plus mr-1"></i>
                  Add Attribute
                </button>
              </div>
              <div v-for="(attr, index) in tokenForm.attributes" :key="index" class="flex space-x-2">
                <input
                  v-model="attr.trait_type"
                  type="text"
                  placeholder="Trait type"
                  class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent"
                />
                <input
                  v-model="attr.value"
                  type="text"
                  placeholder="Value"
                  class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-biatec-accent"
                />
                <button type="button" @click="removeAttribute(index)" class="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="isCreating"
                class="btn-primary px-8 py-3 rounded-xl text-gray-900 dark:text-white font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i v-if="isCreating" class="pi pi-spin pi-spinner"></i>
                <i v-else class="pi pi-check"></i>
                <span>{{ isCreating ? "Creating Token..." : "Create Token" }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useTokenStore } from "../stores/tokens";
import MainLayout from "../layout/MainLayout.vue";

const router = useRouter();
const tokenStore = useTokenStore();

const selectedStandard = ref("");
const isCreating = ref(false);
const imageInput = ref<HTMLInputElement>();

const tokenForm = reactive({
  name: "",
  symbol: "",
  description: "",
  type: "FT" as "FT" | "NFT",
  supply: 1000000,
  decimals: 6,
  imageUrl: "",
  attributes: [] as Array<{ trait_type: string; value: string }>,
});

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // In a real app, you'd upload to IPFS or similar
    tokenForm.imageUrl = URL.createObjectURL(file);
  }
};

const addAttribute = () => {
  tokenForm.attributes.push({ trait_type: "", value: "" });
};

const removeAttribute = (index: number) => {
  tokenForm.attributes.splice(index, 1);
};

const createToken = async () => {
  if (!selectedStandard.value) return;

  isCreating.value = true;

  try {
    await tokenStore.createToken({
      name: tokenForm.name,
      symbol: tokenForm.symbol,
      standard: selectedStandard.value as any,
      type: tokenForm.type,
      supply: tokenForm.supply,
      decimals: tokenForm.type === "FT" ? tokenForm.decimals : undefined,
      description: tokenForm.description,
      imageUrl: tokenForm.imageUrl || undefined,
      attributes: tokenForm.type === "NFT" ? tokenForm.attributes.filter((attr) => attr.trait_type && attr.value) : undefined,
    });

    // Reset form
    Object.assign(tokenForm, {
      name: "",
      symbol: "",
      description: "",
      type: "FT",
      supply: 1000000,
      decimals: 6,
      imageUrl: "",
      attributes: [],
    });
    selectedStandard.value = "";

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("Failed to create token:", error);
  } finally {
    isCreating.value = false;
  }
};
</script>
