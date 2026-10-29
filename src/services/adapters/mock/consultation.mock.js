/**
 * Demandes de consultation publiques (visiteur sans compte) — mock.
 */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { openThread, systemMessage } from './messaging.mock'

export const consultationMock = {
  async request(payload) {
    const n = db.nextSequence('consultation')
    const ref = `DC-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`
    const row = db.insert('consultationRequests', {
      id: uid('dc'),
      ref,
      ...payload,
      status: 'new',
      createdAt: new Date().toISOString()
    })
    openThread({
      kind: 'consultation',
      reason: 'consultationRequest',
      fellowName: payload.name,
      tags: ['consultation', payload.channel].filter(Boolean),
      subject: `${ref} · ${String(payload.need ?? '').slice(0, 80)}`,
      messages: [systemMessage(
        `Demande de consultation ${ref} reçue. Contact : ${payload.phone ?? '—'} · ${payload.email ?? '—'} · ${payload.country ?? ''}. Canal souhaité : ${payload.channel ?? '—'}.`
      )]
    })
    return respond({ ...row, ref }, 500)
  }
}
