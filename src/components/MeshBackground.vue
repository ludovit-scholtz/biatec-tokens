<template>
  <div class="mesh-background" ref="meshContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../stores/theme'

const meshContainer = ref<HTMLElement>()
const themeStore = useThemeStore()

let animationId: number
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D | null

const particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}> = []

const lightColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981']
const darkColors = ['#1e40af', '#7c3aed', '#0891b2', '#059669']

const initializeCanvas = () => {
  if (!meshContainer.value) return

  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')
  
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.opacity = '0.4'
  canvas.style.zIndex = '-1'
  canvas.style.pointerEvents = 'none'
  
  meshContainer.value.appendChild(canvas)

  // Initialize particles
  particles.length = 0
  const colors = themeStore.isDark ? darkColors : lightColors
  
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 40 + 20,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
  }
}

const animate = () => {
  if (!ctx || !canvas) return
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const colors = themeStore.isDark ? darkColors : lightColors
  
  // Update particle colors based on theme
  particles.forEach((particle, index) => {
    if (Math.random() < 0.001) { // Occasionally update color
      particle.color = colors[Math.floor(Math.random() * colors.length)]
    }
  })
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.x += particle.vx
    particle.y += particle.vy
    
    if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
    if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
    
    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    )
    gradient.addColorStop(0, particle.color + '30')
    gradient.addColorStop(1, particle.color + '00')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    ctx.fill()
  })
  
  // Draw connections
  ctx.strokeStyle = themeStore.isDark ? '#3b82f620' : '#8b5cf620'
  ctx.lineWidth = 1
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 120) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }
  
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

onMounted(() => {
  initializeCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})

// Watch for theme changes and update colors
watch(() => themeStore.isDark, () => {
  const colors = themeStore.isDark ? darkColors : lightColors
  particles.forEach(particle => {
    particle.color = colors[Math.floor(Math.random() * colors.length)]
  })
})
</script>