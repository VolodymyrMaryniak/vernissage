import type { Messages } from '../en';

const artists: Messages['artists'] = {
  metaTitle: 'Pour les artistes',
  metaDescription:
    'Documentez chaque exposition une fois : Vernissage tient votre CV à jour, vos expositions prêtes à envoyer et le compte privé de vos ventes.',
  eyebrow: 'Pour les artistes',
  title: 'Vous créez l’œuvre. *Nous gardons la trace.*',
  lede: 'Documentez chaque exposition une fois, et votre CV, vos pages d’exposition et vos ventes se mettent à jour tout seuls.',
  buildCv: 'Créer votre CV',
  cvEyebrow: 'Votre CV, toujours à jour',
  cvTitle: 'Un appel à projets vendredi ? *Votre CV est déjà prêt.*',
  cvBody: 'Essayez : chaque exposition que vous documentez peut aller directement sur votre CV.',
  soldEyebrow: 'Soir de vernissage',
  soldTitle: 'Posez une pastille rouge. *Comptez sans tableur.*',
  soldBody: 'Touchez une œuvre pour la marquer vendue.',
  alsoEyebrow: 'Aussi dans votre atelier',
  also: {
    record: { title: 'Une fiche par exposition', body: 'Dates, œuvres, textes, vues d’exposition et audio, réunis au même endroit.' },
    link: { title: 'Un lien à envoyer', body: 'Envoyez à un commissaire une page d’exposition plutôt qu’une pile de pièces jointes.' },
    files: { title: 'Des fichiers qui se rangent seuls', body: 'Un dossier Drive par exposition, classé par type au fil des téléversements.' },
  },
  ctaEyebrow: 'Gratuit pendant la bêta',
  ctaTitle: 'Commencez par votre dernière exposition.',
  cvDemo: {
    step1: 'Cochez les expositions que vous avez documentées',
    step2: 'Choisissez une mise en page',
    step3: 'Téléchargez-le en PDF ou en Word',
    layout: 'Mise en page du CV',
    solo: 'Personnelle',
    group: 'Collective',
    name: 'Votre nom',
    headline: 'Artiste · Peinture et installation · Kyiv',
    city: 'Kyiv, Ukraine',
    education: 'Formation',
    educationLine: 'Master en arts plastiques, Académie nationale des beaux-arts, Kyiv',
  },
  soldWall: {
    mediums: {
      oilLinen: 'Huile sur lin',
      print: 'Tirage pigmentaire',
      oilBoard: 'Huile sur panneau',
      gouache: 'Gouache',
      light: 'Installation lumineuse',
    },
    of: 'sur {n} vendues',
    note: 'Visible par vous seul. Cela alimente les chiffres privés de l’exposition.',
  },
};

export default artists;
