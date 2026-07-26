import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts as useExpoFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import VictoryModal from '../../../components/VictoryModal';
import { useGame } from '../../../context/GameContext';

type Phase = 'intro' | 'storage' | 'application' | 'finished';

export default function MedicamentosScreen() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ isCorrect: false, title: '', message: '' });
  const [showIntroBtn, setShowIntroBtn] = useState(false);

  const btnOpacity = useRef(new Animated.Value(0)).current;
  const homePulseAnim = useRef(new Animated.Value(1)).current;
  const [fontsLoaded] = useExpoFonts({ Chewy_400Regular });

  const insets = useSafeAreaInsets();
  const { addPoints } = useGame();

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const STORAGE_SPLIT = '59.36%';
  const STORAGE_ASPECT = 1080 / 1920;
  const APPLICATION_ASPECT = 535 / 1024;

  const headerSpace = Math.max(insets.top, 20) + 110;
  const availableHeight = windowHeight - headerSpace - Math.max(insets.bottom, 20);

  const storageWidth = Math.min(windowWidth, availableHeight * STORAGE_ASPECT, 480);
  const storageHeight = storageWidth / STORAGE_ASPECT;

  let appHeight = availableHeight;
  let appWidth = appHeight * APPLICATION_ASPECT;

  if (appWidth > windowWidth * 0.95) {
    appWidth = windowWidth * 0.95;
    appHeight = appWidth / APPLICATION_ASPECT;
  }

  useEffect(() => {
    if (phase === 'finished') {
      addPoints('medicamentos', 10);
    }
  }, [phase, addPoints]);

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        setShowIntroBtn(true);
        Animated.timing(btnOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [phase, btnOpacity]);

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

  function showFeedback(isCorrect: boolean, title: string, message: string) {
    setFeedbackData({ isCorrect, title, message });
    setFeedbackVisible(true);
  }

  function handleCloseFeedback() {
    setFeedbackVisible(false);
    if (feedbackData.isCorrect) {
      if (phase === 'storage') setPhase('application');
      else if (phase === 'application') setPhase('finished');
    }
  }

  if (phase === 'intro') {
    return (
      <ImageBackground
        source={require('@/assets/images/background_consertado.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.introContainerClean}>
          <View style={styles.cardAnchor}>
            <Animated.View style={[styles.introHomeBtn, { transform: [{ scale: homePulseAnim }] }]}>
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons name="home" size={24} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.introCard}>
              <Text style={styles.introTitle}>Tomar os medicamentos</Text>
              <Image
                source={require('@/assets/images/icone_tomar_medicamentos.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />
              <Text style={styles.introText}>
                Administrar seus medicamentos de forma responsável, seguindo rigorosamente a
                prescrição médica, é essencial para o autocuidado no diabetes.
              </Text>

              {showIntroBtn && (
                <Animated.View style={{ opacity: btnOpacity }}>
                  <TouchableOpacity
                    style={styles.introCircleBtn}
                    onPress={() => setPhase('storage')}
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

  if (phase === 'storage') {
    return (
      <View style={styles.storageWrapper}>
        <View style={[styles.topBackground, { height: STORAGE_SPLIT }]} />
        <View style={[styles.bottomBackground, { top: STORAGE_SPLIT }]} />

        <View style={[styles.screenHeader, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity style={styles.topHomeBtnHeader} onPress={() => router.back()}>
            <MaterialCommunityIcons name="home" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.gameTitleHeader}>
            Qual o melhor local para armazenar a caneta de insulina em uso?
          </Text>
        </View>

        <View style={[styles.gameBoardStorage, { width: storageWidth, height: storageHeight }]}>
          <ImageBackground
            source={require('@/assets/images/armazenamento_insulina.png')}
            style={styles.background}
            resizeMode="cover"
          >
            <View style={styles.interactiveArea}>
              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  { top: '48%', left: '10%', width: '28%', height: '10%' },
                ]}
                onPress={() =>
                  showFeedback(
                    false,
                    'Atenção!',
                    'O calor e o contato direto com o sol podem estragar a insulina. Tente novamente!'
                  )
                }
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Criado-mudo sob a luz do sol"
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  { top: '48%', right: '12%', width: '28%', height: '10%' },
                ]}
                onPress={() =>
                  showFeedback(
                    true,
                    'Parabéns!',
                    'Você escolheu o local correto! A caneta em uso deve ficar protegida da luz solar e do calor excessivo.'
                  )
                }
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Criado-mudo na sombra"
              />
            </View>

            <FeedbackModal
              visible={feedbackVisible}
              data={feedbackData}
              onClose={handleCloseFeedback}
            />
          </ImageBackground>
        </View>
      </View>
    );
  }

  if (phase === 'application' || phase === 'finished') {
    return (
      <ImageBackground
        source={require('@/assets/images/fundo_insulina.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.screenHeader, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
          <TouchableOpacity style={styles.topHomeBtnHeader} onPress={() => router.back()}>
            <MaterialCommunityIcons name="home" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.gameTitleHeader}>
            Quais são os locais corretos de aplicação da caneta de insulina?
          </Text>
        </View>

        <View style={[styles.characterContainer, { paddingTop: headerSpace }]}>
          <View style={{ width: appWidth, height: appHeight, position: 'relative' }}>
            <Image
              source={require('@/assets/images/glicemilton_insulina.png')}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              resizeMode="contain"
            />

            <View
              style={[
                styles.interactiveArea,
                { position: 'absolute', width: '100%', height: '100%' },
              ]}
            >
              <TouchableOpacity
                style={styles.wrongAreaFull}
                activeOpacity={1}
                onPress={() =>
                  showFeedback(
                    false,
                    'Ops!',
                    'Este não é o local correto. A insulina deve ser aplicada na barriga, coxas ou parte posterior dos braços.'
                  )
                }
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  {
                    top: '55%',
                    left: '25%',
                    width: '12%',
                    height: '9%',
                    transform: [{ rotate: '-90deg' }],
                  },
                ]}
                onPress={() =>
                  showFeedback(true, 'Parabéns!', 'Os braços são ótimos locais para aplicação!')
                }
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  {
                    top: '55%',
                    right: '19%',
                    width: '17%',
                    height: '10%',
                    transform: [{ rotate: '-40deg' }],
                  },
                ]}
                onPress={() =>
                  showFeedback(true, 'Parabéns!', 'Excelente! O braço é um local recomendado.')
                }
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  { top: '68%', left: '35%', width: '36%', height: '9%' },
                ]}
                onPress={() =>
                  showFeedback(
                    true,
                    'Parabéns!',
                    'A barriga (região abdominal) é um dos melhores locais para absorção da insulina!'
                  )
                }
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  { top: '73%', left: '60%', width: '13%', height: '8%' },
                ]}
                onPress={() =>
                  showFeedback(
                    true,
                    'Parabéns!',
                    'As coxas são locais seguros e muito usados para aplicar a insulina.'
                  )
                }
              />

              <TouchableOpacity
                style={[
                  styles.invisibleButton,
                  { top: '73%', left: '34%', width: '13%', height: '8%' },
                ]}
                onPress={() =>
                  showFeedback(
                    true,
                    'Parabéns!',
                    'As coxas são locais seguros e muito usados para aplicar a insulina.'
                  )
                }
              />
            </View>
          </View>
        </View>

        <FeedbackModal
          visible={feedbackVisible}
          data={feedbackData}
          onClose={handleCloseFeedback}
        />

        <VictoryModal
          visible={phase === 'finished'}
          pointsEarned={10}
          moduleName="Tomar Medicamentos"
        />
      </ImageBackground>
    );
  }

  return null;
}

interface FeedbackModalProps {
  visible: boolean;
  data: { isCorrect: boolean; title: string; message: string };
  onClose: () => void;
}

function FeedbackModal({ visible, data, onClose }: FeedbackModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, data.isCorrect ? styles.modalCorrect : styles.modalWrong]}>
          <Text
            style={[
              styles.modalTitle,
              data.isCorrect ? { color: '#2E7D32' } : { color: '#C62828' },
            ]}
          >
            {data.title}
          </Text>
          <Text style={styles.modalMessage}>{data.message}</Text>
          <TouchableOpacity
            style={[
              styles.modalBtn,
              data.isCorrect ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#E53935' },
            ]}
            onPress={onClose}
          >
            <Text style={styles.modalBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 99,
  },
  topHomeBtnHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  gameTitleHeader: {
    flex: 1,
    fontFamily: 'Chewy_400Regular',
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    marginRight: 44,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  interactiveArea: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  invisibleButton: {
    position: 'absolute',
    zIndex: 30,
  },
  wrongAreaFull: {
    position: 'absolute',
    top: '21.5%',
    bottom: '12%',
    left: '12%',
    right: '14%',
    zIndex: 10,
  },
  storageWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#894C16',
  },
  bottomBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#613915',
  },
  gameBoardStorage: {
    overflow: 'hidden',
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    backgroundColor: '#FFF',
  },
  modalCorrect: { borderColor: '#4CAF50' },
  modalWrong: { borderColor: '#E53935' },
  modalTitle: { fontSize: 28, fontFamily: 'Chewy_400Regular', marginBottom: 12 },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: 22,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: { color: '#FFF', fontSize: 18, fontFamily: 'Chewy_400Regular' },
  introContainerClean: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
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
    backgroundColor: '#8B5A2B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  introIcon: { width: 140, height: 140, marginVertical: 20 },
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
  introCircleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
