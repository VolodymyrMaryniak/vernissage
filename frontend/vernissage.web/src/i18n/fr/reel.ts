import type { Messages } from '../en';

const reel: Messages['reel'] = {
  region: 'Film de l’exposition : {title}',
  badge: 'Généré à partir de l’inventaire',
  play: 'Lire le film',
  pause: 'Mettre en pause',
  replay: 'Revoir le film',
  scenes: 'Scènes',
  scene: 'Scène {n} : {label}',
  sceneLabel: {
    title: 'Titre',
    photo: 'Photographie',
    works: 'Les œuvres',
    numbers: 'Les chiffres',
    costs: 'Les coûts',
    end: 'Fin',
  },
  presents: 'Vernissage présente',
  works: 'Les œuvres · {n}',
  more: { one: 'et {n} autre', other: 'et {n} autres' },
  sold: 'vendue',
  numbers: 'Les chiffres · visibles par vous seul',
  visitors: 'Visiteurs',
  worksSold: 'Œuvres vendues',
  ofTotal: 'sur {n}',
  revenue: 'Recettes',
  satisfaction: 'Satisfaction',
  costs: 'Où est passé l’argent · {total}',
  margin: 'Marge',
  endLine: 'Documenté sur Vernissage',
  tag: { works: 'Les œuvres', room: 'La salle', program: 'Le programme', thinking: 'La réflexion' },
};

export default reel;
