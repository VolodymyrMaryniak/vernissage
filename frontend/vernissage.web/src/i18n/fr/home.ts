import type { Messages } from '../en';

const home: Messages['home'] = {
  metaTitle: 'Documentons votre exposition comme il se doit',
  metaDescription:
    'Vernissage est un espace de travail structuré pour les expositions — cataloguez les œuvres, joignez les vues d’exposition, les plans et l’audio, et publiez une fiche que chacun peut trouver.',
  metaWorkspace: 'Espace de travail pour artistes, commissaires et galeries',
  title: 'Documentons votre exposition *comme il se doit*.',
  slogan: 'Une exposition vit six semaines. *Sa trace, pour toujours.*',
  startHere: 'Commencer ici',
  roleCards: {
    artist: { title: 'Je suis artiste', body: 'Vos œuvres et vos expositions, documentées et prêtes à envoyer.' },
    curator: { title: 'Je suis commissaire indépendant·e', body: 'Un espace à vous, une archive qui vous suit, sans galerie obligatoire.' },
    gallery: { title: 'Je suis une galerie', body: 'Une archive de toute la programmation, chaque exposition cataloguée au même endroit.' },
  },
  whatEyebrow: 'Ce que vous obtenez',
  whatTitle: 'Tout le travail autour de l’œuvre, *pris en charge*.',
  benefits: {
    files: {
      title: 'Des fichiers qui se rangent seuls',
      body: 'Chaque exposition a son dossier Drive, organisé par type — masters, presse, textes — classé au fil des téléversements.',
    },
    portfolio: {
      title: 'Portfolio et CV en un clic',
      body: 'Générez un portfolio ou un CV pour un appel à projets, une bourse ou une résidence à partir des fiches que vous tenez déjà.',
    },
    updates: {
      title: 'Des mises à jour pendant l’exposition',
      body: 'Publiez des changements en cours d’exposition — dates, œuvres, presse — et tous ceux qui suivent la fiche sont prévenus.',
    },
  },
  reelEyebrow: 'Films d’exposition',
  reelTitle: 'Chaque exposition documentée *se rejoue*.',
  reelBody:
    'Vernissage transforme un inventaire en court film : vues d’exposition, œuvres, puis chiffres. Visiteurs, ventes et coûts n’apparaissent que dans votre propre film.',
  reelEnd: 'Inventaire complet · 18 œuvres · 4 photographies',
  pipelineEyebrow: 'Comment ça marche',
  pipelineTitle: 'Quatre étapes, du vernissage à la *citation*.',
  pipeline: {
    setUp: { title: 'Créer l’exposition', body: 'Titre, dates, artistes, œuvres — un vrai schéma de catalogue, pas une page blanche.' },
    attach: { title: 'Joindre les documents', body: 'Vues d’exposition, plans, audio et documents, classés par catégorie dans la fiche.' },
    sync: { title: 'Synchroniser avec Drive', body: 'Prévu : un dossier Google Drive structuré par exposition pour les masters, les HDR et la presse.' },
    share: { title: 'Publier et partager', body: 'Une fiche publique que chacun peut lire, rechercher et citer.' },
  },
  drive: {
    title: 'Chaque exposition a un endroit pour ses fichiers.',
    body: 'Un dossier Drive structuré par exposition, pour que masters, HDR et presse ne s’éparpillent jamais. En attendant, les fichiers se joignent directement à la fiche.',
    files: { one: '{n} fichier', other: '{n} fichiers' },
  },
  vr: {
    chip: 'Visites virtuelles',
    status: 'Prévu · Matterport · 360°',
    title: 'L’exposition n’a pas à fermer.',
    body: 'Une captation Matterport ou 360° s’intègre au catalogue — revenez dans la salle longtemps après le décrochage.',
    enter: '● Entrer dans la visite virtuelle',
    rooms: '14 salles',
  },
  ctaEyebrow: 'Accès libre, non commercial',
  ctaTitle: 'Une archive de travail, pas un site portfolio.',
  ctaBody: 'Commencez à documenter votre prochaine exposition.',
  cta: 'Commencer à documenter',
  slideshow: {
    region: 'Expositions et vernissages',
    slide: '{n} sur {total}',
    previous: 'Photo précédente',
    next: 'Photo suivante',
    play: 'Lancer le diaporama',
    pause: 'Mettre le diaporama en pause',
    choose: 'Choisir une photo',
    photo: 'Photo {n} : {caption}',
    credit: 'Photo :',
  },
  photos: {
    openingCrowd: {
      caption: 'Soir de vernissage, salle comble',
      alt: 'Une foule dense lors d’un vernissage, sous une haute verrière tendue de bandes jaunes',
    },
    closeLook: {
      caption: 'L’œuvre, vue de près',
      alt: 'Une visiteuse regarde de près un grand tableau représentant une femme enlaçant un renard',
    },
    nightWindows: {
      caption: 'Vernissage, à la nuit tombée',
      alt: 'Trois fenêtres cintrées d’une galerie éclairées la nuit, avec des silhouettes de visiteurs',
    },
    galleryRoom: {
      caption: 'Vue d’exposition, première salle',
      alt: 'Une galerie baignée de soleil, des peintures abstraites aux murs blancs et deux bancs blancs',
    },
    glasses: {
      caption: 'Une heure avant l’ouverture des portes',
      alt: 'Des rangées de verres à vin vides attendent sur une table avant un vernissage',
    },
    hang: {
      caption: 'L’accrochage, une grille de seize',
      alt: 'Des visiteurs lors d’un vernissage devant un mur accroché d’une grille d’œuvres encadrées',
    },
    readingRoom: {
      caption: 'Tables d’archives, pendant l’exposition',
      alt: 'Des visiteurs penchés sur de longues tables-vitrines dans une salle d’exposition blanche et lumineuse',
    },
  },
  demoReel: {
    title: 'Le Long Après-midi',
    byline: 'Exposition collective',
    venue: 'Galerie Nord, Lviv',
    untitled: 'Sans titre {n}',
    costs: {
      rent: 'Loyer',
      framing: 'Encadrement',
      shipping: 'Transport',
      brunch: 'Brunch du vernissage',
      printing: 'Impression',
    },
  },
};

export default home;
