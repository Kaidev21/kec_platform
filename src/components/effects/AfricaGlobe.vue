<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Globe terrestre qui tourne en mettant l'Afrique en avant 🌍
 * ─────────────────────────────────────────────────────────────
 * - Projection orthographique (d3-geo) sur canvas.
 * - L'Afrique est dorée ; le Cameroun pulse (point de départ de KEC).
 * - La rotation RALENTIT quand l'Afrique passe devant : le regard s'y pose.
 * - Des arcs d'or relient la diaspora (Paris, Berlin, Bruxelles,
 *   Montréal, Washington…) à Douala : « la maison vous attend ».
 * - Glisser pour faire tourner à la main.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'
import { AFRICA_ISO_NUMERIC, CAMEROON_ISO_NUMERIC } from '@/config/geo'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  arcs: { type: Boolean, default: true },
  speed: { type: Number, default: 14 } // degrés / seconde hors Afrique
})

const canvas = ref(null)
const loaded = ref(false)
let ctx, size, dpr, raf, ro, io
let projection, path, countries = [], africa = [], cameroon = null
let lambda = -80 // départ : océan Indien face à nous, la rotation amène vite l'Afrique
let phi = -8
let last = 0
let visible = true
let drag = null

const AFRICA_CENTER = [18, 3]
const DOUALA = [9.7, 4.05]
const DIASPORA = [
  [2.35, 48.85], // Paris
  [13.4, 52.52], // Berlin
  [4.35, 50.85], // Bruxelles
  [-73.57, 45.5], // Montréal
  [-77.04, 38.9], // Washington
  [-0.13, 51.5], // Londres
  [55.3, 25.27], // Dubaï
  [121.47, 31.23] // Shanghai
]
const graticule = geoGraticule10()

function resize() {
  const rect = canvas.value.parentElement.getBoundingClientRect()
  size = Math.floor(Math.min(rect.width, rect.height || rect.width))
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = size * dpr
  canvas.value.height = size * dpr
  canvas.value.style.width = `${size}px`
  canvas.value.style.height = `${size}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  projection = geoOrthographic().translate([size / 2, size / 2]).scale(size * 0.44).clipAngle(90).precision(0.6)
  path = geoPath(projection, ctx)
}

function draw(t) {
  const r = projection.scale()
  const c = size / 2
  ctx.clearRect(0, 0, size, size)
  projection.rotate([lambda, phi])

  // Halo atmosphérique doré
  const halo = ctx.createRadialGradient(c, c, r * 0.92, c, c, r * 1.16)
  halo.addColorStop(0, 'rgba(214,165,72,.35)')
  halo.addColorStop(1, 'rgba(214,165,72,0)')
  ctx.fillStyle = halo
  ctx.beginPath(); ctx.arc(c, c, r * 1.16, 0, Math.PI * 2); ctx.fill()

  // Océan : bois sombre profond
  const ocean = ctx.createRadialGradient(c - r * 0.35, c - r * 0.4, r * 0.1, c, c, r)
  ocean.addColorStop(0, '#3a2718')
  ocean.addColorStop(1, '#140c07')
  ctx.fillStyle = ocean
  ctx.beginPath(); path({ type: 'Sphere' }); ctx.fill()

  // Graticule
  ctx.beginPath(); path(graticule)
  ctx.strokeStyle = 'rgba(233,201,131,.07)'; ctx.lineWidth = 0.6; ctx.stroke()

  // Autres pays
  ctx.beginPath()
  countries.forEach((f) => path(f))
  ctx.fillStyle = '#4b3324'; ctx.fill()
  ctx.strokeStyle = 'rgba(20,12,7,.6)'; ctx.lineWidth = 0.5; ctx.stroke()

  // Afrique : or -> terre cuite, avec lueur quand elle fait face
  const facing = 1 - Math.min(1, geoDistance(AFRICA_CENTER, [-lambda, -phi]) / 1.6)
  const gold = ctx.createLinearGradient(c, c - r, c, c + r)
  gold.addColorStop(0, '#f0cf86')
  gold.addColorStop(0.5, '#d6a548')
  gold.addColorStop(1, '#c0612f')
  ctx.save()
  ctx.shadowColor = 'rgba(240,190,90,.85)'
  ctx.shadowBlur = 8 + facing * 26
  ctx.beginPath(); africa.forEach((f) => path(f))
  ctx.fillStyle = gold; ctx.fill()
  ctx.restore()
  ctx.beginPath(); africa.forEach((f) => path(f))
  ctx.strokeStyle = 'rgba(90,50,20,.55)'; ctx.lineWidth = 0.6; ctx.stroke()

  // Cameroun
  if (cameroon) {
    ctx.beginPath(); path(cameroon)
    ctx.fillStyle = '#a8401f'; ctx.fill()
  }

  // Arcs de la diaspora vers Douala
  if (props.arcs) {
    DIASPORA.forEach((city, i) => {
      const interp = geoInterpolate(city, DOUALA)
      const cycle = ((t / 1000 + i * 0.7) % 5) / 3.2 // 0 -> ~1.5
      const head = Math.min(1, cycle)
      const tail = Math.max(0, Math.min(1, cycle - 0.45))
      if (head <= tail) return
      const coords = []
      for (let s = tail; s <= head; s += 0.02) coords.push(interp(s))
      coords.push(interp(head))
      ctx.beginPath(); path({ type: 'LineString', coordinates: coords })
      ctx.strokeStyle = 'rgba(240,207,134,.85)'; ctx.lineWidth = 1.4; ctx.stroke()
      // Ville d'origine
      if (geoDistance(city, [-lambda, -phi]) < Math.PI / 2) {
        const [x, y] = projection(city)
        ctx.fillStyle = 'rgba(245,236,219,.8)'
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill()
      }
    })
  }

  // Pulsation sur Douala
  if (geoDistance(DOUALA, [-lambda, -phi]) < Math.PI / 2) {
    const [x, y] = projection(DOUALA)
    const pulse = (t / 1400) % 1
    ctx.strokeStyle = `rgba(245,236,219,${1 - pulse})`
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(x, y, 3 + pulse * 16, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = '#f5ecdb'
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
  }

  // Ombrage jour/nuit pour le volume
  const shade = ctx.createRadialGradient(c - r * 0.45, c - r * 0.5, r * 0.2, c, c, r * 1.05)
  shade.addColorStop(0, 'rgba(255,240,210,.10)')
  shade.addColorStop(0.6, 'rgba(0,0,0,0)')
  shade.addColorStop(1, 'rgba(0,0,0,.55)')
  ctx.fillStyle = shade
  ctx.beginPath(); path({ type: 'Sphere' }); ctx.fill()
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  const dt = Math.min(0.05, (now - (last || now)) / 1000)
  last = now
  if (!visible || !countries.length) return
  if (!drag && !prefersReducedMotion()) {
    // Ralentit fortement à l'approche de l'Afrique (lambda ≈ -18)
    const delta = ((((lambda + 18) % 360) + 540) % 360) - 180 // distance signée en degrés
    const near = Math.min(1, Math.abs(delta) / 70)
    const slow = 0.07 + 0.93 * near * near
    lambda += props.speed * slow * dt
    phi += (-8 - phi) * 0.02
  }
  draw(now)
}

function onDown(e) {
  drag = { x: e.clientX, y: e.clientY, l: lambda, p: phi }
  canvas.value.setPointerCapture?.(e.pointerId)
}
function onMove(e) {
  if (!drag) return
  lambda = drag.l + (e.clientX - drag.x) * 0.35
  phi = Math.max(-45, Math.min(45, drag.p - (e.clientY - drag.y) * 0.25))
}
const onUp = () => { drag = null }

onMounted(async () => {
  ctx = canvas.value.getContext('2d')
  resize()
  // Chargement différé de la carte du monde (code-splitting)
  const world = (await import('world-atlas/countries-110m.json')).default
  const all = feature(world, world.objects.countries).features
  africa = all.filter((f) => AFRICA_ISO_NUMERIC.has(String(f.id).padStart(3, '0')))
  cameroon = all.find((f) => String(f.id).padStart(3, '0') === CAMEROON_ISO_NUMERIC)
  countries = all.filter((f) => !AFRICA_ISO_NUMERIC.has(String(f.id).padStart(3, '0')))
  if (prefersReducedMotion()) lambda = -18
  loaded.value = true
  ro = new ResizeObserver(resize)
  ro.observe(canvas.value.parentElement)
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(canvas.value)
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
})
</script>

<template>
  <div class="globe-wrap" :class="{ loaded }">
    <canvas
      ref="canvas" role="img" aria-label="Globe terrestre centré sur l'Afrique"
      @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp"
    />
  </div>
</template>

<style scoped>
.globe-wrap { position: relative; width: 100%; aspect-ratio: 1; display: grid; place-items: center; opacity: 0; transition: opacity 1.2s var(--ease-out); }
.globe-wrap.loaded { opacity: 1; }
canvas { cursor: grab; touch-action: pan-y; }
canvas:active { cursor: grabbing; }
</style>
