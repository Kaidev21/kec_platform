<script setup>
/**
 * Carte « Que pouvons-nous faire pour vous ? »
 * Ouverte à tout visiteur depuis la barre consultant.
 */
import { reactive, ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { RESIDENCE_COUNTRIES } from '@/config/geo'
import KModal from '@/components/ui/KModal.vue'
import KField from '@/components/ui/KField.vue'
import KChips from '@/components/ui/KChips.vue'
import KButton from '@/components/ui/KButton.vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const { t } = useI18n()
const auth = useAuthStore()

const form = reactive({
  name: '', country: 'Cameroun', phone: '', email: '', need: '', channel: 'whatsapp', consent: false
})
const errors = reactive({})
const sending = ref(false)
const result = ref(null)
const serverError = ref('')

const channels = computed(() => ['whatsapp', 'call', 'email'].map((v) => ({
  value: v, label: t(`consultant.request.channels.${v}`)
})))

watch(() => props.open, (o) => {
  if (!o) return
  result.value = null
  serverError.value = ''
  Object.keys(errors).forEach((k) => delete errors[k])
  if (auth.user?.name) form.name = auth.user.name
  if (auth.user?.email) form.email = auth.user.email
})

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  const req = (k) => { if (!String(form[k] ?? '').trim()) errors[k] = t('validation.required') }
  ;['name', 'country', 'phone', 'need'].forEach(req)
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = t('validation.email')
  if (!form.consent) errors.consent = t('validation.consent')
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  sending.value = true
  serverError.value = ''
  try {
    result.value = await api.consultation.request({ ...form })
  } catch (e) {
    serverError.value = t(e.message || 'errors.generic')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <KModal :open="open" :title="t('consultant.request.title')" @close="emit('close')">
    <div v-if="auth.role === 'fellow'" class="fellow-hint">
      <p>{{ t('consultant.request.fellowHint') }}</p>
      <KButton variant="cowrie" :to="{ name: 'fellow-consultant' }" @click="emit('close')">{{ t('consultant.request.book') }}</KButton>
    </div>

    <div v-else-if="result" class="thanks" role="status">
      <h4>{{ t('consultant.request.sentTitle', { name: form.name.split(' ')[0] }) }}</h4>
      <p>{{ t('consultant.request.sent', { channel: t(`consultant.request.channels.${form.channel}`), ref: result.ref }) }}</p>
      <KButton variant="wood" @click="emit('close')">{{ t('common.close') }}</KButton>
    </div>

    <form v-else class="stack" novalidate @submit.prevent="submit">
      <p class="text-muted">{{ t('consultant.request.lead') }}</p>
      <KField :label="t('consultant.request.name')" required :error="errors.name" for-id="dc-name">
        <input id="dc-name" v-model="form.name" class="k-input" autocomplete="name" />
      </KField>
      <div class="grid-2">
        <KField :label="t('consultant.request.country')" required :error="errors.country" for-id="dc-co">
          <select id="dc-co" v-model="form.country" class="k-input">
            <option v-for="c in RESIDENCE_COUNTRIES" :key="c" :value="c">{{ c }}</option>
          </select>
        </KField>
        <KField :label="t('consultant.request.phone')" required :error="errors.phone" for-id="dc-ph">
          <input id="dc-ph" v-model="form.phone" type="tel" class="k-input" autocomplete="tel" />
        </KField>
      </div>
      <KField :label="t('consultant.request.email')" :error="errors.email" for-id="dc-em">
        <input id="dc-em" v-model="form.email" type="email" class="k-input" autocomplete="email" />
      </KField>
      <KField :label="t('consultant.request.need')" required :error="errors.need" for-id="dc-need">
        <textarea id="dc-need" v-model="form.need" class="k-input" rows="4" :placeholder="t('consultant.request.needPh')" />
      </KField>
      <KField :label="t('consultant.request.channel')">
        <KChips v-model="form.channel" :options="channels" />
      </KField>
      <label class="consent">
        <input v-model="form.consent" type="checkbox" />
        <span>{{ t('consultant.request.consent') }}</span>
      </label>
      <p v-if="errors.consent" class="err">{{ errors.consent }}</p>
      <p v-if="serverError" class="err">{{ serverError }}</p>
      <p class="hint">{{ t('consultant.request.hint') }}</p>
      <KButton type="submit" variant="cowrie" :loading="sending" block>{{ t('consultant.request.send') }}</KButton>
    </form>
  </KModal>
</template>

<style scoped lang="scss">
.stack { display: flex; flex-direction: column; gap: .9rem; }
.grid-2 { display: grid; gap: .9rem; @include sm-up { grid-template-columns: 1fr 1fr; } }
.hint, .text-muted { margin: 0; font-size: .82rem; color: var(--kec-text-muted); }
.consent { display: flex; gap: .6rem; align-items: flex-start; font-size: .86rem; input { margin-top: .2rem; } }
.err { margin: 0; color: #f08a6e; font-size: .82rem; }
.thanks, .fellow-hint { display: flex; flex-direction: column; gap: .9rem; h4 { margin: 0; } p { margin: 0; } }
</style>
