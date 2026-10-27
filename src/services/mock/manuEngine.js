/**
 * Moteur conversationnel mock de Manu AI.
 * Détection d'intention par mots-clés + garde-fous d'escalade.
 * En mode http, ce moteur est remplacé par le backend (LLM + RAG),
 * mais le CONTRAT de réponse reste identique :
 *   { text, quickReplies: [{ id, label }], route?, escalated?, reason?, transferred? }
 *
 * Il est paramétré par :
 *   - `settings`  : paramètres administrables par l'équipe (seuil d'incompréhension,
 *                   motifs d'escalade actifs, mots-clés supplémentaires, accueil…)
 *   - `overrides` : base de connaissances éditée dans le back-office
 *                   (mots-clés et réponses par intention et par langue)
 * Les deux sont vides par défaut : le moteur se comporte alors comme la base livrée.
 */
import { ESCALATION_RULES, INTENTS, RESPONSES } from './manuKnowledge'

const normalize = (s) => ` ${String(s).toLowerCase()} `

const DEFAULT_SETTINGS = { missesThreshold: 3, escalation: {}, extraEscalationKeywords: [], quickRepliesEnabled: true, greetingOverride: {}, tone: 'warm' }

function build(entry, kb, name = '', settings = DEFAULT_SETTINGS) {
  return {
    text: entry.text.replace('{name}', name).replace(/ {2,}/g, ' ').replace(' ,', ','),
    quickReplies: settings.quickRepliesEnabled === false ? [] : (entry.qr ?? []).map((id) => ({ id, label: kb.labels[id] ?? id })),
    route: entry.route ?? null
  }
}

/** Fusionne la base livrée et les surcharges éditées par l'équipe */
function knowledge(locale, overrides) {
  const kb = RESPONSES[locale] ?? RESPONSES.fr
  const o = overrides?.intents ?? {}
  const merged = { ...kb }
  for (const [id, patch] of Object.entries(o)) {
    const text = patch.responses?.[locale]
    if (text && merged[id] && !Array.isArray(merged[id])) merged[id] = { ...merged[id], text }
  }
  const intents = INTENTS.map((it) => ({ ...it, keywords: [...it.keywords, ...(o[it.id]?.extraKeywords ?? [])], disabled: o[it.id]?.disabled === true }))
    .filter((it) => !it.disabled)
  return { kb: merged, intents }
}

/**
 * @param {string} message           Message de l'utilisateur (ou id d'une réponse rapide)
 * @param {{ locale:string, misses:number, name?:string }} state
 * @param {object} [settings]        Paramètres administrables (voir assistantSettings)
 * @param {object} [overrides]       Surcharges de la base de connaissances
 * @returns {{ reply: object, state: object, intent: string }}
 */
export function manuReply(message, state, settings = DEFAULT_SETTINGS, overrides = null) {
  const s = { ...DEFAULT_SETTINGS, ...settings }
  const { kb, intents } = knowledge(state.locale, overrides)
  const text = normalize(message)

  // 1) Réponse rapide (id d'intention exact)
  const direct = kb[message.trim()]
  if (direct && !Array.isArray(direct) && kb.labels[message.trim()]) {
    return { reply: build(direct, kb, state.name, s), state: { ...state, misses: 0 }, intent: message.trim() }
  }

  // 2) Garde-fous : escalade obligatoire (motifs activés + mots-clés ajoutés par l'équipe)
  const rules = ESCALATION_RULES.filter((r) => s.escalation?.[r.reason] !== false)
  const rule = rules.find((r) => r.keywords.some((k) => text.includes(k)))
    ?? ((s.extraEscalationKeywords ?? []).some((k) => k && text.includes(k.toLowerCase())) ? { reason: 'personalAdvice' } : null)
  if (rule) {
    return { reply: { ...build(kb.escalate, kb, '', s), escalated: true, reason: rule.reason }, state: { ...state, misses: 0 }, intent: 'escalate' }
  }

  // 3) Intention reconnue (on prend celle qui a le plus de mots-clés trouvés)
  let best = null
  let bestScore = 0
  for (const intent of intents) {
    const score = intent.keywords.reduce((acc, k) => acc + (text.includes(k) ? 1 : 0), 0)
    if (score > bestScore) { best = intent; bestScore = score }
  }
  if (best) {
    const reply = build(kb[best.id], kb, state.name, s)
    if (best.id === 'human') Object.assign(reply, { escalated: true, reason: 'humanRequested' })
    return { reply, state: { ...state, misses: 0 }, intent: best.id }
  }

  // 4) Incompréhension : au bout de N (paramétrable), transfert humain
  const misses = (state.misses ?? 0) + 1
  if (misses >= (s.missesThreshold ?? 3)) {
    return { reply: { ...build(kb.transfer, kb, '', s), escalated: true, transferred: true, reason: 'notUnderstood' }, state: { ...state, misses: 0 }, intent: 'transfer' }
  }
  return { reply: build(kb.fallback[Math.min(misses, kb.fallback.length) - 1], kb, '', s), state: { ...state, misses }, intent: 'fallback' }
}

export function manuWelcome(locale, name = '', settings = DEFAULT_SETTINGS, overrides = null) {
  const { kb } = knowledge(locale, overrides)
  const custom = settings?.greetingOverride?.[locale]
  const hour = new Date().getHours()
  const entry = custom ? { ...kb.welcome, text: custom } : hour < 17 ? kb.welcomeMorning : kb.welcome
  return build(entry, kb, name, { ...DEFAULT_SETTINGS, ...settings })
}

/** Catalogue des intentions (pour l'éditeur de base de connaissances du back-office) */
export function knowledgeCatalog() {
  return INTENTS.map((it) => ({
    id: it.id,
    keywords: it.keywords,
    responses: Object.fromEntries(Object.entries(RESPONSES).map(([loc, kb]) => [loc, kb[it.id]?.text ?? '']))
  }))
}
