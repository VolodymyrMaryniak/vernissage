import type { Messages } from '../en';

const how: Messages['how'] = {
  metaTitle: 'Comment ça marche',
  metaDescription:
    'Vernissage tient l’inventaire numérique des expositions physiques, pour les artistes, les commissaires et les galeries, et pour tous ceux qui sont un peu de tout cela.',
  eyebrow: 'Comment ça marche',
  subtitle: 'L’inventaire numérique des *expositions physiques*.',
  lede: 'Une exposition vit quelques semaines dans une vraie salle. Vernissage en garde une trace complète : les œuvres, les personnes, les plans, les photographies et les chiffres.',
  start: 'Commencer votre inventaire',
  inventoryEyebrow: 'Un inventaire par exposition',
  inventoryTitle: 'Tout ce qui a fait l’exposition, *poste par poste*.',
  inventory: {
    show: { title: 'L’exposition', body: 'Titre, dates, ville, lieu, commissaire et thème.' },
    works: { title: 'Les œuvres', body: 'La liste des œuvres, avec une image de chacune.' },
    people: { title: 'Les personnes', body: 'Artistes, commissaires, scénographes et techniciens.' },
    thinking: { title: 'La réflexion', body: 'Objectif, texte curatorial, recherches et bibliographie.' },
    room: { title: 'La salle', body: 'Plans de scénographie, d’éclairage et du lieu ; vues d’exposition ; audio.' },
    program: { title: 'Le programme', body: 'L’avant-vernissage, le vernissage et les événements pendant l’exposition.' },
    numbers: { title: 'Les chiffres', body: 'Visiteurs, ventes et coûts, visibles par vous seul.' },
    walkthrough: { title: 'La visite', body: 'Une captation 360° ou en réalité virtuelle de la salle.' },
  },
  rolesEyebrow: 'Artiste, commissaire ou galerie',
  rolesTitle: 'Le même inventaire, *à votre façon*.',
  audiences: {
    artists: {
      eyebrow: 'En tant qu’artiste',
      title: 'Vos expositions deviennent votre CV.',
      points: [
        'Consignez chaque exposition à laquelle vous participez, personnelle ou collective.',
        'Votre CV se met à jour depuis votre inventaire, en PDF ou en Word.',
        'Marquez les œuvres vendues et gardez les totaux pour vous.',
      ],
      link: 'Voir pour les artistes',
    },
    curators: {
      eyebrow: 'En tant que commissaire',
      title: 'Toute l’exposition, de l’idée au vernissage.',
      points: [
        'Concept, recherches, liste des œuvres, équipe et plans dans une seule fiche.',
        'Vos commissariats sont présentés à part sur votre CV.',
        'La fiche vous suit quand vous changez d’institution.',
      ],
      link: 'Voir pour les commissaires',
    },
    galleries: {
      eyebrow: 'En tant que galerie',
      title: 'La programmation, exposition par exposition.',
      points: [
        'Toutes les expositions que vous accueillez dans un seul inventaire.',
        'Coûts, ventes et visiteurs pour chaque exposition et pour la saison.',
        'Des statistiques sur toute la programmation, gratuites pendant la bêta.',
      ],
      link: 'Voir pour les galeries',
    },
  },
  multiEyebrow: 'Plusieurs casquettes ?',
  multiTitle: 'Un seul compte, *tous vos rôles*.',
  multiBody:
    'Beaucoup exposent et font du commissariat, ou dirigent un lieu tout en créant. Cochez tous vos rôles ; pour chaque exposition, indiquez la casquette que vous portiez, et votre profil, Mes expositions et votre CV s’organisent tout seuls.',
  ctaEyebrow: 'Gratuit pendant la bêta',
  ctaTitle: 'Commencez par l’exposition dont vous vous souvenez le mieux.',
  cta: 'Ouvrir votre espace de travail',
  mixer: {
    step1: 'Cochez tous vos rôles',
    noRole: 'Aucun rôle pour l’instant',
    yourName: 'Votre nom',
    step2: 'Pour chaque exposition, indiquez votre casquette',
    pickOne: 'Choisissez au moins un rôle.',
    step3: 'Tout s’organise tout seul',
    adds: {
      Artist: ['Le médium sur votre profil', 'Expositions personnelles et collectives sur votre CV', 'Œuvres vendues par exposition'],
      Curator: ['Le lieu de travail sur votre profil', '« Mon commissariat » sur votre CV', 'Liste des œuvres, équipe et recherches par exposition'],
      Gallery: ['Nom, ligne et année de fondation de la galerie', 'Les chiffres de la saison sur toute la programmation', 'Coûts et visiteurs par exposition'],
    },
    filtered: 'Mes expositions filtrées par rôle',
  },
};

export default how;
