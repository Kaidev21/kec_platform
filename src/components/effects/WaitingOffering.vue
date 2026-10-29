<script setup>
/**
 * Plateau d’accueil de la salle d’attente : café, thé, arachides, vin, cola.
 * Émet `served` avec la clé choisie. Expose `serve(key)` pour Manu.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ColaNut from '@/components/brand/ColaNut.vue'

const emit = defineEmits(['served'])
const { t } = useI18n()
const current = ref(null)

const ITEMS = [
  { id: 'coffee', glyph: '☕' },
  { id: 'tea', glyph: '🍵' },
  { id: 'peanuts', glyph: '🥜' },
  { id: 'wine', glyph: '🍷' },
  { id: 'cola', glyph: null }
]

function serve(id) {
  current.value = id
  emit('served', id)
}

defineExpose({ serve })
</script>

<template>
  <div class="offering" role="group" :aria-label="t('waiting.chooseDrink')">
    <p class="prompt">{{ t('waiting.chooseDrink') }}</p>
    <div class="tray">
      <button
        v-for="item in ITEMS"
        :key="item.id"
        type="button"
        class="cup"
        :class="{ 'is-on': current === item.id }"
        @click="serve(item.id)"
      >
        <span class="glyph" aria-hidden="true">
          <ColaNut v-if="item.id === 'cola'" :size="22" />
          <template v-else>{{ item.glyph }}</template>
        </span>
        <span>{{ t(`waiting.offerings.${item.id}`) }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.offering { color: var(--kec-text); }
.prompt { margin: 0 0 .6rem; font-size: .82rem; color: var(--kec-text-muted); }
.tray { display: flex; flex-wrap: wrap; gap: .45rem; }
.cup {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .45rem .7rem; border-radius: 999px;
  border: 1px solid rgba(245, 236, 219, .22);
  background: rgba(26, 17, 11, .4); color: #f5ecdb;
  font: inherit; font-size: .8rem; cursor: pointer;
  transition: background .2s, border-color .2s, transform .15s;
}
.cup:hover { border-color: var(--kec-gold); transform: translateY(-1px); }
.cup.is-on { background: rgba(214, 165, 72, .22); border-color: var(--kec-gold); }
.glyph { display: inline-flex; width: 1.2rem; justify-content: center; }
</style>
