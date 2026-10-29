/**
 * Proverbes africains affichés dans la salle d’attente.
 * origin : code ISO2 du pays (ou AF pour l’Afrique entière).
 */
export const PROVERBS = [
  { origin: 'CM', fr: 'Une seule main n’attache pas le koki.', en: 'One hand cannot tie the koki.' },
  { origin: 'SN', fr: 'Si tu veux aller vite, marche seul ; si tu veux aller loin, marchons ensemble.', en: 'If you want to go fast, go alone; if you want to go far, let’s go together.' },
  { origin: 'CI', fr: 'Petit à petit, l’oiseau fait son nid.', en: 'Little by little, the bird builds its nest.' },
  { origin: 'ML', fr: 'La patience est un arbre dont la racine est amère, mais dont les fruits sont très doux.', en: 'Patience is a tree with bitter roots and very sweet fruit.' },
  { origin: 'GH', fr: 'Un seul bracelet ne tinte pas.', en: 'One bracelet does not make a sound.' },
  { origin: 'NG', fr: 'C’est au bout de l’ancienne corde qu’on tisse la nouvelle.', en: 'It is at the end of the old rope that we weave the new one.' },
  { origin: 'KE', fr: 'Celui qui veut le miel doit endurer les piqûres.', en: 'Whoever wants honey must endure the stings.' },
  { origin: 'ZA', fr: 'Ubuntu : je suis parce que nous sommes.', en: 'Ubuntu: I am because we are.' },
  { origin: 'RW', fr: 'Quand les racines sont profondes, il n’y a pas lieu de craindre le vent.', en: 'When the roots are deep, there is no reason to fear the wind.' },
  { origin: 'CD', fr: 'Seul on va plus vite, ensemble on va plus loin.', en: 'Alone we go faster, together we go further.' },
  { origin: 'BJ', fr: 'La parole est comme un œuf : une fois cassée, on ne la recollera pas.', en: 'A word is like an egg: once broken, it cannot be put back together.' },
  { origin: 'TG', fr: 'On ne fait pas un feu avec une seule bûche.', en: 'You cannot make a fire with a single log.' },
  { origin: 'BF', fr: 'La vérité est comme l’huile : elle revient toujours à la surface.', en: 'Truth is like oil: it always returns to the surface.' },
  { origin: 'GA', fr: 'L’arbre ne s’élève qu’avec ses racines.', en: 'The tree only rises with its roots.' },
  { origin: 'ET', fr: 'Quand les toiles d’araignée s’unissent, elles peuvent arrêter un lion.', en: 'When spider webs unite, they can halt a lion.' },
  { origin: 'EG', fr: 'Le Nil n’oublie jamais sa source.', en: 'The Nile never forgets its source.' },
  { origin: 'MA', fr: 'Celui qui a une patience d’âne verra sa maison bâtie.', en: 'The one with a donkey’s patience will see his house built.' },
  { origin: 'TZ', fr: 'Haraka haraka haina baraka : trop de hâte n’apporte pas de bénédiction.', en: 'Haraka haraka haina baraka: too much haste brings no blessing.' },
  { origin: 'UG', fr: 'Une seule main ne peut pas applaudir.', en: 'One hand cannot clap.' },
  { origin: 'ZW', fr: 'Le chemin se fait en marchant.', en: 'The path is made by walking.' },
  { origin: 'AO', fr: 'Qui sème le vent récolte la tempête, qui sème la confiance récolte un peuple.', en: 'Sow wind, reap a storm; sow trust, reap a people.' },
  { origin: 'MZ', fr: 'La mer n’a pas de branches, mais les pirogues y trouvent leur chemin.', en: 'The sea has no branches, yet canoes find their way.' },
  { origin: 'GN', fr: 'Le kola se partage : on ne le mange pas seul.', en: 'Kola is shared: one does not eat it alone.' },
  { origin: 'NE', fr: 'Le puits se creuse avant la soif.', en: 'The well is dug before thirst comes.' },
  { origin: 'TD', fr: 'Le désert enseigne la patience à ceux qui veulent le traverser.', en: 'The desert teaches patience to those who want to cross it.' },
  { origin: 'AF', fr: 'L’Afrique n’est pas un pays : c’est une maison aux nombreuses portes.', en: 'Africa is not a country: it is a house with many doors.' }
]

export function proverbText(p, locale = 'fr') {
  if (!p) return ''
  const code = typeof locale === 'string' ? locale : locale?.value
  return p[code] || p.fr || p.en || ''
}

export function shuffled(list) {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
