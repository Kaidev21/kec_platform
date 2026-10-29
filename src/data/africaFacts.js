/**
 * Fiches des pays africains pour le globe (clé = code ISO 3166-1 numérique).
 * Repères provisoires, à valider par KEC (validated: false).
 */
const OHADA = new Set(['BJ', 'BF', 'CM', 'CF', 'KM', 'CG', 'CD', 'CI', 'GA', 'GN', 'GW', 'GQ', 'ML', 'NE', 'SN', 'TD', 'TG'])

function c(isoNum, iso2, flag, names, fact) {
  return {
    isoNum,
    iso2,
    flag,
    names,
    fact: { fr: fact, en: fact },
    ohada: OHADA.has(iso2),
    validated: false
  }
}

const RAW = [
  c('012', 'DZ', '🇩🇿', { fr: 'Algérie', en: 'Algeria' }, 'Porte du Maghreb, relais vers l’Europe et le Sahel.'),
  c('024', 'AO', '🇦🇴', { fr: 'Angola', en: 'Angola' }, 'Économie pétrolière et reconstruction, un marché en ouverture.'),
  c('072', 'BW', '🇧🇼', { fr: 'Botswana', en: 'Botswana' }, 'Stabilité et diamants : un climat des affaires souvent cité.'),
  c('108', 'BI', '🇧🇮', { fr: 'Burundi', en: 'Burundi' }, 'Cœur des Grands Lacs, où l’agriculture porte beaucoup de familles.'),
  c('120', 'CM', '🇨🇲', { fr: 'Cameroun', en: 'Cameroon' }, 'Pays de lancement de KEC : Douala, Yaoundé, et bientôt tout le territoire.'),
  c('132', 'CV', '🇨🇻', { fr: 'Cabo Verde', en: 'Cabo Verde' }, 'Archipel atlantique, carrefour de la diaspora lusophone.'),
  c('140', 'CF', '🇨🇫', { fr: 'Centrafrique', en: 'Central African Republic' }, 'Membre OHADA ; reconstruire passe aussi par formaliser.'),
  c('148', 'TD', '🇹🇩', { fr: 'Tchad', en: 'Chad' }, 'Porte du Sahel, membre OHADA, entre commerce et agriculture.'),
  c('174', 'KM', '🇰🇲', { fr: 'Comores', en: 'Comoros' }, 'Archipel OHADA, entre Afrique et océan Indien.'),
  c('178', 'CG', '🇨🇬', { fr: 'Congo', en: 'Congo' }, 'Brazzaville et Pointe-Noire, membre OHADA.'),
  c('180', 'CD', '🇨🇩', { fr: 'RD Congo', en: 'DR Congo' }, 'Le plus vaste pays OHADA, un océan de PME à accompagner.'),
  c('204', 'BJ', '🇧🇯', { fr: 'Bénin', en: 'Benin' }, 'Cotonou, porte du golfe de Guinée et membre OHADA.'),
  c('226', 'GQ', '🇬🇶', { fr: 'Guinée équatoriale', en: 'Equatorial Guinea' }, 'Seul pays hispanophone d’Afrique centrale, membre OHADA.'),
  c('231', 'ET', '🇪🇹', { fr: 'Éthiopie', en: 'Ethiopia' }, 'Siège de l’Union africaine, grand marché de l’Est.'),
  c('232', 'ER', '🇪🇷', { fr: 'Érythrée', en: 'Eritrea' }, 'Façade de la mer Rouge, à l’aube de nouveaux échanges.'),
  c('262', 'DJ', '🇩🇯', { fr: 'Djibouti', en: 'Djibouti' }, 'Port stratégique entre mer Rouge et océan Indien.'),
  c('266', 'GA', '🇬🇦', { fr: 'Gabon', en: 'Gabon' }, 'Libreville, membre OHADA, économie forestière et pétrolière.'),
  c('270', 'GM', '🇬🇲', { fr: 'Gambie', en: 'Gambia' }, 'Petite côte atlantique, grande tradition commerçante.'),
  c('288', 'GH', '🇬🇭', { fr: 'Ghana', en: 'Ghana' }, 'Accra : tech, cacao et un écosystème PME très vivant.'),
  c('324', 'GN', '🇬🇳', { fr: 'Guinée', en: 'Guinea' }, 'Conakry, mines et agriculture, membre OHADA.'),
  c('384', 'CI', '🇨🇮', { fr: "Côte d'Ivoire", en: 'Côte d’Ivoire' }, 'Abidjan, locomotive OHADA de l’Afrique de l’Ouest.'),
  c('404', 'KE', '🇰🇪', { fr: 'Kenya', en: 'Kenya' }, 'Nairobi, capitale tech de l’Afrique de l’Est.'),
  c('426', 'LS', '🇱🇸', { fr: 'Lesotho', en: 'Lesotho' }, 'Royaume des hauts plateaux, textile et diaspora.'),
  c('430', 'LR', '🇱🇷', { fr: 'Liberia', en: 'Liberia' }, 'Monrovia, reconstruction et commerce côtier.'),
  c('434', 'LY', '🇱🇾', { fr: 'Libye', en: 'Libya' }, 'Façade méditerranéenne, carrefour vers le Sahel.'),
  c('450', 'MG', '🇲🇬', { fr: 'Madagascar', en: 'Madagascar' }, 'Grande île, vanille, mines et un tissu de TPE à structurer.'),
  c('454', 'MW', '🇲🇼', { fr: 'Malawi', en: 'Malawi' }, 'Le « cœur chaud de l’Afrique », agriculture et lacs.'),
  c('466', 'ML', '🇲🇱', { fr: 'Mali', en: 'Mali' }, 'Bamako, carrefour sahélien et membre OHADA.'),
  c('478', 'MR', '🇲🇷', { fr: 'Mauritanie', en: 'Mauritania' }, 'Pont entre Maghreb et Afrique de l’Ouest.'),
  c('480', 'MU', '🇲🇺', { fr: 'Maurice', en: 'Mauritius' }, 'Hub financier et maritime de l’océan Indien.'),
  c('504', 'MA', '🇲🇦', { fr: 'Maroc', en: 'Morocco' }, 'Casablanca et Tanger, portes de l’Afrique vers l’Europe.'),
  c('508', 'MZ', '🇲🇿', { fr: 'Mozambique', en: 'Mozambique' }, 'Façade orientale, gaz et corridors vers l’intérieur.'),
  c('516', 'NA', '🇳🇦', { fr: 'Namibie', en: 'Namibia' }, 'Désert, ports et un cadre des affaires souvent salué.'),
  c('562', 'NE', '🇳🇪', { fr: 'Niger', en: 'Niger' }, 'Niamey, membre OHADA au cœur du Sahel.'),
  c('566', 'NG', '🇳🇬', { fr: 'Nigeria', en: 'Nigeria' }, 'Le plus grand marché d’Afrique : Lagos ne dort jamais.'),
  c('624', 'GW', '🇬🇼', { fr: 'Guinée-Bissau', en: 'Guinea-Bissau' }, 'Petit pays OHADA, grande côte atlantique.'),
  c('646', 'RW', '🇷🇼', { fr: 'Rwanda', en: 'Rwanda' }, 'Kigali, vitrine de la transformation numérique.'),
  c('678', 'ST', '🇸🇹', { fr: 'Sao Tomé-et-Principe', en: 'São Tomé and Príncipe' }, 'Îles du golfe de Guinée, cacao et tourisme.'),
  c('686', 'SN', '🇸🇳', { fr: 'Sénégal', en: 'Senegal' }, 'Dakar, phare OHADA et terre de diaspora.'),
  c('690', 'SC', '🇸🇨', { fr: 'Seychelles', en: 'Seychelles' }, 'Archipel, finance et tourisme de l’océan Indien.'),
  c('694', 'SL', '🇸🇱', { fr: 'Sierra Leone', en: 'Sierra Leone' }, 'Freetown, reconstruction et entrepreneuriat côtier.'),
  c('706', 'SO', '🇸🇴', { fr: 'Somalie', en: 'Somalia' }, 'Corne de l’Afrique, commerce et diaspora très active.'),
  c('710', 'ZA', '🇿🇦', { fr: 'Afrique du Sud', en: 'South Africa' }, 'Johannesburg et Le Cap, première économie industrielle.'),
  c('716', 'ZW', '🇿🇼', { fr: 'Zimbabwe', en: 'Zimbabwe' }, 'Harare, mines, agriculture et un tissu de PME tenaces.'),
  c('728', 'SS', '🇸🇸', { fr: 'Soudan du Sud', en: 'South Sudan' }, 'Plus jeune État d’Afrique, tout reste à construire.'),
  c('729', 'SD', '🇸🇩', { fr: 'Soudan', en: 'Sudan' }, 'Carrefour du Nil, entre Afrique et monde arabe.'),
  c('748', 'SZ', '🇸🇿', { fr: 'Eswatini', en: 'Eswatini' }, 'Royaume, sucre et un marché régional très lié à l’Afrique du Sud.'),
  c('768', 'TG', '🇹🇬', { fr: 'Togo', en: 'Togo' }, 'Lomé, port OHADA du golfe de Guinée.'),
  c('788', 'TN', '🇹🇳', { fr: 'Tunisie', en: 'Tunisia' }, 'Porte méditerranéenne, industrie et services.'),
  c('800', 'UG', '🇺🇬', { fr: 'Ouganda', en: 'Uganda' }, 'Kampala, carrefour des Grands Lacs.'),
  c('818', 'EG', '🇪🇬', { fr: 'Égypte', en: 'Egypt' }, 'Le Caire, plus grande métropole d’Afrique.'),
  c('834', 'TZ', '🇹🇿', { fr: 'Tanzanie', en: 'Tanzania' }, 'Dar es Salaam et Dodoma, porte de l’Afrique de l’Est.'),
  c('854', 'BF', '🇧🇫', { fr: 'Burkina Faso', en: 'Burkina Faso' }, 'Ouagadougou, membre OHADA, terre de création.'),
  c('894', 'ZM', '🇿🇲', { fr: 'Zambie', en: 'Zambia' }, 'Cuivre, agriculture et un marché intérieur en croissance.')
]

export const AFRICA = Object.fromEntries(RAW.map((x) => [x.isoNum, x]))
export const AFRICA_LIST = RAW

/** Villes africaines visées par les arcs de la diaspora (lon, lat). */
export const HUBS = [
  [9.7, 4.05], // Douala
  [11.52, 3.87], // Yaoundé
  [-4.03, 5.32], // Abidjan
  [-17.45, 14.69], // Dakar
  [3.38, 6.45], // Lagos
  [36.82, -1.29], // Nairobi
  [-0.19, 5.56], // Accra
  [15.27, -4.32], // Kinshasa
  [28.05, -26.2], // Johannesburg
  [31.24, 30.04], // Le Caire
  [38.76, 9.03], // Addis-Abeba
  [30.06, -1.94] // Kigali
]

export function countryName(country, locale = 'fr') {
  if (!country) return ''
  return country.names?.[locale] || country.names?.fr || country.names?.en || country.iso2 || ''
}

export function countryFact(country, locale = 'fr') {
  if (!country) return ''
  const f = country.fact
  if (!f) return ''
  if (typeof f === 'string') return f
  return f[locale] || f.fr || f.en || ''
}
