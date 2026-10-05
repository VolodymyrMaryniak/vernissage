import type { Messages } from '../en';

const curators: Messages['curators'] = {
  metaTitle: 'Pour les commissaires indépendants',
  metaDescription:
    'Un seul endroit pour chaque exposition dont vous assurez le commissariat, de la première idée au vernissage, qui vous suit d’une institution à l’autre.',
  eyebrow: 'Pour les commissaires indépendants',
  title: 'Chaque exposition dont vous êtes commissaire, *de la première idée au vernissage*.',
  lede: 'Gardez le concept, la liste des œuvres, l’équipe et les plans au même endroit, et emportez-les dans la prochaine institution.',
  cta: 'Ouvrir votre espace de travail',
  wallLabel: 'Exemple de cartel',
  wallCount: 'Cinq artistes · 18 œuvres',
  wallYou: 'Commissariat : vous',
  timelineEyebrow: 'La vie d’une exposition',
  timelineTitle: 'Six étapes, *une seule fiche*.',
  timelineBody: 'Cliquez sur une étape pour voir ce que vous y conservez.',
  checklistEyebrow: 'La liste des œuvres',
  checklistTitle: 'Sachez ce qui est prêt *avant l’arrivée du camion*.',
  checklistBody: 'Marquez les œuvres cataloguées et voyez l’exposition prendre forme.',
  portableEyebrow: 'Portable',
  portableTitle: 'Les institutions changent. *Votre trace, non.*',
  ctaEyebrow: 'Gratuit pendant la bêta',
  ctaTitle: 'Commencez par l’exposition sur laquelle vous travaillez en ce moment.',
  checklist: {
    meta: 'Liste des œuvres · {n} œuvres',
    progress: '{done} sur {total} cataloguées',
    catalogued: 'Cataloguée',
    mark: 'Marquer comme cataloguée',
    mediums: {
      plaster: 'Plâtre, pigment',
      steel: 'Acier, feutre',
      video: 'Vidéo, son',
      graphite: 'Graphite sur papier',
      concrete: 'Béton coulé',
    },
  },
  timeline: {
    label: 'Les étapes d’une exposition',
    stages: {
      concept: {
        label: 'Concept',
        when: '6 mois avant',
        line: 'Écrivez pourquoi l’exposition existe avant qu’on vous le demande.',
        keeps: ['Objectif', 'Texte curatorial', 'Thème'],
      },
      research: {
        label: 'Recherche',
        when: '4 mois avant',
        line: 'Sources, lectures et références, gardées à côté de l’idée qu’elles nourrissent.',
        keeps: ['Matériaux de recherche', 'Bibliographie', 'Notes'],
      },
      checklist: {
        label: 'Liste des œuvres',
        when: '8 semaines avant',
        line: 'Les œuvres, les artistes et les personnes qui rendent l’exposition possible, en une liste.',
        keeps: ['Liste des œuvres', 'Équipe', 'Images des œuvres'],
      },
      install: {
        label: 'Montage',
        when: 'Semaine de montage',
        line: 'Plans et vues, pour que le prochain lieu puisse reconstruire la salle.',
        keeps: ['Plan de scénographie', 'Plan d’éclairage', 'Plan du lieu', 'Photos de scénographie'],
      },
      opening: {
        label: 'Vernissage',
        when: 'Le soir du vernissage',
        line: 'La soirée elle-même, et tout ce qui se passe autour.',
        keeps: ['Avant le vernissage', 'Le vernissage', 'Événements', 'Photos d’événement', 'Audio'],
      },
      after: {
        label: 'Après',
        when: 'Pour toujours',
        line: 'La fiche reste à vous : ce qui a marché, qui est venu, ce que cela a coûté.',
        keeps: ['Chiffres privés', 'Visite virtuelle', 'Votre CV'],
      },
    },
  },
};

export default curators;
