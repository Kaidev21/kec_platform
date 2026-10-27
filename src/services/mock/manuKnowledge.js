/**
 * ─────────────────────────────────────────────────────────────
 *  Base de connaissances de Manu AI (version mock)
 * ─────────────────────────────────────────────────────────────
 * Respecte les garde-fous du cahier des charges (§7) :
 *  - jamais de conseil juridique individualisé ;
 *  - uniquement des informations générales et procédurales validées ;
 *  - escalade obligatoire : fiscal, social, pénal, litiges, conseil
 *    personnalisé, urgence ;
 *  - 3 incompréhensions consécutives -> transfert à un humain.
 *
 * En production, ce fichier est remplacé par un prompt + une base
 * documentaire versionnés côté serveur (administrables sans redéploiement).
 */

/** Mots-clés déclenchant une ESCALADE obligatoire (toutes langues) */
export const ESCALATION_RULES = [
  { reason: 'tax', keywords: ['impôt', 'impot', 'fiscal', 'tva', 'taxe', 'dgi', 'tax', 'vat', 'steuer', 'finanzamt', 'mehrwertsteuer'] },
  { reason: 'social', keywords: ['cnps', 'licenci', 'salarié', 'contrat de travail', 'employee', 'dismiss', 'kündig', 'arbeitsvertrag', 'sozial'] },
  { reason: 'criminal', keywords: ['pénal', 'penal', 'plainte', 'police', 'prison', 'fraude', 'criminal', 'arrest', 'strafrecht', 'anzeige'] },
  { reason: 'litigation', keywords: ['litige', 'procès', 'proces', 'tribunal', 'avocat contre', 'poursuivre', 'lawsuit', 'sue ', 'court', 'dispute', 'klage', 'gericht', 'streit'] },
  { reason: 'urgent', keywords: ['urgent', 'urgence', 'emergency', 'asap', 'dringend', 'notfall'] },
  { reason: 'personalAdvice', keywords: ['me conseillez', 'que dois-je', 'à ma place', 'pour mon cas', 'dans mon cas', 'should i', 'my case', 'advise me', 'was soll ich', 'in meinem fall', 'raten sie mir'] }
]

/** Intentions reconnues (mots-clés multilingues) */
export const INTENTS = [
  { id: 'greeting', keywords: ['bonjour', 'bonsoir', 'salut', 'hello', 'hi ', 'hey', 'good morning', 'hallo', 'guten tag', 'servus', 'mbolo', 'jambo', 'yo '] },
  { id: 'thanks', keywords: ['merci', 'thank', 'danke', 'akiba', 'asante'] },
  { id: 'human', keywords: ['humain', 'conseiller', 'consultant', 'parler à', 'quelqu\'un', 'human', 'agent', 'person', 'berater', 'mensch', 'mitarbeiter'] },
  { id: 'program', keywords: ['110', 'fellow', 'programme', 'program', 'scale', 'incub', 'cohort', 'sélection', 'selection', 'auswahl', 'certif', 'zertifi'] },
  { id: 'waitlist', keywords: ['liste d\'attente', 'attente', 'inscri', 'waitlist', 'waiting', 'sign up', 'register', 'warteliste', 'anmeld', 'salle'] },
  { id: 'legalForms', keywords: ['sarl', 'sas', 'sasu', ' sa ', 'gie', 'forme juridique', 'statut', 'legal form', 'company type', 'rechtsform', 'gmbh', 'entreprise individuelle', 'ets'] },
  { id: 'documents', keywords: ['document', 'pièce', 'piece', 'cni', 'carte d\'identité', 'plan de localisation', 'papier', 'id card', 'unterlagen', 'ausweis', 'dokument'] },
  { id: 'price', keywords: ['prix', 'coût', 'cout', 'combien', 'tarif', 'fcfa', 'price', 'cost', 'how much', 'fee', 'kosten', 'preis', 'wie viel'] },
  { id: 'payment', keywords: ['payer', 'paiement', 'momo', 'mobile money', 'orange money', ' om', 'virement', 'pay', 'payment', 'bank', 'zahl', 'überweis'] },
  { id: 'timeline', keywords: ['délai', 'delai', 'combien de temps', 'durée', 'quand', 'how long', 'when', 'timeline', 'wie lange', 'dauer', 'wann'] },
  { id: 'diaspora', keywords: ['diaspora', 'à distance', 'distance', 'depuis la france', 'depuis l\'allemagne', 'abroad', 'remote', 'from europe', 'ausland', 'aus deutschland'] },
  { id: 'vault', keywords: ['coffre', 'vault', 'tresor', 'tresor', 'sécurité', 'securite', 'security', 'sicher', 'tresor'] },
  { id: 'whatIsKec', keywords: ['kec', 'qui êtes', 'qui etes', 'c\'est quoi', 'who are you', 'what is', 'wer seid', 'was ist'] },
  { id: 'country', keywords: ['pays', 'ville', 'cameroun', 'douala', 'yaoundé', 'ohada', 'country', 'city', 'land', 'stadt', 'kamerun'] },
  { id: 'kopen', keywords: ['suggestion', 'idée', 'amélior', 'feedback', 'idea', 'improve', 'vorschlag', 'verbesser'] }
]

/**
 * Réponses par langue. {name} est remplacé par le prénom si connu.
 * `qr` = réponses rapides proposées, `route` = page suggérée.
 */
export const RESPONSES = {
  fr: {
    welcome: { text: 'Bonsoir et bienvenue à la maison {name} 🌍 Je suis Manu, la réceptionniste de KEC. Asseyez-vous, prenez un café. Comment puis-je vous orienter aujourd\'hui ?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Bonjour {name}, et bienvenue chez KEC ☀️ Moi c\'est Manu, je vous accueille. Dites-moi ce qui vous amène, on va avancer ensemble.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Bonjour à vous ! Ça me fait plaisir. Créer, formaliser, développer votre entreprise : par quoi voulez-vous commencer ?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'C\'est moi qui vous remercie. On est ensemble ! Je reste juste là si vous avez besoin.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) est la porte d\'entrée digitale et juridique de l\'entrepreneur africain : on vous aide à créer, formaliser puis développer votre entreprise au Cameroun, avec une trajectoire vers l\'espace OHADA. Nous ne promettons pas une création instantanée, mais de la simplicité, de la transparence et un vrai accompagnement humain.', qr: ['program', 'waitlist'] },
    program: { text: 'Le programme pilote accueille 110 fellows pendant 6 mois : diagnostic, formation, structuration juridique, création, documents finaux et suivi. À la fin, votre compte entreprise est certifié KEC, et c\'est visible sur la plateforme. La sélection se fait parmi les inscrits de la liste d\'attente.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Rejoindre la salle d\'attente' } },
    waitlist: { text: 'Pour faire partie des 110, entrez dans notre salle d\'attente virtuelle : un formulaire de 2 minutes, un ticket numéroté, et le café est offert ☕. L\'équipe étudie chaque profil avant de choisir la cohorte.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Entrer dans la salle d\'attente' } },
    legalForms: { text: 'En général, dans l\'espace OHADA : l\'Établissement individuel est simple mais vous engage personnellement ; la SARL (1 à plusieurs associés) est la forme la plus courante pour les PME ; la SAS offre plus de souplesse dans les statuts ; la SA s\'adresse aux projets plus importants. Ce sont des informations générales : pour savoir laquelle convient à VOTRE projet, un consultant KEC vous guidera.', qr: ['human', 'price'] },
    documents: { text: 'Les pièces habituelles : CNI (ou passeport) de chaque associé/gérant, plan de localisation du siège, photos d\'identité, et selon le cas un extrait de casier judiciaire et un contrat de bail. Vous pouvez simplement les photographier avec votre téléphone : on contrôle la lisibilité à l\'envoi.', qr: ['vault', 'timeline'] },
    price: { text: 'Le programme SCALE 110 est proposé à 300 000 FCFA par entreprise. Pour une création hors programme, un devis total et détaillé vous est toujours affiché AVANT de demander des données sensibles. Et pour discuter avec un consultant : tarif horaire affiché dans la barre « Parler à un consultant ».', qr: ['payment', 'human'] },
    payment: { text: 'Vous pouvez payer par MTN Mobile Money, Orange Money ou virement bancaire. Pour MoMo/OM, vous recevez une demande de confirmation sur votre téléphone, puis un reçu immédiatement. La diaspora peut aussi payer pour un proche (payeur ≠ bénéficiaire).', qr: ['price', 'diaspora'] },
    timeline: { text: 'Le délai dépend de la forme juridique et des administrations. Chaque dossier affiche des dates prévisionnelles et un interlocuteur nommé, et nous publions notre délai moyen réel. Pas de promesse magique, mais une transparence totale.', qr: ['documents', 'human'] },
    diaspora: { text: 'Vous êtes loin du pays ? C\'est prévu pour vous : création à distance, suivi en ligne, interlocuteur humain dédié, documents dans votre coffre-fort, et possibilité de créer pour un proche resté au pays.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Votre coffre-fort juridique garde tous vos documents (statuts, RCCM, pièces…) chiffrés et accessibles à tout moment. À la fin des 6 mois, votre compte reçoit le badge certifié.', qr: ['documents', 'program'] },
    country: { text: 'Nous lançons au Cameroun (Douala, Yaoundé, Edéa et les 10 régions), avec une trajectoire vers les autres pays OHADA. Vous choisissez le pays et la ville de création directement dans votre dossier.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Une idée pour qu\'on s\'améliore ? Déposez-la dans Kopen Mind, notre boîte à suggestions. Chaque message est lu par l\'équipe.', qr: [] },
    human: { text: 'Bien sûr. Je transmets votre demande à un membre de l\'équipe KEC, réponse sous 4 heures ouvrées. Vous pouvez aussi réserver directement un consultant.', qr: [], route: { name: 'fellow-consultant', label: 'Réserver un consultant' } },
    escalate: { text: 'Cette question mérite l\'avis d\'un professionnel de chez nous, je ne veux pas vous donner une réponse approximative. Je viens de transmettre votre demande à l\'équipe : un conseiller vous recontacte sous 4 heures ouvrées. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Pardon, je n\'ai pas bien saisi. Vous pouvez reformuler, ou choisir un sujet ci-dessous ?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Excusez-moi, je n\'ai toujours pas compris. Essayez avec d\'autres mots, je suis toute ouïe.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Je préfère vous passer quelqu\'un de l\'équipe pour ne pas vous faire perdre votre temps. Un humain reprend la conversation et vous répond sous 4 heures ouvrées.', qr: [] },
    labels: { program: 'Le programme 110', waitlist: 'Liste d\'attente', legalForms: 'Formes juridiques', documents: 'Pièces à fournir', price: 'Tarifs', payment: 'Paiement', timeline: 'Délais', diaspora: 'Je suis de la diaspora', vault: 'Coffre-fort', human: 'Parler à un humain' }
  },

  en: {
    welcome: { text: 'Good evening and welcome home {name} 🌍 I\'m Manu, KEC\'s receptionist. Have a seat, have a coffee. How can I guide you today?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Good morning {name}, welcome to KEC ☀️ I\'m Manu and I\'ll be looking after you. Tell me what brings you here and we\'ll move forward together.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Hello to you! Lovely to meet you. Create, formalise, grow your business: where would you like to start?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Thank YOU. We\'re in this together! I\'m right here if you need me.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) is the digital and legal gateway for African entrepreneurs: we help you create, formalise and grow your business in Cameroon, with a path into the OHADA area. We don\'t promise instant incorporation — we promise simplicity, transparency and real human support.', qr: ['program', 'waitlist'] },
    program: { text: 'The pilot programme welcomes 110 fellows for 6 months: diagnosis, training, legal structuring, incorporation, final documents and follow-up. At the end, your company account becomes KEC-certified, visibly on the platform. Fellows are selected from the waiting list.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Join the waiting room' } },
    waitlist: { text: 'To be one of the 110, step into our virtual waiting room: a 2-minute form, a numbered ticket, and the coffee is on us ☕. The team reviews every profile before choosing the cohort.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Enter the waiting room' } },
    legalForms: { text: 'Generally, in the OHADA area: a sole proprietorship is simple but personally binding; the SARL (LLC) is the most common for SMEs; the SAS gives more flexibility in its articles; the SA suits larger projects. This is general information — to know which suits YOUR project, a KEC consultant will guide you.', qr: ['human', 'price'] },
    documents: { text: 'Usual documents: ID card (or passport) of each partner/manager, a location plan of the head office, ID photos, and depending on the case a criminal record extract and a lease. Just photograph them with your phone — we check readability on upload.', qr: ['vault', 'timeline'] },
    price: { text: 'The SCALE 110 programme costs 300,000 FCFA per company. Outside the programme, a full, detailed quote is always shown BEFORE we ask for sensitive data. To talk with a consultant, the hourly rate is shown in the "Talk to a consultant" bar.', qr: ['payment', 'human'] },
    payment: { text: 'You can pay with MTN Mobile Money, Orange Money or bank transfer. With MoMo/OM you confirm on your phone and receive a receipt instantly. Diaspora members can also pay on behalf of a relative.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Timing depends on the legal form and the administrations. Every file shows forecast dates and a named contact, and we publish our real average lead time. No magic promises, just full transparency.', qr: ['documents', 'human'] },
    diaspora: { text: 'Far from home? It\'s built for you: remote incorporation, online tracking, a dedicated human contact, documents in your vault, and the option to create a company for a relative back home.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Your legal vault keeps all your documents (articles, RCCM, IDs…) encrypted and available anytime. After the 6 months, your account receives the certified badge.', qr: ['documents', 'program'] },
    country: { text: 'We\'re launching in Cameroon (Douala, Yaoundé, Edéa and all 10 regions), heading next to other OHADA countries. You pick the country and city directly in your file.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'An idea to help us improve? Drop it in Kopen Mind, our suggestion box. Every message is read by the team.', qr: [] },
    human: { text: 'Of course. I\'m passing your request to a KEC team member — reply within 4 business hours. You can also book a consultant directly.', qr: [], route: { name: 'fellow-consultant', label: 'Book a consultant' } },
    escalate: { text: 'This question deserves a professional\'s view — I don\'t want to give you an approximate answer. I\'ve just forwarded your request to the team: an advisor will get back to you within 4 business hours. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Sorry, I didn\'t quite catch that. Could you rephrase, or pick a topic below?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Forgive me, I still didn\'t understand. Try other words — I\'m all ears.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'I\'d rather hand you over to someone from the team so you don\'t lose time. A human will take over and reply within 4 business hours.', qr: [] },
    labels: { program: 'The 110 programme', waitlist: 'Waiting list', legalForms: 'Legal forms', documents: 'Required documents', price: 'Pricing', payment: 'Payment', timeline: 'Timeline', diaspora: 'I\'m in the diaspora', vault: 'Vault', human: 'Talk to a human' }
  },

  de: {
    welcome: { text: 'Guten Abend und willkommen zu Hause {name} 🌍 Ich bin Manu, die Empfangsdame von KEC. Nehmen Sie Platz, trinken Sie einen Kaffee. Wie kann ich Ihnen heute helfen?', qr: ['program', 'legalForms', 'price', 'human'] },
    welcomeMorning: { text: 'Guten Morgen {name}, willkommen bei KEC ☀️ Ich bin Manu und kümmere mich um Sie. Erzählen Sie mir, was Sie herführt – wir gehen es gemeinsam an.', qr: ['program', 'legalForms', 'price', 'human'] },
    greeting: { text: 'Hallo! Schön, Sie kennenzulernen. Gründen, formalisieren, wachsen: Womit möchten Sie beginnen?', qr: ['program', 'documents', 'price'] },
    thanks: { text: 'Ich danke IHNEN. Wir sind ein Team! Ich bin gleich hier, wenn Sie mich brauchen.', qr: [] },
    whatIsKec: { text: 'KEC (K-Enterprise Counsel) ist das digitale und juristische Tor für afrikanische Unternehmer: Wir helfen Ihnen, Ihr Unternehmen in Kamerun zu gründen, zu formalisieren und auszubauen – mit Perspektive auf den OHADA-Raum. Keine Sofortgründung, sondern Einfachheit, Transparenz und echte menschliche Begleitung.', qr: ['program', 'waitlist'] },
    program: { text: 'Das Pilotprogramm nimmt 110 Fellows für 6 Monate auf: Diagnose, Schulung, rechtliche Strukturierung, Gründung, finale Dokumente und Begleitung. Am Ende wird Ihr Unternehmenskonto KEC-zertifiziert – sichtbar auf der Plattform. Die Auswahl erfolgt aus der Warteliste.', qr: ['waitlist', 'price'], route: { name: 'waiting-room', label: 'Zum Warteraum' } },
    waitlist: { text: 'Um einer der 110 zu werden, betreten Sie unseren virtuellen Warteraum: ein 2-Minuten-Formular, ein nummeriertes Ticket, und der Kaffee geht auf uns ☕. Das Team prüft jedes Profil vor der Auswahl.', qr: ['program', 'timeline'], route: { name: 'waiting-room', label: 'Warteraum betreten' } },
    legalForms: { text: 'Allgemein im OHADA-Raum: Das Einzelunternehmen ist einfach, haftet aber persönlich; die SARL (ähnlich GmbH) ist für KMU am häufigsten; die SAS bietet mehr Satzungsfreiheit; die SA eignet sich für größere Projekte. Das sind allgemeine Informationen – welche Form zu IHREM Projekt passt, klärt ein KEC-Berater mit Ihnen.', qr: ['human', 'price'] },
    documents: { text: 'Übliche Unterlagen: Personalausweis (oder Pass) jedes Gesellschafters/Geschäftsführers, Lageplan des Firmensitzes, Passfotos und je nach Fall Führungszeugnis und Mietvertrag. Einfach mit dem Handy fotografieren – wir prüfen die Lesbarkeit beim Hochladen.', qr: ['vault', 'timeline'] },
    price: { text: 'Das Programm SCALE 110 kostet 300.000 FCFA pro Unternehmen. Außerhalb des Programms sehen Sie immer ein vollständiges Angebot, BEVOR wir sensible Daten anfragen. Für ein Gespräch mit einem Berater steht der Stundensatz in der Leiste „Mit einem Berater sprechen“.', qr: ['payment', 'human'] },
    payment: { text: 'Sie zahlen per MTN Mobile Money, Orange Money oder Banküberweisung. Bei MoMo/OM bestätigen Sie auf dem Handy und erhalten sofort eine Quittung. Die Diaspora kann auch für Angehörige zahlen.', qr: ['price', 'diaspora'] },
    timeline: { text: 'Die Dauer hängt von der Rechtsform und den Behörden ab. Jede Akte zeigt voraussichtliche Termine und einen festen Ansprechpartner, und wir veröffentlichen unsere tatsächliche Durchschnittsdauer.', qr: ['documents', 'human'] },
    diaspora: { text: 'Weit weg von zu Hause? Genau dafür sind wir da: Gründung aus der Ferne, Online-Verfolgung, persönlicher Ansprechpartner, Dokumente im Tresor und die Möglichkeit, für Angehörige vor Ort zu gründen.', qr: ['payment', 'waitlist'] },
    vault: { text: 'Ihr juristischer Tresor verwahrt alle Dokumente (Satzung, RCCM, Ausweise…) verschlüsselt und jederzeit abrufbar. Nach 6 Monaten erhält Ihr Konto das Zertifizierungs-Abzeichen.', qr: ['documents', 'program'] },
    country: { text: 'Wir starten in Kamerun (Douala, Yaoundé, Edéa und alle 10 Regionen), danach folgen weitere OHADA-Länder. Land und Stadt wählen Sie direkt in Ihrer Akte.', qr: ['documents', 'waitlist'] },
    kopen: { text: 'Eine Idee, wie wir besser werden? Hinterlassen Sie sie in Kopen Mind, unserem Ideenbriefkasten. Jede Nachricht wird gelesen.', qr: [] },
    human: { text: 'Natürlich. Ich leite Ihre Anfrage an das KEC-Team weiter – Antwort innerhalb von 4 Geschäftsstunden. Sie können auch direkt einen Berater buchen.', qr: [], route: { name: 'fellow-consultant', label: 'Berater buchen' } },
    escalate: { text: 'Diese Frage verdient die Einschätzung einer Fachperson – ich möchte Ihnen keine ungenaue Antwort geben. Ich habe Ihre Anfrage an das Team weitergeleitet: Ein Berater meldet sich innerhalb von 4 Geschäftsstunden. 🙏🏾', qr: [] },
    fallback: [
      { text: 'Entschuldigung, das habe ich nicht ganz verstanden. Können Sie es anders formulieren oder ein Thema wählen?', qr: ['program', 'legalForms', 'documents', 'price'] },
      { text: 'Verzeihung, ich habe es immer noch nicht verstanden. Versuchen Sie andere Worte – ich höre zu.', qr: ['waitlist', 'payment', 'human'] }
    ],
    transfer: { text: 'Ich übergebe Sie lieber an jemanden aus dem Team, damit Sie keine Zeit verlieren. Ein Mensch übernimmt und antwortet innerhalb von 4 Geschäftsstunden.', qr: [] },
    labels: { program: 'Das 110-Programm', waitlist: 'Warteliste', legalForms: 'Rechtsformen', documents: 'Unterlagen', price: 'Preise', payment: 'Zahlung', timeline: 'Dauer', diaspora: 'Ich lebe in der Diaspora', vault: 'Tresor', human: 'Mit einem Menschen sprechen' }
  }
}
