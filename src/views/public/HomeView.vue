<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Accueil KEC
 * ─────────────────────────────────────────────────────────────
 * 1. Ciel d'harmattan : la poussière de latérite dessine le logo
 * 2. Globe : l'Afrique au centre, la diaspora reliée à Douala
 * 3. Services (créer, formaliser, développer…)
 * 4. Le parcours en 7 perles
 * 5. Programme SCALE 110 (110 cauris)
 * 6. Nostalgie : le village au crépuscule
 * 7. Kopen Mind
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import LateriteDust from '@/components/effects/LateriteDust.vue'
import AfricaGlobe from '@/components/effects/AfricaGlobe.vue'
import VillageDusk from '@/components/effects/VillageDusk.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'
import KButton from '@/components/ui/KButton.vue'
import KopenMindBox from '@/components/features/KopenMindBox.vue'
import { useUiStore } from '@/stores/ui'
import { api } from '@/services'
import { APP_CONFIG } from '@/config/app.config'
import { formatXaf, formatNumber } from '@/utils/format'
import { useCountUp } from '@/composables/useCountUp'

const { t, tm, rt, locale } = useI18n()
const ui = useUiStore()
const formed = ref(false)
const copyShown = ref(false) // le texte de gauche apparaît 1 s après le début de l'animation, sans attendre la fin
const stats = ref({ total: 0 })

onMounted(async () => {
  setTimeout(() => { copyShown.value = true }, 1000)
  stats.value = await api.waitlist.publicStats()
})
const waitingCount = useCountUp(computed(() => stats.value.total))

const services = ['create', 'formalize', 'grow', 'vault', 'manu', 'consultant']
const SERVICE_ICONS = { create: '⌂', formalize: '⚖', grow: '❋', vault: '⛉', manu: '☺', consultant: '☏' }
const journey = computed(() => tm('home.journey.steps').map((s) => rt(s)))
const price = computed(() => formatXaf(APP_CONFIG.program.priceXaf, locale.value))

/**
 * Cauris ambiants : de temps à autre, 1 à 4 cauris tombent du ciel
 * (toutes les 7 à 16 s, après l'apparition du logo). Jamais en rafale,
 * mais assez souvent pour qu'on les remarque. Stoppé quand l'onglet est caché.
 */
let ambientTimer = null
function scheduleAmbient() {
  ambientTimer = setTimeout(() => {
    if (!document.hidden) ui.rainCowries(1 + Math.floor(Math.random() * 4))
    scheduleAmbient()
  }, 7000 + Math.random() * 9000)
}
onBeforeUnmount(() => clearTimeout(ambientTimer))

function onFormed() {
  formed.value = true
  // Un premier cauri tombe du ciel quand le logo apparaît, puis les suivants par intermittence
  setTimeout(() => ui.rainCowries(14), 400)
  if (!ambientTimer) scheduleAmbient()
}
</script>

<template>
  <div class="home">
    <!-- ═══ 1. HERO : ciel d'harmattan ═══ -->
    <section class="hero">
      <div class="sky" aria-hidden="true" />
      <div class="sun" aria-hidden="true" />
      <div class="dust-stage"><LateriteDust :scale="0.5" @formed="onFormed" /></div>
      <div class="hero-copy container" :class="{ show: copyShown || formed }">
        <span class="eyebrow">{{ $t('home.hero.eyebrow') }}</span>
        <h1>
          {{ $t('home.hero.title1') }}
          <span class="serif-italic text-gold">{{ $t('home.hero.title2') }}</span>
        </h1>
        <p class="lead">{{ $t('home.hero.lead') }}</p>
        <div class="ctas">
          <KButton size="lg" :to="{ name: 'waiting-room' }">{{ $t('home.hero.ctaWaitlist') }}</KButton>
          <KButton size="lg" variant="cola" :to="{ name: 'home', hash: '#programme' }">{{ $t('home.hero.ctaProgram') }}</KButton>
        </div>
        <p class="live"><span class="pulse" /> {{ $t('home.hero.waiting', { n: formatNumber(waitingCount, locale) }) }}</p>
      </div>
      <a href="#globe" class="scroll-cue" :aria-label="$t('home.hero.scroll')"><span /></a>
    </section>

    <!-- ═══ 2. GLOBE ═══ -->
    <section id="globe" class="globe-sec container">
      <div class="globe-col" v-reveal><AfricaGlobe /></div>
      <div class="globe-copy" v-reveal="150">
        <span class="eyebrow">{{ $t('home.globe.eyebrow') }}</span>
        <h2>{{ $t('home.globe.title') }}</h2>
        <p class="text-muted">{{ $t('home.globe.text') }}</p>
        <ul class="facts">
          <li><strong>110</strong><span>{{ $t('home.globe.fellows') }}</span></li>
          <li><strong>6</strong><span>{{ $t('home.globe.months') }}</span></li>
          <li><strong>10+1</strong><span>{{ $t('home.globe.regions') }}</span></li>
          <li><strong>17</strong><span>{{ $t('home.globe.ohada') }}</span></li>
        </ul>
      </div>
    </section>

    <!-- ═══ 3. SERVICES ═══ -->
    <section id="services" class="services container">
      <header class="sec-head" v-reveal>
        <span class="eyebrow">{{ $t('home.services.eyebrow') }}</span>
        <h2>{{ $t('home.services.title') }}</h2>
        <p class="text-muted">{{ $t('home.services.lead') }}</p>
      </header>
      <div class="cards">
        <article v-for="(s, i) in services" :key="s" class="card wood-panel" v-reveal="i * 90">
          <span class="ico" aria-hidden="true">{{ SERVICE_ICONS[s] }}</span>
          <h3>{{ $t(`home.services.items.${s}.title`) }}</h3>
          <p class="text-muted">{{ $t(`home.services.items.${s}.text`) }}</p>
        </article>
      </div>
    </section>

    <!-- ═══ 4. PARCOURS ═══ -->
    <section class="journey">
      <div class="container">
        <header class="sec-head" v-reveal>
          <span class="eyebrow">{{ $t('home.journey.eyebrow') }}</span>
          <h2>{{ $t('home.journey.title') }}</h2>
        </header>
        <ol class="string">
          <li v-for="(step, i) in journey" :key="i" v-reveal="i * 110">
            <span class="pearl"><CowrieShape :size="16" :tone="i === journey.length - 1 ? 'gold' : 'ivory'" /></span>
            <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="lbl">{{ step }}</span>
          </li>
        </ol>
      </div>
    </section>

    <!-- ═══ 5. PROGRAMME 110 ═══ -->
    <section id="programme" class="program container">
      <div class="program-box clay-panel" v-reveal>
        <div class="cowrie-field" aria-hidden="true">
          <CowrieShape v-for="n in 110" :key="n" :size="11"  :style="{ animationDelay: `${(n % 22) * 70}ms` }" />
        </div>
        <div class="program-copy">
          <span class="eyebrow">{{ $t('home.program.eyebrow') }}</span>
          <h2>{{ $t('home.program.title') }}</h2>
          <p>{{ $t('home.program.text') }}</p>
          <ul class="ticks">
            <li v-for="k in ['selection', 'duration', 'certification', 'price']" :key="k">
              <CowrieShape :size="12" /> {{ $t(`home.program.points.${k}`, { price }) }}
            </li>
          </ul>
          <KButton size="lg" :to="{ name: 'waiting-room' }">{{ $t('home.program.cta') }}</KButton>
          <p class="deadline text-muted">{{ $t('home.program.deadline') }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ 6. NOSTALGIE ═══ -->
    <section class="nostalgia">
      <VillageDusk class="scene" />
      <div class="nostalgia-copy container" v-reveal>
        <span class="eyebrow">{{ $t('home.nostalgia.eyebrow') }}</span>
        <h2 class="serif-italic">{{ $t('home.nostalgia.title') }}</h2>
        <p>{{ $t('home.nostalgia.text') }}</p>
        <KButton variant="wood" :to="{ name: 'waiting-room' }">{{ $t('home.nostalgia.cta') }}</KButton>
      </div>
    </section>

    <!-- ═══ 7. KOPEN MIND ═══ -->
    <section class="container kopen" v-reveal>
      <KopenMindBox />
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ── Hero ─────────────────────────────── */
.hero { position: relative; min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; padding-bottom: 5.5rem; }
.sky {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 50% at 70% 30%, rgba(240, 180, 90, .35), transparent 70%),
    linear-gradient(180deg, #1a110b 0%, #4a1f10 38%, #a8401f 72%, #d98a55 100%);
}
.sky::after { content: ''; position: absolute; inset: 0; @include clay-grain(.22); mix-blend-mode: overlay; }
.sun { position: absolute; width: 52vmin; height: 52vmin; right: 6%; top: 20%; border-radius: 50%; background: radial-gradient(circle, rgba(255, 225, 170, .55), rgba(240, 160, 80, .1) 60%, transparent 70%); filter: blur(4px); animation: breathe 8s ease-in-out infinite; }
@keyframes breathe { 50% { transform: scale(1.08); opacity: .8; } }
.dust-stage { position: absolute; inset: 4rem 0 52% 0; @include md-up { inset: 10% 0 18% 46%; } }

.hero-copy { position: relative; z-index: 2; opacity: 0; transform: translateY(24px); transition: all 1.2s var(--ease-out); pointer-events: none; }
.hero-copy.show { opacity: 1; transform: none; pointer-events: auto; }
.hero-copy > * { @include md-up { max-width: min(620px, 50vw); } }
.hero-copy h1 { max-width: 16ch; text-shadow: 0 4px 30px rgba(0, 0, 0, .35); font-size: clamp(2rem, 5vw, 4rem); }
.lead { max-width: 52ch; font-size: clamp(1rem, 1.6vw, 1.15rem); color: #f6e7d3; }
.ctas { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.75rem 0 1.25rem; }
.live { display: inline-flex; align-items: center; gap: .6rem; font-size: .88rem; color: #f6e7d3; margin: 0; }
.pulse { width: 9px; height: 9px; border-radius: 50%; background: #8fbf5a; box-shadow: 0 0 0 0 rgba(143, 191, 90, .6); animation: live 1.8s infinite; }
@keyframes live { 70% { box-shadow: 0 0 0 10px rgba(143, 191, 90, 0); } 100% { box-shadow: 0 0 0 0 rgba(143, 191, 90, 0); } }
.scroll-cue { position: absolute; z-index: 2; left: 50%; bottom: 1.4rem; width: 26px; height: 42px; border: 2px solid rgba(245, 236, 219, .5); border-radius: 20px; transform: translateX(-50%); display: none; @include md-up { display: block; }
  span { position: absolute; left: 50%; top: 8px; width: 4px; height: 8px; margin-left: -2px; border-radius: 2px; background: var(--kec-ivory); animation: wheel 1.8s infinite; } }
@keyframes wheel { to { transform: translateY(14px); opacity: 0; } }

/* ── Sections ─────────────────────────── */
section:not(.hero) { padding-block: clamp(4rem, 9vw, 7rem); }
.sec-head { max-width: 640px; margin-bottom: 3rem; }

.globe-sec { display: grid; gap: 2rem; align-items: center; @include md-up { grid-template-columns: 1.05fr 1fr; gap: 4rem; } }
.globe-col { max-width: 560px; width: 100%; margin-inline: auto; }
.facts { list-style: none; padding: 0; margin: 2rem 0 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
  li { padding: 1rem 1.2rem; border-left: 2px solid var(--kec-gold); background: linear-gradient(90deg, rgba(214, 165, 72, .08), transparent); border-radius: 0 12px 12px 0; }
  strong { display: block; font-family: var(--font-display); font-size: 2rem; color: var(--kec-gold-soft); line-height: 1.1; }
  span { font-size: .85rem; color: var(--kec-text-muted); } }

.cards { display: grid; gap: 1.25rem; grid-template-columns: 1fr; @include sm-up { grid-template-columns: 1fr 1fr; } @include lg-up { grid-template-columns: repeat(3, 1fr); } }
.card { padding: 1.75rem; transition: transform .5s var(--ease-spring), box-shadow .5s;
  &:hover { transform: translateY(-6px) rotate(-.4deg); box-shadow: var(--shadow-glow); }
  &:nth-child(3n+2) { border-radius: 40px 18px 40px 18px; }
  &:nth-child(3n) { border-radius: 18px 40px 18px 40px; }
  h3 { margin-top: 1rem; }
  p { margin: 0; font-size: .95rem; } }
.ico { width: 54px; height: 54px; display: grid; place-items: center; font-size: 1.5rem; color: #2a1a12; border-radius: var(--radius-pebble); background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548 75%); }

.journey { background: linear-gradient(180deg, transparent, rgba(90, 58, 36, .25), transparent); }
.string { list-style: none; padding: 0; margin: 0; display: grid; gap: 1.2rem; position: relative;
  grid-template-columns: 1fr; @include md-up { grid-template-columns: repeat(7, 1fr); gap: .5rem; }
  &::before { content: ''; position: absolute; background: linear-gradient(var(--kec-taupe), var(--kec-gold)); opacity: .5;
    left: 21px; top: 10px; bottom: 10px; width: 2px;
    @include md-up { left: 6%; right: 6%; top: 21px; bottom: auto; width: auto; height: 2px; background: linear-gradient(90deg, var(--kec-taupe), var(--kec-gold)); } }
  li { position: relative; display: grid; grid-template-columns: 44px auto 1fr; align-items: center; gap: .75rem;
    @include md-up { display: flex; flex-direction: column; text-align: center; gap: .6rem; } }
  .pearl { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 35% 30%, #5a3a24, #24170f); box-shadow: inset 0 0 0 1.5px var(--kec-gold); z-index: 1; }
  .n { font-family: var(--font-display); color: var(--kec-gold); font-size: .9rem; }
  .lbl { font-weight: 700; font-size: .95rem; } }

.program-box { display: grid; gap: 2.5rem; padding: clamp(1.5rem, 4vw, 3.5rem); overflow: hidden; position: relative; @include md-up { grid-template-columns: 1fr 1.1fr; align-items: center; } }
.cowrie-field { display: grid; grid-template-columns: repeat(11, 1fr); gap: 10px 8px; justify-items: center; padding: 1rem;
  :deep(svg) { animation: drop .8s var(--ease-spring) both; } }
@keyframes drop { from { opacity: 0; transform: translateY(-30px) rotate(90deg); } }
.ticks { list-style: none; padding: 0; margin: 1.5rem 0 2rem; display: grid; gap: .7rem; li { display: flex; gap: .7rem; align-items: center; } }
.deadline { font-size: .85rem; margin-top: 1rem; }

.nostalgia { position: relative; min-height: 640px; display: flex; align-items: flex-start; overflow: hidden; padding: 0 !important; }
.scene { position: absolute; inset: 0; }
.nostalgia-copy { position: relative; z-index: 1; padding-top: clamp(3rem, 8vw, 6rem); max-width: 760px; margin-inline: auto; text-align: center;
  .eyebrow { justify-content: center; }
  h2 { font-size: clamp(2rem, 4.4vw, 3.4rem); }
  p { font-size: 1.08rem; color: #f8e9d6; text-shadow: 0 2px 12px rgba(0, 0, 0, .5); } }
.kopen { padding-top: 5rem; }
</style>
