import { GLICEMIA_COLORS } from './glicemia';

export type CardType = 'PROBLEMA' | 'SOLUCAO';

export interface CardItem {
  id: string;
  pairId: string;
  type: CardType;
  image: any;
  alt: string;
}

export const CARTOES_COLORS = {
  primary: GLICEMIA_COLORS.primary,
  white: GLICEMIA_COLORS.white,
  containerBg: GLICEMIA_COLORS.background,
  brandDark: '#6D4C41',
  selectedBorder: GLICEMIA_COLORS.selectionOrange,
  selectedBg: GLICEMIA_COLORS.selectionOrangeBg,
  successBg: '#AED581',
  successBorder: GLICEMIA_COLORS.success,
  errorBg: '#FFEBEE',
  errorBorder: GLICEMIA_COLORS.error,
  cardBackBg: '#4FC3F7',
  cardBackBorder: '#E1F5FE',
  overlay: GLICEMIA_COLORS.overlay,
  textMuted: '#555555',
};

export const CARTOES_THEORY = {
  title: 'Resolver problemas',
  instruction:
    'Combine cada obstáculo ou sintoma do cotidiano com a atitude ou tratamento correto para resolver o tabuleiro!',
  successTitle: 'Parabéns!',
  successMessage:
    'Você associou todos os problemas diários às suas respectivas soluções clínicas com maestria!',
};

export const TABULEIRO_CARTOES: CardItem[] = [
  {
    id: 'p1',
    pairId: 'par_1',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 1.png'),
    alt: 'Obstáculo diário 1 sobre manejo glicêmico.',
  },
  {
    id: 's1',
    pairId: 'par_1',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 1.1.png'),
    alt: 'Solução recomendada para o obstáculo 1.',
  },
  {
    id: 'p2',
    pairId: 'par_2',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 2.png'),
    alt: 'Obstáculo diário 2 sobre manejo glicêmico.',
  },
  {
    id: 's2',
    pairId: 'par_2',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 2.2.png'),
    alt: 'Solução recomendada para o obstáculo 2.',
  },
  {
    id: 'p3',
    pairId: 'par_3',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 3.png'),
    alt: 'Obstáculo diário 3 sobre manejo glicêmico.',
  },
  {
    id: 's3',
    pairId: 'par_3',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 3.3.png'),
    alt: 'Solução recomendada para o obstáculo 3.',
  },
  {
    id: 'p4',
    pairId: 'par_4',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 4.png'),
    alt: 'Obstáculo diário 4 sobre manejo glicêmico.',
  },
  {
    id: 's4',
    pairId: 'par_4',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 4.4.png'),
    alt: 'Solução recomendada para o obstáculo 4.',
  },
  {
    id: 'p5',
    pairId: 'par_5',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 5.png'),
    alt: 'Obstáculo diário 5 sobre manejo glicêmico.',
  },
  {
    id: 's5',
    pairId: 'par_5',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 5.5.png'),
    alt: 'Solução recomendada para o obstáculo 5.',
  },
  {
    id: 'p6',
    pairId: 'par_6',
    type: 'PROBLEMA',
    image: require('../assets/images/cartas/Jogo 6.png'),
    alt: 'Obstáculo diário 6 sobre manejo glicêmico.',
  },
  {
    id: 's6',
    pairId: 'par_6',
    type: 'SOLUCAO',
    image: require('../assets/images/cartas/Jogo 6.6.png'),
    alt: 'Solução recomendada para o obstáculo 6.',
  },
];
