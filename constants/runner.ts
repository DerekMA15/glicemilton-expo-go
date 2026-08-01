import { Dimensions } from 'react-native';
import { GLICEMIA_COLORS } from './glicemia';

export type Lane = 0 | 1;
export type RunnerItemType = 'GOOD' | 'BAD';

export interface RunnerSpawnItem {
  id: string;
  lane: Lane;
  type: RunnerItemType;
  label: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LANE_WIDTH = SCREEN_WIDTH / 2;

export const RUNNER_CONFIG = {
  SCREEN_WIDTH,
  LANE_WIDTH,
  GAME_DURATION_SEC: 35,
  INITIAL_SPEED: 8,
  SPAWN_INTERVAL_MS: 1500,
  ITEM_SIZE: 60,
  PLAYER_WIDTH: 70,
  PLAYER_HEIGHT: 110,
  COLLISION_Y_RANGE: 120,
  PLAYER_OFFSET: (LANE_WIDTH - 70) / 2,
  ITEM_OFFSET: (LANE_WIDTH - 60) / 2,
};

export const RUNNER_COLORS = {
  laneBgLeft: '#1E88E5',
  laneBgRight: '#1565C0',
  hudBg: 'rgba(0, 0, 0, 0.5)',
  healthBar: GLICEMIA_COLORS.error,
  scoreText: GLICEMIA_COLORS.success,
  white: GLICEMIA_COLORS.white,
  overlay: GLICEMIA_COLORS.overlay,
  brandDark: '#795548',
  textMuted: '#555555',
};

export const SPAWN_ITEMS_POOL: Omit<RunnerSpawnItem, 'id' | 'lane'>[] = [
  { type: 'GOOD', label: 'Maçã Saudável' },
  { type: 'GOOD', label: 'Atividade Física' },
  { type: 'BAD', label: 'Sedentarismo (Smartphone)' },
  { type: 'BAD', label: 'Doces em excesso' },
];
export const RUNNER_ASSETS = {
  bgLandscape: require('@/assets/images/background_consertado.png'),
  antRunningIcon: require('@/assets/images/icone_atividade_fisica.png'),
  antHappy: require('@/assets/images/glicemilton_feliz.png'),
  bgBlueInstructions: require('@/assets/images/fundo_azul.png'),
  antExplaining: require('@/assets/images/glicemilton_explicando.png'),
  bgdirtroad: require('@/assets/images/runner/bg_dirtroad.jpg'),

  iconBicicleta: require('@/assets/images/runner/Bom-Bicicleta.png'),
  iconCorda: require('@/assets/images/runner/Bom-Corda sem fundo.png'),
  iconTenis: require('@/assets/images/runner/Bom-Tenis com garrafa.png'),
  iconCama: require('@/assets/images/runner/Ruim-Cama.png'),
  iconCelular: require('@/assets/images/runner/Ruim-Celular sem fundo.png'),
  iconSofa: require('@/assets/images/runner/Ruim-Sofá sem fundo.png'),
};
