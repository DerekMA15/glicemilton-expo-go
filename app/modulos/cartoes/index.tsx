import CardAssociationGrid from '@/components/cartao/CardAssociationGrid';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VictoryModal from '../../../components/VictoryModal';
import { useGame } from '../../../context/GameContext';

type ScreenState = 'CONCEPT' | 'INSTRUCTIONS' | 'PLAYING';

export default function CartoesScreen() {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('CONCEPT');
  const insets = useSafeAreaInsets();

  const [showIntroBtn, setShowIntroBtn] = useState(false);
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const homePulseAnim = useRef(new Animated.Value(1)).current;

  const { addPoints } = useGame();
  const [showVictory, setShowVictory] = useState(false);

  const handleGameComplete = useCallback(() => {
    addPoints('modulo_cartoes', 10);
    setShowVictory(true);
  }, [addPoints]);

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
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(homePulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
        Animated.timing(homePulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [homePulseAnim]);

  if (!fontsLoaded) return null;

  if (currentScreen === 'CONCEPT') {
    return (
      <ImageBackground
        source={require('../../../assets/images/background_consertado.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity
                onPress={() => router.navigate('/(tabs)/onboarding')}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Voltar para o Menu"
              >
                <Ionicons name="home" size={24} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Resolver problemas</Text>

              <Image
                source={require('../../../assets/images/icone_resolver_problemas.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />

              <Text style={styles.introText}>
                No manejo do diabetes, a prevenção ativa de picos (hiper) e quedas (hipoglicemia) é
                crucial. Agir nas duas frentes é o segredo para o bom controle glicêmico.
              </Text>

              {showIntroBtn && (
                <Animated.View style={{ opacity: btnOpacity }}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => setCurrentScreen('INSTRUCTIONS')}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel="Avançar para instruções"
                  >
                    <Ionicons name="chevron-forward" size={40} color="#FFF" />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (currentScreen === 'INSTRUCTIONS') {
    return (
      <ImageBackground
        source={require('../../../assets/images/fundo_resolver_problemas.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
          <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
            <TouchableOpacity
              onPress={() => setCurrentScreen('CONCEPT')}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Voltar para introdução"
            >
              <Ionicons name="home" size={24} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.cardAnchor}>
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>⚠️ Atenção!</Text>

            <Text style={styles.instructionText}>
              Encontre os pares corretos! Vire duas cartas por vez e combine cada problema com a sua
              respectiva solução.
            </Text>

            <Text style={styles.instructionText}>Se acertar, o par permanecerá virado.</Text>

            <Text style={styles.instructionText}>
              Se errar, as cartas serão escondidas novamente. Continue até encontrar todos os pares.
            </Text>

            <Text style={styles.instructionText}>Boa sorte!</Text>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setCurrentScreen('PLAYING')}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Iniciar jogo"
            >
              <Ionicons name="play" size={36} color="white" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/fundo_zoom.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={{ position: 'absolute', top: insets.top + 15, left: 20, zIndex: 99 }}>
        <Animated.View style={[styles.gameHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
          <TouchableOpacity
            onPress={() => setCurrentScreen('CONCEPT')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Voltar para introdução"
          >
            <Ionicons name="home" size={24} color="#FFF" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <CardAssociationGrid onGameComplete={handleGameComplete} />

      <VictoryModal visible={showVictory} pointsEarned={10} moduleName="Resolver Problemas" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardAnchor: {
    width: '100%',
    maxWidth: 360,
    position: 'relative',
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
  introCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  introTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 34,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 16,
  },
  introIcon: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  introText: {
    fontSize: 19,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  startButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  instructionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  instructionTitle: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 32,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 17,
    color: '#5D4037',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
    marginBottom: 14,
  },
  instructionGoodLuck: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 26,
    color: '#6D4C41',
    textAlign: 'center',
    marginBottom: 18,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8DB863',
    borderWidth: 4,
    borderColor: '#DCEDC8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
