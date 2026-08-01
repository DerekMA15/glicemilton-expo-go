import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RunnerGame from '@/components/runner/RunnerGame';
import VictoryModal from '@/components/VictoryModal';
import { RUNNER_ASSETS, RUNNER_CONFIG } from '@/constants/runner';

type ScreenState =
  'CONCEPT' | 'ASK_INSTRUCTIONS' | 'INST_STEP_1' | 'INST_STEP_2' | 'INST_STEP_3' | 'PLAYING';

export default function CorridaScreen() {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const insets = useSafeAreaInsets();

  const [currentScreen, setCurrentScreen] = useState<ScreenState>('CONCEPT');
  const [score, setScore] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(RUNNER_CONFIG.GAME_DURATION_SEC);
  const [gameStatus, setGameStatus] = useState<'PLAYING' | 'LOST' | 'WON'>('PLAYING');
  const [endReason, setEndReason] = useState<'HEALTH' | 'TIME' | null>(null);

  const [gameKey, setGameKey] = useState<number>(0);

  const [showIntroBtn, setShowIntroBtn] = useState(false);
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const homePulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (currentScreen !== 'PLAYING' || gameStatus !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setEndReason('TIME');
          setGameStatus('WON');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, currentScreen]);

  useEffect(() => {
    if (currentScreen === 'CONCEPT') {
      const timer = setTimeout(() => {
        setShowIntroBtn(true);
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setShowIntroBtn(false);
      btnOpacity.setValue(0);
    }
  }, [currentScreen, btnOpacity]);

  useEffect(() => {
    homePulseAnim.setValue(1.0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(homePulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(homePulseAnim, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [currentScreen, gameStatus, homePulseAnim]);

  const handleHUDUpdate = useCallback((newScore: number, newHealth: number) => {
    setScore(newScore);
    setHealth(newHealth);
  }, []);

  const handleGameOver = useCallback((reason: 'HEALTH' | 'TIME') => {
    setEndReason(reason);
    setGameStatus('LOST');
  }, []);

  const resetGame = () => {
    setScore(0);
    setHealth(100);
    setTimeLeft(RUNNER_CONFIG.GAME_DURATION_SEC);
    setEndReason(null);
    setGameStatus('PLAYING');
    setCurrentScreen('PLAYING');
    setGameKey((prev) => prev + 1);
  };

  if (!fontsLoaded) return null;

  if (currentScreen === 'CONCEPT') {
    return (
      <ImageBackground
        source={require('@/assets/images/background_consertado.png')}
        style={styles.introBg}
        resizeMode="cover"
      >
        <View style={styles.cardAnchor}>
          <Animated.View style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.transparentOverlayCard}>
            <Text style={styles.introTitle}>Praticar exercícios</Text>

            <Image
              source={RUNNER_ASSETS.antRunningIcon}
              style={styles.antIconImage}
              resizeMode="contain"
            />

            <Text style={styles.introText}>
              A atividade física faz muito bem para a saúde, controlando o diabetes, protegendo o
              coração, controlando o peso, fortalecendo o corpo e a mente.
            </Text>

            {showIntroBtn && (
              <Animated.View style={{ opacity: btnOpacity }}>
                <TouchableOpacity
                  style={styles.brownCircleBtn}
                  onPress={() => setCurrentScreen('ASK_INSTRUCTIONS')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chevron-forward" size={36} color="#FFF" />
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (currentScreen === 'ASK_INSTRUCTIONS') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.0 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.introContainer}>
          <Text style={styles.questionTitle}>Precisa de instruções?</Text>

          <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
            <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.decisionRow}>
            <TouchableOpacity
              style={[styles.thumbBtn, { backgroundColor: '#689F38', borderColor: '#DCEDC8' }]}
              onPress={() => setCurrentScreen('INST_STEP_1')}
              activeOpacity={0.8}
            >
              <Ionicons name="thumbs-up" size={50} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.thumbBtn, { backgroundColor: '#D32F2F', borderColor: '#FFCDD2' }]}
              onPress={() => setCurrentScreen('PLAYING')}
              activeOpacity={0.8}
            >
              <Ionicons name="thumbs-down" size={50} color="white" />
            </TouchableOpacity>
          </View>

          <Image
            source={RUNNER_ASSETS.antHappy}
            style={styles.antHappyImage}
            resizeMode="contain"
          />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (currentScreen === 'INST_STEP_1') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.0 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
            <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCelular}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCorda}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[styles.homeButton, styles.navButtonLeftFloat]}
            onPress={() => setCurrentScreen('INST_STEP_2')}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={36} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (currentScreen === 'INST_STEP_2') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.0 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
            <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconSofa}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconTenis}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[styles.homeButton, styles.navButtonLeftFloat]}
            onPress={() => setCurrentScreen('INST_STEP_3')}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-forward" size={36} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (currentScreen === 'INST_STEP_3') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgBlueInstructions}
        style={styles.fullscreenBg}
        imageStyle={{ transform: [{ scale: 1.0 }] }}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.instructionContainer}>
          <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
            <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionHeader}>Instruções:</Text>
            <View style={styles.comparisonRow}>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconCama}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="close-circle" size={38} color="#F44336" />
              </View>
              <View style={styles.comparisonItem}>
                <Image
                  source={RUNNER_ASSETS.iconBicicleta}
                  style={styles.itemIcon}
                  resizeMode="contain"
                />
                <MaterialCommunityIcons name="check-circle" size={38} color="#4CAF50" />
              </View>
            </View>
          </View>

          <View style={styles.characterBottomRight} pointerEvents="none">
            <Image
              source={RUNNER_ASSETS.antExplaining}
              style={styles.characterLarge}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.homeButton,
              styles.navButtonLeftFloat,
              { backgroundColor: '#8DB863', borderColor: '#DCEDC8', borderWidth: 4 },
            ]}
            onPress={() => setCurrentScreen('PLAYING')}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (currentScreen === 'PLAYING') {
    return (
      <ImageBackground
        source={RUNNER_ASSETS.bgdirtroad}
        style={{ flex: 1, width: '100%', height: '100%' }}
        imageStyle={{ transform: [{ scale: 1.0 }] }}
        resizeMode="cover"
      >
        <View style={{ position: 'absolute', top: insets.top + 90, left: 20, zIndex: 99 }}>
          <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            paddingTop: insets.top,
            alignItems: 'center',
          }}
        >
          <View style={styles.hudOverlay}>
            <View style={styles.hudRow}>
              <Text style={styles.scoreText}>Pts: {score}</Text>
              <View style={styles.timeBadge}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#FFF" />
                <Text style={styles.timeText}>{timeLeft}s</Text>
              </View>
            </View>

            <View style={styles.healthBarOutline}>
              <View style={[styles.healthBarFill, { width: `${health}%` }]} />
            </View>
          </View>

          <RunnerGame
            key={gameKey}
            gameStatus={gameStatus}
            currentHealth={health}
            onUpdateHUD={handleHUDUpdate}
            onGameOver={handleGameOver}
          />

          <Modal visible={gameStatus === 'LOST'} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <View style={{ position: 'absolute', top: -15, left: -10, zIndex: 99 }}>
                  <Animated.View
                    style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}
                  >
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons name="home" size={24} color="#FFF" />
                    </TouchableOpacity>
                  </Animated.View>
                </View>

                <Text style={styles.modalEmoji}>💥</Text>
                <Text style={styles.modalTitle}>Fim de Jogo!</Text>

                <Text style={styles.modalMessage}>
                  Sua energia acabou! Cuidado com o excesso de doces e o sedentarismo no cotidiano.
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalBtnPrimary} onPress={resetGame}>
                    <Text style={styles.modalBtnText}>Tentar Novamente</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalBtnSecondary}
                    onPress={() => router.replace('/(tabs)/onboarding')}
                  >
                    <Text style={styles.modalBtnSecondaryText}>Sair para o Menu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <VictoryModal visible={gameStatus === 'WON'} pointsEarned={score} moduleName="Corrida" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  introBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fullscreenBg: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  homeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  navButtonLeftFloat: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    zIndex: 20,
  },
  antIconImage: {
    width: 130,
    height: 130,
    marginBottom: 24,
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  questionTitle: {
    top: '2.8%',
    fontFamily: 'Chewy_400Regular',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 10,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
    justifyContent: 'center',
    zIndex: 5,
  },
  thumbBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    elevation: 5,
  },
  antHappyImage: {
    width: 320,
    height: 400,
    marginTop: 20,
  },
  instructionContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    width: '100%',
    overflow: 'hidden',
  },
  instructionCard: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '90%',
    maxWidth: 380,
    height: 280,
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  instructionHeader: {
    fontSize: 30,
    fontFamily: 'Chewy_400Regular',
    color: '#6D4C41',
    marginBottom: 5,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  comparisonItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
  },
  itemIcon: {
    width: 200,
    height: 200,
    marginBottom: -10,
  },
  characterBottomRight: {
    position: 'absolute',
    bottom: -15,
    right: -35,
    zIndex: 1,
  },
  characterLarge: {
    width: 320,
    height: 400,
  },
  hudOverlay: {
    width: '90%',
    maxWidth: 360,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  hudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  scoreText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#FFF',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthBarOutline: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  healthBarFill: {
    height: '100%',
    backgroundColor: '#E57373',
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#6D4C41',
    elevation: 10,
    position: 'relative',
  },
  modalEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  modalTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    color: '#6D4C41',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontWeight: '500',
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  modalBtnPrimary: {
    backgroundColor: '#6D4C41',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Chewy_400Regular',
  },
  modalBtnSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6D4C41',
  },
  modalBtnSecondaryText: {
    color: '#6D4C41',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardAnchor: {
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  transparentOverlayCard: {
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
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
    elevation: 6,
  },
  gameHomeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#6D4C41',
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
  brownCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
