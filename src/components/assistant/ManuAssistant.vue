<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Manu AI — réceptionniste humanisée (widget flottant)
 * ─────────────────────────────────────────────────────────────
 * - Accueille par l'heure du jour et le prénom (si connecté).
 * - Indicateur de frappe en cauris, réponses rapides, liens vers les pages.
 * - Garde-fous visibles : pas de conseil juridique individualisé,
 *   escalade humaine signalée clairement.
 */
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssistantStore } from '@/stores/assistant'
import { useUiStore } from '@/stores/ui'
import ManuAvatar from './ManuAvatar.vue'
import CowrieShape from '@/components/brand/CowrieShape.vue'

const store = useAssistantStore()
const ui = useUiStore()
const router = useRouter()
const draft = ref('')
const scroller = ref(null)
const teaser = ref(false)

async function open() {
  ui.manuOpen = true
  teaser.value = false
  await store.greet()
}
function close() { ui.manuOpen = false }

async function submit() {
  const text = draft.value.trim()
  if (!text) return
  draft.value = ''
  await store.send(text)
}
const quick = (qr) => store.send(qr.id, qr.label)
function go(route) {
  router.push({ name: route.name })
  close()
}

watch(() => [store.messages.length, store.typing], async () => {
  await nextTick()
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' })
})
watch(() => ui.manuOpen, (o) => { if (o) store.greet() })

// Petite bulle d'invitation après quelques secondes (une fois par session)
onMounted(() => {
  if (sessionStorage.getItem('kec.manuTeased')) return
  setTimeout(() => {
    if (!ui.manuOpen) teaser.value = true
    sessionStorage.setItem('kec.manuTeased', '1')
  }, 6500)
})
</script>

<template>
  <div class="manu-widget" :class="{ open: ui.manuOpen }">
    <!-- Lanceur -->
    <Transition name="pop">
      <button v-if="!ui.manuOpen" class="launcher" type="button" :aria-label="$t('manu.open')" @click="open">
        <ManuAvatar :size="58" />
        <Transition name="pop">
          <span v-if="teaser" class="teaser" @click.stop="open">
            <strong>{{ $t('manu.teaserTitle') }}</strong> {{ $t('manu.teaser') }}
          </span>
        </Transition>
      </button>
    </Transition>

    <!-- Fenêtre de conversation -->
    <Transition name="panel">
      <section v-if="ui.manuOpen" class="panel" role="dialog" :aria-label="$t('manu.title')">
        <header class="head">
          <ManuAvatar :size="46" />
          <div class="who">
            <strong>Manu AI</strong>
            <span>{{ $t('manu.role') }}</span>
          </div>
          <button class="icon" type="button" :title="$t('manu.restart')" @click="store.reset(); store.greet()">↻</button>
          <button class="icon" type="button" :aria-label="$t('common.close')" @click="close">✕</button>
        </header>

        <div ref="scroller" class="thread">
          <TransitionGroup name="msg">
            <div v-for="m in store.messages" :key="m.id" class="msg" :class="`from-${m.from}`">
              <p>{{ m.text }}</p>
              <div v-if="m.escalated" class="escalated">🤝🏾 {{ $t('manu.escalated') }}</div>
              <button v-if="m.route" class="route" type="button" @click="go(m.route)">{{ m.route.label }} →</button>
              <div v-if="m.quickReplies?.length && m === store.messages.at(-1)" class="qr">
                <button v-for="q in m.quickReplies" :key="q.id" type="button" @click="quick(q)">{{ q.label }}</button>
              </div>
            </div>
          </TransitionGroup>
          <div v-if="store.typing" class="msg from-manu typing" :aria-label="$t('manu.typing')">
            <CowrieShape v-for="i in 3" :key="i" :size="9" />
          </div>
        </div>

        <form class="composer" @submit.prevent="submit">
          <input v-model="draft" class="k-input" :placeholder="$t('manu.placeholder')" :aria-label="$t('manu.placeholder')" maxlength="500" />
          <button class="send" type="submit" :disabled="!draft.trim() || store.typing" :aria-label="$t('manu.send')">➤</button>
        </form>
        <p class="disclaimer">{{ $t('manu.disclaimer') }}</p>
      </section>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.manu-widget { position: fixed; z-index: 95; right: .9rem; bottom: 7rem; @include md-up { right: 1.5rem; bottom: 6rem; } }
.launcher {
  position: relative; background: none; border: 0; padding: 0; border-radius: 50%;
  animation: float 4s ease-in-out infinite;
  &::before { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(214, 165, 72, .5); animation: ring 2.8s ease-out infinite; }
}
@keyframes float { 50% { transform: translateY(-5px); } }
@keyframes ring { from { transform: scale(.9); opacity: 1; } to { transform: scale(1.35); opacity: 0; } }
.teaser {
  position: absolute; right: calc(100% + .8rem); bottom: .5rem; width: 230px; text-align: left;
  padding: .75rem .9rem; border-radius: 16px 16px 4px 16px; font-size: .84rem; line-height: 1.4;
  background: var(--kec-ivory); color: #2a1a12; box-shadow: var(--shadow-soft);
  strong { display: block; font-family: var(--font-display); font-size: 1rem; }
}

.panel {
  position: fixed; inset: auto .5rem .5rem .5rem; height: min(640px, calc(100dvh - 1rem));
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: 24px; border: 1px solid rgba(214, 165, 72, .35);
  background: linear-gradient(180deg, #2f1e13, #1d130c);
  box-shadow: 0 30px 80px -20px #000;
  @include sm-up { inset: auto 1.5rem 1.5rem auto; width: 400px; }
}
.head {
  display: flex; align-items: center; gap: .8rem; padding: .9rem 1rem;
  background-color: var(--kec-walnut-deep); @include wood-grain(.5);
  border-bottom: 1px solid var(--kec-border);
}
.who { flex: 1; display: flex; flex-direction: column; line-height: 1.2; strong { font-family: var(--font-display); font-size: 1.15rem; } span { font-size: .76rem; color: #a9c77a; } }
.icon { background: rgba(255,255,255,.05); border: 0; color: var(--kec-ivory); width: 34px; height: 34px; border-radius: 50%; &:hover { background: rgba(255,255,255,.12); } }

.thread { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: .7rem; @include clay-grain(.08); }
.msg { max-width: 88%; display: flex; flex-direction: column; gap: .5rem; }
.msg p { margin: 0; padding: .7rem .95rem; border-radius: 18px; font-size: .9rem; line-height: 1.5; white-space: pre-line; }
.msg.from-manu { align-self: flex-start; p { background: #3d2819; border: 1px solid rgba(233, 201, 131, .14); border-bottom-left-radius: 4px; } }
.msg.from-user { align-self: flex-end; p { background: var(--kec-cowrie); color: #2a1a12; border-bottom-right-radius: 4px; } }
.typing { flex-direction: row; gap: 4px; padding: .8rem 1rem; background: #3d2819; border-radius: 18px; :deep(svg) { animation: hop 1s infinite; } :deep(svg:nth-child(2)) { animation-delay: .15s; } :deep(svg:nth-child(3)) { animation-delay: .3s; } }
@keyframes hop { 30% { transform: translateY(-5px) rotate(20deg); } }
.escalated { font-size: .78rem; color: var(--kec-gold-soft); padding: .4rem .7rem; border: 1px dashed rgba(214,165,72,.4); border-radius: 10px; }
.route { align-self: flex-start; background: none; border: 1px solid var(--kec-gold); color: var(--kec-gold-soft); padding: .45rem .9rem; border-radius: 999px; font-size: .82rem; font-weight: 700; &:hover { background: rgba(214,165,72,.12); } }
.qr { display: flex; flex-wrap: wrap; gap: .4rem; button { background: rgba(239,227,201,.08); border: 1px solid rgba(239,227,201,.25); color: var(--kec-ivory); padding: .4rem .75rem; border-radius: 999px; font-size: .8rem; &:hover { background: var(--kec-cowrie); color: #2a1a12; } } }

.composer { display: flex; gap: .5rem; padding: .75rem; border-top: 1px solid var(--kec-border); .k-input { border-radius: 999px; padding: .7rem 1.1rem; } }
.send { flex-shrink: 0; width: 46px; border-radius: 50%; border: 0; color: #2a1a12; background: radial-gradient(circle at 35% 30%, #fff1c9, #d6a548); font-size: 1rem; &:disabled { opacity: .4; } }
.disclaimer { margin: 0; padding: 0 1rem .7rem; font-size: .68rem; color: var(--kec-text-muted); text-align: center; }

.pop-enter-active, .pop-leave-active { transition: all .4s var(--ease-spring); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(.6); }
.panel-enter-active, .panel-leave-active { transition: all .45s var(--ease-spring); transform-origin: bottom right; }
.panel-enter-from, .panel-leave-to { opacity: 0; transform: translateY(20px) scale(.92); }
.msg-enter-active { transition: all .4s var(--ease-out); }
.msg-enter-from { opacity: 0; transform: translateY(10px); }
</style>
