import type { Messages } from '../en';

const reel: Messages['reel'] = {
  region: 'Фільм виставки: {title}',
  badge: 'Створено з інвентарю',
  play: 'Відтворити фільм',
  pause: 'Пауза',
  replay: 'Переглянути ще раз',
  scenes: 'Сцени',
  scene: 'Сцена {n}: {label}',
  sceneLabel: {
    title: 'Титр',
    photo: 'Фотографія',
    works: 'Твори',
    numbers: 'Цифри',
    costs: 'Витрати',
    end: 'Кінець',
  },
  presents: 'Vernissage представляє',
  works: 'Твори · {n}',
  more: { one: 'і ще {n}', few: 'і ще {n}', many: 'і ще {n}', other: 'і ще {n}' },
  sold: 'продано',
  numbers: 'Цифри · бачите лише ви',
  visitors: 'Відвідувачі',
  worksSold: 'Продано творів',
  ofTotal: 'з {n}',
  revenue: 'Дохід',
  satisfaction: 'Задоволеність',
  costs: 'Куди пішли гроші · {total}',
  margin: 'Маржа',
  endLine: 'Задокументовано на Vernissage',
  tag: { works: 'Твори', room: 'Зала', program: 'Програма', thinking: 'Задум' },
};

export default reel;
