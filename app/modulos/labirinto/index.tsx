import VictoryModal from '@/components/VictoryModal';
import { useGame } from '@/context/GameContext';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts as useExpoFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_MAZE = [
  ['EXIT', 'T', 'TB_SUGAR', 'TR', 'TL', 'TR', 'TL', 'TB', 'TR'],
  ['LRB', 'LR', 'LRT', 'LB', 'BR', 'LB', 'BR', 'LRT', 'LR'],
  ['LT_SUGAR', 'B', 'R', 'LT', 'TR', 'LT', 'BT', 'R_SUGAR', 'LR'],
  ['LB', 'TR', 'LB', 'BR', 'LB', 'BR', 'LTR', 'LBR', 'LR'],
  ['LT', 'B', 'T', 'TRB', 'LT', 'T', 'R', 'LT', 'BR'],
  ['LB', 'TR', 'L', 'TB', 'BR_SUGAR', 'LR', 'LR', 'LB', 'TR'],
  ['LT', 'BR', 'LB', 'TR', 'LTR', 'LR', 'LB', 'TRB', 'LR'],
  ['LB', 'TR', 'BLT', 'B', 'R', 'LB', 'BT', 'RT', 'LBR_SUGAR'],
  ['BLT', 'B_SUGAR', 'BT', 'BTR', 'BL', 'BT', 'TBR', 'BL', 'BRT'],
];

const START_ROW = 8;
const START_COL = 8;

export default function LabirintoScreen() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const BOARD_SIZE = Math.min(windowWidth * 0.95, windowHeight * 0.5, 450);

  const [phase, setPhase] = useState<'intro' | 'instructions' | 'game' | 'finished' | 'game_over'>(
    'intro'
  );
  const [mazeMap, setMazeMap] = useState<string[][]>(INITIAL_MAZE);
  const [playerPos, setPlayerPos] = useState({ row: START_ROW, col: START_COL });
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showIntroBtn, setShowIntroBtn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useExpoFonts({ Chewy_400Regular });
  const { addPoints } = useGame();
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2, stiffness: 80 }),
        withSpring(1.0, { damping: 2, stiffness: 80 })
      ),
      -1,
      true
    );
  }, [pulseAnim]);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    if (phase === 'game' && !hasWon) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [phase, hasWon]);

  useEffect(() => {
    if (timeLeft === 0 && phase === 'game') {
      setPhase('game_over');
    }
  }, [timeLeft, phase]);

  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const animatedPulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulseAnim.value }] }));

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setShowIntroBtn(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (!fontsLoaded) return null;

  const movePlayer = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (hasWon) return;
    const currentCellWalls = mazeMap[playerPos.row][playerPos.col];

    if (direction === 'UP' && currentCellWalls.includes('T')) return;
    if (direction === 'DOWN' && currentCellWalls.includes('B')) return;
    if (direction === 'LEFT' && currentCellWalls.includes('L')) return;
    if (direction === 'RIGHT' && currentCellWalls.includes('R')) return;

    let nextRow = playerPos.row;
    let nextCol = playerPos.col;
    if (direction === 'UP') nextRow -= 1;
    if (direction === 'DOWN') nextRow += 1;
    if (direction === 'LEFT') nextCol -= 1;
    if (direction === 'RIGHT') nextCol += 1;

    if (nextRow < 0 || nextRow >= mazeMap.length || nextCol < 0 || nextCol >= mazeMap[0].length)
      return;

    setPlayerPos({ row: nextRow, col: nextCol });

    const nextCell = mazeMap[nextRow][nextCol];

    if (nextCell.includes('SUGAR')) {
      const isExit = nextCell.includes('EXIT');
      setScore((prev) => prev + 10);
      setMazeMap((prevMap) => {
        const newMap = prevMap.map((row) => [...row]);
        newMap[nextRow][nextCol] = nextCell.replace('_SUGAR', '');
        return newMap;
      });

      if (isExit) {
        addPoints('labirinto', score + 10);
        setHasWon(true);
        setPhase('finished');
        return;
      }
    }

    if (nextCell.includes('EXIT')) {
      setHasWon(true);
      addPoints('labirinto', score);
      setPhase('finished');
      return;
    }
  };

  const reiniciarJogo = () => {
    setMazeMap(INITIAL_MAZE.map((row) => [...row]));
    setPlayerPos({ row: START_ROW, col: START_COL });
    setScore(0);
    setHasWon(false);
    setTimeLeft(60);
    setPhase('game');
  };

  if (phase === 'intro') {
    return (
      <ImageBackground
        source={require('@/assets/images/background_consertado.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, animatedPulseStyle]}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="home" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Adaptação saudável</Text>
              <Image
                source={require('@/assets/images/icone_adaptacao_saudavel.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />
              <Text style={styles.introText}>
                Atitudes positivas fazem com que a convivência com o diabetes seja mais tranquila,
                reduzindo complicações e contribuindo para melhores resultados de bem-estar.
              </Text>
              {showIntroBtn && (
                <Animated.View entering={FadeIn.duration(800)} style={animatedPulseStyle}>
                  <TouchableOpacity
                    style={styles.introCircleBtn}
                    onPress={() => setPhase('instructions')}
                  >
                    <MaterialCommunityIcons name="chevron-right" size={38} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (phase === 'instructions') {
    return (
      <ImageBackground
        source={require('@/assets/images/fundo_labirinto.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, animatedPulseStyle]}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="home" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.introCard}>
              <Text style={styles.introTitle}>⚠️ Atenção</Text>

              <Text style={styles.introText}>
                O Glicemilton está em hipoglicemia e precisa da sua ajuda! Colete todos os cubos de
                açúcar pelo caminho, mas fique atento: o tempo está correndo!
              </Text>

              <Text style={styles.introText}>
                Faça tudo com bastante atenção, pois o caminho é um labirinto e você precisará
                encontrar a saída para chegar à chegada.
              </Text>

              <Text style={styles.introText}>Boa sorte!</Text>

              <Animated.View entering={FadeIn.duration(800)} style={animatedPulseStyle}>
                <TouchableOpacity style={styles.playBtn} onPress={() => setPhase('game')}>
                  <MaterialCommunityIcons name="play" size={40} color="#fff" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (phase === 'finished') {
    return (
      <ImageBackground
        source={require('@/assets/images/background_consertado.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <VictoryModal visible={true} pointsEarned={score} moduleName="Labirinto" />
      </ImageBackground>
    );
  }

  if (phase === 'game_over') {
    return (
      <ImageBackground
        source={require('@/assets/images/background_consertado.png')}
        style={styles.finishedContainer}
        resizeMode="cover"
      >
        <Animated.View entering={FadeIn} style={styles.finishedCard}>
          <Text style={{ fontSize: 50 }}>⏰</Text>
          <Text style={styles.finishedTitle}>O tempo acabou!</Text>
          <Text style={styles.finishedSub}>O Glicemilton não conseguiu achar a saída a tempo.</Text>
          <TouchableOpacity style={styles.btnFinished} onPress={reiniciarJogo}>
            <Text style={styles.btnFinishedText}>Tentar Novamente</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnFinishedOutline} onPress={() => router.back()}>
            <Text style={styles.btnFinishedOutlineText}>Voltar ao início</Text>
          </TouchableOpacity>
        </Animated.View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/fundo_labirinto.png')}
      style={styles.gameContainer}
      resizeMode="cover"
    >
      <View style={[styles.header, { marginTop: Math.max(insets.top, 20) + 20 }]}>
        <TouchableOpacity style={styles.topHomeBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="home" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.gameSubtitle}>Ajude-o a encontrar a saída!</Text>
          <View style={styles.timerBadge}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={timeLeft <= 10 ? '#FF5252' : '#FFF'}
            />
            <Text style={[styles.timerText, timeLeft <= 10 && styles.timerTextDanger]}>
              {formattedTime}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.boardWrapper}>
        <ImageBackground
          source={require('@/assets/images/labirinto.png')}
          style={{ width: BOARD_SIZE, height: BOARD_SIZE }}
          resizeMode="stretch"
        >
          {mazeMap.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, colIndex) => {
                const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
                return (
                  <View key={`cell-${rowIndex}-${colIndex}`} style={styles.cell}>
                    {cell.includes('SUGAR') && !isPlayer && (
                      <Animated.View entering={ZoomIn} style={styles.sugarWrapper}>
                        <Image
                          source={require('@/assets/images/cubo.png')}
                          style={styles.itemImage}
                          resizeMode="contain"
                        />
                      </Animated.View>
                    )}

                    {isPlayer && (
                      <Animated.View entering={ZoomIn.duration(150)} style={styles.playerWrapper}>
                        <Image
                          source={require('@/assets/images/glicemilton_feliz.png')}
                          style={styles.itemImage}
                          resizeMode="contain"
                        />
                      </Animated.View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </ImageBackground>
      </View>

      <View style={[styles.controlsArea, { paddingBottom: Math.max(insets.bottom, 20) + 10 }]}>
        <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('UP')}>
          <MaterialCommunityIcons name="arrow-up" size={28} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.controlRowMiddle}>
          <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('LEFT')}>
            <MaterialCommunityIcons name="arrow-left" size={28} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.dPadCenterSpace} />
          <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('RIGHT')}>
            <MaterialCommunityIcons name="arrow-right" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.dPadBtn} onPress={() => movePlayer('DOWN')}>
          <MaterialCommunityIcons name="arrow-down" size={28} color="#FFF" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    width: '200%',
    height: '200%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    zIndex: 99,
  },
  topHomeBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 46,
  },
  gameSubtitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
  },
  timerText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 22,
    color: '#FFF',
  },
  timerTextDanger: {
    color: '#FF5252',
  },

  boardWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  cell: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsArea: {
    alignItems: 'center',
    width: '100%',
    gap: 6,
  },
  controlRowMiddle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dPadBtn: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A88B7E',
    elevation: 5,
  },
  dPadCenterSpace: { width: 66, height: 66 },

  background: { flex: 1, width: '100%', height: '100%' },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cardAnchor: { width: '100%', maxWidth: 340, position: 'relative' },
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
  },
  introHomeBtn: {
    position: 'absolute',
    top: -15,
    left: -10,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  introIcon: { width: 160, height: 160, marginVertical: 20 },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    color: '#7A5C4E',
    textAlign: 'center',
    marginBottom: 12,
  },
  introText: {
    fontSize: 18,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 24,
  },
  introCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#7A5C4E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  instructionsPlaceholder: {
    fontSize: 18,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  playBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8DB863',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  finishedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    width: '85%',
    maxWidth: 340,
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  finishedIcon: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  finishedTitle: {
    fontSize: 28,
    fontFamily: 'Chewy_400Regular',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  finishedSub: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  btnFinished: {
    backgroundColor: '#7A5C4E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnFinishedText: {
    color: '#fff',
    fontFamily: 'Chewy_400Regular',
    fontSize: 18,
  },
  btnFinishedOutline: {
    borderWidth: 1.5,
    borderColor: '#7A5C4E',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  btnFinishedOutlineText: {
    color: '#7A5C4E',
    fontFamily: 'Chewy_400Regular',
    fontSize: 18,
  },
  sugarWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.3 }],
  },
  playerWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-45%',
    transform: [{ scale: 1.5 }],
    zIndex: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});
