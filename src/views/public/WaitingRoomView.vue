<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  La salle d'attente virtuelle ☕ (liste d'attente pré-pilote)
 * ─────────────────────────────────────────────────────────────
 * Mur en terre, fenêtre en arche sur le couchant, bancs en bois,
 * bouilloire émaillée : on s'assoit, on prend un café, on remplit
 * sa fiche. Compteur et arrivées en direct (social proof pour
 * les investisseurs). Les 110 seront choisis parmi les inscrits.
 */
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useUiStore } from '@/stores/ui'
import { useLiveEvents } from '@/composables/useLiveEvents'
import { useCountUp } from '@/composables/useCountUp'
import { formatNumber, timeAgo } from '@/utils/format'
import AfricanCoffee from '@/components/effects/AfricanCoffee.vue'
import WaitingRoomScene from '@/components/effects/WaitingRoomScene.vue'
import WaitingBench from '@/components/effects/WaitingBench.vue'
import ManuAvatar from '@/components/assistant/ManuAvatar.vue'
import WaitlistForm from '@/components/features/WaitlistForm.vue'
import WaitingTicket from '@/components/features/WaitingTicket.vue'
import KButton from '@/components/ui/KButton.vue'

const { t, tm, rt, locale } = useI18n()
const ui = useUiStore()

const stats = ref({ total: 0, today: 0, diaspora: 0, seats: 110, recent: [] })
const result = ref(null)
const coffeeServed = ref(false)
const proverbIndex = ref(0)
const coffee = ref(null)
const arrivals = ref(0) // chaque incrément fait entrer quelqu'un dans la salle
let proverbTimer

const total = useCountUp(computed(() => stats.value.total))
const proverbs = computed(() => tm('waiting.proverbs').map((p) => rt(p)))

onMounted(async () => {
  stats.value = await api.waitlist.publicStats()
  proverbTimer = setInterval(() => { proverbIndex.value = (proverbIndex.value + 1) % proverbs.value.length }, 7000)
})
onBeforeUnmount(() => clearInterval(proverbTimer))

// Nouvelles arrivées en direct (autres onglets / simulateur / API réelle)
useLiveEvents((e) => {
  if (e.type !== 'waitlist.signup') return
  stats.value = {
    ...stats.value,
    total: stats.value.total + 1,
    today: stats.value.today + 1,
    recent: [{ firstName: e.payload.firstName, city: e.payload.targetCity, residence: e.payload.residenceCountry, at: e.at }, ...stats.value.recent].slice(0, 8)
  }
  arrivals.value++
}, { simulate: true })

function onJoined(res) {
  result.value = res
  ui.rainCowries(110) // 110 cauris : un pour chaque place du pilote
  arrivals.value++ // et vous entrez dans la salle
  if (!coffeeServed.value) coffee.value?.serve()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="room">
    <!-- Décor animé : ventilateur, horloge, fenêtre, lampe, porte, banc et ses occupants -->
    <WaitingRoomScene />

    <div class="container layout">
      <!-- Colonne d'accueil -->
      <section class="welcome">
        <span class="eyebrow">{{ $t('waiting.eyebrow') }}</span>
        <h1>{{ $t('waiting.title') }}</h1>
        <div class="manu-says">
          <ManuAvatar :size="52" />
          <p>{{ coffeeServed ? $t('waiting.manuServed') : $t('waiting.manuHello') }}</p>
        </div>

        <WaitingBench class="bench" :seated="4" :arrival="arrivals" />

        <AfricanCoffee ref="coffee" class="coffee" @served="coffeeServed = true">
          <template #default="{ serve, state }">
            <KButton v-if="state === 'empty'" variant="cola" size="sm" class="serve" @click="serve">{{ $t('waiting.serve') }}</KButton>
          </template>
        </AfricanCoffee>

        <div class="counters">
          <div><strong>{{ formatNumber(total, locale) }}</strong><span>{{ $t('waiting.waitingNow') }}</span></div>
          <div><strong>{{ stats.seats }}</strong><span>{{ $t('waiting.seats') }}</span></div>
          <div><strong>{{ stats.today }}</strong><span>{{ $t('waiting.today') }}</span></div>
        </div>

        <ul class="arrivals" aria-live="polite">
          <TransitionGroup name="arrive">
            <li v-for="r in stats.recent.slice(0, 4)" :key="r.firstName + r.at">
              <span class="dot" />
              <span>{{ $t('waiting.arrived', { name: r.firstName, city: r.city }) }}</span>
              <small>{{ timeAgo(r.at, locale) }}</small>
            </li>
          </TransitionGroup>
        </ul>

        <Transition name="proverb" mode="out-in">
          <blockquote :key="proverbIndex" class="proverb">« {{ proverbs[proverbIndex] }} »</blockquote>
        </Transition>
      </section>

      <!-- Formulaire / Ticket -->
      <section class="desk wood-panel">
        <Transition name="page" mode="out-in">
          <WaitingTicket v-if="result" :entry="result.entry" :total="result.total" :seats="result.seats" />
          <div v-else>
            <h2 class="desk-title">{{ $t('waiting.formTitle') }}</h2>
            <p class="text-muted">{{ $t('waiting.formLead') }}</p>
            <WaitlistForm @joined="onJoined" />
          </div>
        </Transition>
      </section>
    </div>

  </div>
</template>

<style scoped lang="scss">
.room {
  position: relative; min-height: 100vh; padding: 7.5rem 0 5rem; overflow: hidden;
  background:
    radial-gradient(70% 50% at 20% 10%, rgba(240, 180, 90, .18), transparent 70%),
    linear-gradient(180deg, #6e3219 0%, #4a2414 55%, #2a170d 100%);
}
.room::before { content: ''; position: absolute; inset: 0; @include clay-grain(.3); mix-blend-mode: multiply; opacity: .9; pointer-events: none; }

.layout { position: relative; z-index: 1; display: grid; gap: 2.5rem; @include md-up { grid-template-columns: .9fr 1.1fr; align-items: start; } }

.welcome h1 { font-size: clamp(2rem, 4.2vw, 3.3rem); }
.manu-says { display: flex; gap: 1rem; align-items: flex-start; margin: 1.25rem 0;
  p { margin: 0; padding: .9rem 1.1rem; border-radius: 4px 18px 18px 18px; background: rgba(245, 236, 219, .95); color: #2a1a12; font-size: .95rem; line-height: 1.5; box-shadow: var(--shadow-soft); } }
.serve { margin: .5rem auto 0; display: flex; width: fit-content; }
.counters { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin: 1.5rem 0;
  div { padding: .9rem; border-radius: 16px; background: rgba(26, 17, 11, .45); border: 1px solid var(--kec-border); text-align: center; }
  strong { display: block; font-family: var(--font-display); font-size: 1.8rem; color: var(--kec-gold-soft); line-height: 1.1; }
  span { font-size: .74rem; color: var(--kec-text-muted); } }
.bench { margin: 0 0 1.25rem; }
.coffee { max-width: 300px; margin: .5rem 0; }
.arrivals { list-style: none; padding: 0; margin: 0 0 1.5rem; display: grid; gap: .45rem; font-size: .88rem;
  li { display: flex; align-items: center; gap: .6rem; padding: .5rem .8rem; border-radius: 12px; background: rgba(26, 17, 11, .35); }
  small { margin-left: auto; color: var(--kec-text-muted); font-size: .74rem; white-space: nowrap; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #8fbf5a; flex-shrink: 0; } }
.arrive-enter-active { transition: all .6s var(--ease-spring); }
.arrive-enter-from { opacity: 0; transform: translateX(-20px); background: rgba(214, 165, 72, .3); }
.arrive-leave-active { display: none; }
.proverb { margin: 0; padding-left: 1rem; border-left: 2px solid var(--kec-gold); font-family: var(--font-display); font-style: italic; font-size: 1.12rem; color: #f5e3c8; }
.proverb-enter-active, .proverb-leave-active { transition: all .6s var(--ease-out); }
.proverb-enter-from { opacity: 0; transform: translateY(8px); }
.proverb-leave-to { opacity: 0; transform: translateY(-8px); }

.desk { padding: clamp(1.25rem, 3vw, 2.25rem); }
.desk-title { font-size: clamp(1.5rem, 2.6vw, 2rem); }
</style>
