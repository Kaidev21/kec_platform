<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Pluie de cauris 🐚
 * ─────────────────────────────────────────────────────────────
 * Calque global (monté une fois dans App.vue). Déclenché partout via :
 *     useUiStore().rainCowries(80)
 * Les cauris tombent en tournoyant, rebondissent au sol puis s'effacent.
 * Les sprites sont pré-rendus pour rester fluides sur mobile d'entrée de gamme.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useUiStore } from '@/stores/ui'
import { COWRIE_BODY, COWRIE_SLIT, COWRIE_TEETH } from '@/components/brand/cowriePath'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const ui = useUiStore()
const canvas = ref(null)
let ctx, w, h, dpr, raf = null
let shells = []
const sprites = []

/** Pré-rend un cauri dans un petit canvas (plusieurs teintes) */
function makeSprite(tint) {
  const c = document.createElement('canvas')
  c.width = 60 * 2; c.height = 80 * 2
  const g = c.getContext('2d')
  g.scale(2, 2)
  const grad = g.createRadialGradient(22, 22, 2, 30, 40, 48)
  grad.addColorStop(0, '#fffaf0')
  grad.addColorStop(0.55, tint)
  grad.addColorStop(1, '#b39469')
  g.fillStyle = grad
  g.fill(new Path2D(COWRIE_BODY))
  g.strokeStyle = '#5a3a24'
  g.lineCap = 'round'
  g.lineWidth = 3.2
  g.stroke(new Path2D(COWRIE_SLIT))
  g.lineWidth = 1.5
  g.globalAlpha = 0.7
  g.stroke(new Path2D(COWRIE_TEETH))
  g.globalAlpha = 0.35
  g.fillStyle = '#fff'
  g.beginPath(); g.ellipse(20, 20, 6, 9, -0.35, 0, Math.PI * 2); g.fill()
  return c
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth; h = window.innerHeight
  canvas.value.width = w * dpr; canvas.value.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function spawn(amount) {
  for (let i = 0; i < amount; i++) {
    const size = 18 + Math.random() * 20
    shells.push({
      x: Math.random() * w,
      y: -40 - Math.random() * h * 0.9,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 1.5 + Math.random() * 2.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.12,
      flip: Math.random() * Math.PI, // simulation 3D (aplatissement horizontal)
      vflip: 0.03 + Math.random() * 0.06,
      size,
      sprite: sprites[(Math.random() * sprites.length) | 0],
      life: 1,
      bounced: 0,
      sway: Math.random() * Math.PI * 2
    })
  }
  if (!raf) raf = requestAnimationFrame(loop)
}

function loop() {
  ctx.clearRect(0, 0, w, h)
  const floor = h - 8
  for (const s of shells) {
    s.vy += 0.09
    s.sway += 0.03
    s.x += s.vx + Math.sin(s.sway) * 0.6
    s.y += s.vy
    s.rot += s.vr
    s.flip += s.vflip
    if (s.y + s.size * 0.6 > floor) {
      s.y = floor - s.size * 0.6
      s.vy *= -0.35
      s.vr *= 0.6
      s.vflip *= 0.5
      s.bounced++
    }
    if (s.bounced > 2) s.life -= 0.02
    ctx.save()
    ctx.globalAlpha = Math.max(0, s.life)
    ctx.translate(s.x, s.y)
    ctx.rotate(s.rot)
    ctx.scale(0.6 + Math.abs(Math.cos(s.flip)) * 0.4, 1)
    ctx.drawImage(s.sprite, -s.size / 2, -(s.size * 80 / 60) / 2, s.size, s.size * 80 / 60)
    ctx.restore()
  }
  shells = shells.filter((s) => s.life > 0)
  raf = shells.length ? requestAnimationFrame(loop) : null
  if (!raf) ctx.clearRect(0, 0, w, h)
}

watch(() => ui.rainRequest, () => {
  if (prefersReducedMotion()) return
  spawn(ui.rainAmount)
})

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  sprites.push(makeSprite('#efe3c9'), makeSprite('#f3e8d2'), makeSprite('#e6d2ad'))
  resize()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" class="cowrie-rain" aria-hidden="true" />
</template>

<style scoped>
.cowrie-rain { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9000; }
</style>
