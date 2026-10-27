<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Le café de la salle d'attente ☕
 * ─────────────────────────────────────────────────────────────
 * La bouilloire émaillée à fleurs (celle de toutes les cours
 * d'Afrique) et une tasse en terre cuite décorée de motifs bogolan.
 * Cliquer « servir » : la bouilloire s'incline, le café coule,
 * la tasse se remplit, la vapeur monte.
 */
import { ref } from 'vue'

const props = defineProps({ autoServe: { type: Boolean, default: false } })
const emit = defineEmits(['served'])
const state = ref(props.autoServe ? 'served' : 'empty') // empty | pouring | served

function serve() {
  if (state.value !== 'empty') return
  state.value = 'pouring'
  setTimeout(() => { state.value = 'served'; emit('served') }, 2300)
}
defineExpose({ serve })
</script>

<template>
  <div class="coffee" :class="state">
    <svg viewBox="0 0 320 260" class="scene" role="img" :aria-label="$t('waiting.coffeeAria')">
      <defs>
        <linearGradient id="enamel" x1="0" x2="1">
          <stop offset="0" stop-color="#e9dfcb" />
          <stop offset=".5" stop-color="#fbf6ea" />
          <stop offset="1" stop-color="#cdbfa4" />
        </linearGradient>
        <linearGradient id="clay" x1="0" x2="1">
          <stop offset="0" stop-color="#8a3a1d" />
          <stop offset=".45" stop-color="#c0612f" />
          <stop offset="1" stop-color="#7a321a" />
        </linearGradient>
        <linearGradient id="coffeeFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#6b3d1f" />
          <stop offset="1" stop-color="#2a170b" />
        </linearGradient>
        <clipPath id="cupInside"><path d="M196 168h88l-8 58c-1 8-8 14-16 14h-40c-8 0-15-6-16-14z" /></clipPath>
        <linearGradient id="tray" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#7a4f2e" />
          <stop offset="1" stop-color="#4a2e1a" />
        </linearGradient>
      </defs>

      <!-- Plateau en bois -->
      <ellipse cx="170" cy="246" rx="150" ry="12" fill="url(#tray)" />
      <ellipse cx="170" cy="243" rx="146" ry="9" fill="#8b5a34" opacity=".6" />

      <!-- Bouilloire émaillée à fleurs -->
      <g class="kettle">
        <path d="M60 120c-4-18 10-30 40-30s44 12 40 30l8 90c1 14-10 26-24 26H76c-14 0-25-12-24-26z" fill="url(#enamel)" />
        <path d="M58 132c30 8 54 8 84 0" stroke="#22344f" stroke-width="4" fill="none" />
        <path d="M54 206c34 8 58 8 92 0" stroke="#22344f" stroke-width="4" fill="none" />
        <!-- Fleurs émaillées -->
        <g class="flowers">
          <g transform="translate(100 168)">
            <circle r="5" fill="#d6a548" />
            <g fill="#c0612f"><circle cx="0" cy="-10" r="6" /><circle cx="10" cy="-2" r="6" /><circle cx="6" cy="9" r="6" /><circle cx="-6" cy="9" r="6" /><circle cx="-10" cy="-2" r="6" /></g>
            <circle r="4" fill="#d6a548" />
          </g>
          <path d="M80 182c6-6 10-6 14-2M118 182c-6-6-10-6-14-2" stroke="#5f6436" stroke-width="3" fill="none" stroke-linecap="round" />
          <g transform="translate(72 152) scale(.45)"><g fill="#22344f"><circle cx="0" cy="-10" r="6" /><circle cx="10" cy="-2" r="6" /><circle cx="6" cy="9" r="6" /><circle cx="-6" cy="9" r="6" /><circle cx="-10" cy="-2" r="6" /></g></g>
          <g transform="translate(128 152) scale(.45)"><g fill="#22344f"><circle cx="0" cy="-10" r="6" /><circle cx="10" cy="-2" r="6" /><circle cx="6" cy="9" r="6" /><circle cx="-6" cy="9" r="6" /><circle cx="-10" cy="-2" r="6" /></g></g>
        </g>
        <!-- Bec verseur -->
        <path d="M140 150c18-4 30-18 40-34l8 4c-8 22-24 40-46 46z" fill="url(#enamel)" />
        <!-- Couvercle + anse -->
        <ellipse cx="100" cy="92" rx="34" ry="7" fill="#d9ccb2" />
        <circle cx="100" cy="84" r="6" fill="#22344f" />
        <path d="M66 104c-30-6-38 48-6 64" stroke="#22344f" stroke-width="7" fill="none" stroke-linecap="round" />
      </g>

      <!-- Filet de café -->
      <path class="stream" d="M188 122c6 20 12 36 50 60" stroke="#4a2810" stroke-width="5" fill="none" stroke-linecap="round" />

      <!-- Tasse en terre cuite -->
      <g class="cup">
        <path d="M190 162h100l-10 66c-1 9-9 16-18 16h-44c-9 0-17-7-18-16z" fill="url(#clay)" />
        <g clip-path="url(#cupInside)">
          <rect class="level" x="190" y="170" width="100" height="80" fill="url(#coffeeFill)" />
        </g>
        <ellipse cx="240" cy="162" rx="50" ry="8" fill="#5a2814" />
        <ellipse class="surface" cx="240" cy="164" rx="44" ry="6" fill="#4a2810" />
        <!-- Motif bogolan sur la tasse -->
        <path d="M200 196h80M204 214h72" stroke="#f5ecdb" stroke-width="2" stroke-dasharray="6 5" opacity=".7" />
        <path d="M206 204l6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5" stroke="#1a110b" stroke-width="2" fill="none" opacity=".55" />
        <path d="M288 178c22-2 24 34 0 34" stroke="#8a3a1d" stroke-width="8" fill="none" stroke-linecap="round" />
      </g>

      <!-- Vapeur -->
      <g class="steam" fill="none" stroke="#f5ecdb" stroke-linecap="round" stroke-width="3">
        <path d="M222 150c-10-14 10-22 0-38s8-24 0-34" />
        <path d="M242 150c-10-14 10-22 0-38s8-24 0-34" />
        <path d="M262 150c-10-14 10-22 0-38s8-24 0-34" />
      </g>
    </svg>
    <slot :serve="serve" :state="state" />
  </div>
</template>

<style scoped lang="scss">
.coffee { position: relative; }
.scene { width: 100%; height: auto; overflow: visible; }

.kettle { transform-origin: 100px 236px; transition: transform 1s var(--ease-out); }
.pouring .kettle { transform: rotate(18deg) translate(10px, -22px); }

.stream { stroke-dasharray: 90; stroke-dashoffset: 90; opacity: 0; }
.pouring .stream { animation: pour 2.2s ease-in-out forwards; }
@keyframes pour {
  0%, 25% { opacity: 0; stroke-dashoffset: 90; }
  40% { opacity: 1; stroke-dashoffset: 0; }
  85% { opacity: 1; stroke-dashoffset: 0; }
  100% { opacity: 0; stroke-dashoffset: -90; }
}

.level { transform: translateY(80px); transition: transform 1.6s .7s var(--ease-out); }
.surface { opacity: 0; transition: opacity .4s 2s; }
.pouring .level, .served .level { transform: translateY(0); }
.served .surface { opacity: 1; }
.served .level { transition-delay: 0s; }

.steam path { opacity: 0; stroke-dasharray: 6 10; }
.served .steam path { animation: steam 3.2s ease-in-out infinite; }
.served .steam path:nth-child(2) { animation-delay: .9s; }
.served .steam path:nth-child(3) { animation-delay: 1.7s; }
@keyframes steam {
  0% { opacity: 0; transform: translateY(8px); }
  35% { opacity: .55; }
  100% { opacity: 0; transform: translateY(-26px); }
}
</style>
