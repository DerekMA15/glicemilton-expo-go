import { useGame } from '@/context/GameContext';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { AnimatedFloat } from '../../components/AnimatedElements';

export default function DashboardScreen() {
  const router = useRouter();
  const { state } = useGame();
  const { width, height } = useWindowDimensions();

  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [languageListOpen, setLanguageListOpen] = useState(false);

  const [registro, setRegistro] = useState({ data: '', hora: '', condicao: '', indice: '' });

  const [config, setConfig] = useState({
    apelido: '',
    aniversario: '',
    tipoDiabetes: '',
    idioma: 'Português',
    musica: true,
    efeitosSonoros: true,
    notificacoes: true,
  });

  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
      -1,
      true
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const titleFontSize = Math.min(width * 0.08, 32);
  const labelFontSize = Math.min(width * 0.06, 24);
  const valueFontSize = Math.min(width * 0.12, 48);
  const characterHeight = Math.min(height * 0.3, 230);

  const navigateToGame = (gameName: string) => {
    if (gameName === 'Vigiar Taxas' || gameName === 'Medir Glicemia') {
      router.push('/modulos/vigiarTaxas');
    } else if (gameName === 'Adaptação Saudável') {
      router.push('/modulos/labirinto');
    } else if (gameName === 'Atividade Física') {
      router.push('/modulos/corrida');
    } else {
      Alert.alert('Em breve', `O módulo ${gameName} ainda está em desenvolvimento!`);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/fundo_zoom.png')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ transform: [{ scale: 1.08 }, { translateY: -30 }] }}
    >
      <SafeAreaView style={[styles.safeArea, { height }]}>
        <View style={styles.topContainer}>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.circleButton} onPress={() => setSettingsVisible(true)}>
              <MaterialCommunityIcons name="cog" size={24} color="white" />
            </TouchableOpacity>

            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity style={styles.circleButton} onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons name="folder" size={24} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.topCard}>
            <View style={styles.cardHeader}>
              <View style={styles.glicemiaLabel}>
                <View style={styles.dropIcon} />
                <Text style={styles.cardTitle}>Glicemia</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.valueRow}>
                <Text style={[styles.glicemiaValue, { fontSize: valueFontSize }]}>104</Text>
                <Text style={styles.glicemiaUnit}>mg/dL</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Points</Text>
                <Text style={styles.scoreValue}>{state.totalPoints}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <AnimatedFloat>
            <Image
              source={require('../../assets/images/glicemilton_feliz.png')}
              style={[styles.characterImage, { height: characterHeight }]}
              resizeMode="contain"
            />
          </AnimatedFloat>

          <View style={styles.bottomGrid}>
            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/exercicios')}
              >
                <Image
                  source={require('../../assets/images/icone_reduzir_os_riscos.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Adaptação Saudável')}
              >
                <Image
                  source={require('../../assets/images/icone_adaptacao_saudavel.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/prato')}
              >
                <Image
                  source={require('../../assets/images/icone_comer_saudavelmente.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.gridRow}>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/medicamentos')}
              >
                <Image
                  source={require('../../assets/images/icone_tomar_medicamentos.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => router.navigate('/modulos/cartoes')}
              >
                <Image
                  source={require('../../assets/images/icone_resolver_problemas.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '24%' }]}
                onPress={() => navigateToGame('Medir Glicemia')}
              >
                <Image
                  source={require('../../assets/images/icone_vigiar_taxas.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.moduleButton, { width: '22%' }]}
                onPress={() => navigateToGame('Atividade Física')}
              >
                <Image
                  source={require('../../assets/images/icone_atividade_fisica.png')}
                  style={styles.moduleIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={require('../../assets/images/fundo_zoom.png')}
              style={styles.modalBg}
              resizeMode="cover"
            >
              <SafeAreaView style={styles.modalSafeArea}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                >
                  <View style={styles.notebookContainer}>
                    <Text style={[styles.notebookTitle, { fontSize: titleFontSize }]}>
                      Registros anteriores
                    </Text>

                    <ScrollView
                      contentContainerStyle={styles.notebookContent}
                      showsVerticalScrollIndicator={false}
                    >
                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>Data:</Text>
                        <TextInput
                          style={styles.input}
                          value={registro.data}
                          onChangeText={(t) => setRegistro({ ...registro, data: t })}
                          placeholder="Ex: 10/10/2023"
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>Hora:</Text>
                        <TextInput
                          style={styles.input}
                          value={registro.hora}
                          onChangeText={(t) => setRegistro({ ...registro, hora: t })}
                          placeholder="Ex: 08:30"
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <View style={styles.conditionHeaderRow}>
                          <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                            Condição:
                          </Text>
                          <Text style={styles.inputSubLabel}>
                            Em jejum / Antes de comer{'\n'}/ 1h depois de comer / 2h{'\n'}depois de
                            comer
                          </Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          value={registro.condicao}
                          onChangeText={(t) => setRegistro({ ...registro, condicao: t })}
                          placeholder="Digite a condição..."
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Índice glicêmico (mg/dL):
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={registro.indice}
                          onChangeText={(t) => setRegistro({ ...registro, indice: t })}
                          placeholder="Ex: 110"
                          placeholderTextColor="#A99282"
                          keyboardType="numeric"
                        />
                      </View>
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeModalBtn}
                      onPress={() => setModalVisible(false)}
                    >
                      <MaterialCommunityIcons name="home" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </ImageBackground>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={settingsVisible}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ImageBackground
              source={require('../../assets/images/fundo_zoom.png')}
              style={styles.modalBg}
              resizeMode="cover"
            >
              <SafeAreaView style={styles.modalSafeArea}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={{ flex: 1 }}
                >
                  <View style={styles.notebookContainer}>
                    <Text style={[styles.notebookTitle, { fontSize: titleFontSize }]}>
                      Configurações
                    </Text>

                    <ScrollView
                      contentContainerStyle={styles.notebookContent}
                      showsVerticalScrollIndicator={false}
                    >
                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Apelido:
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={config.apelido}
                          onChangeText={(t) => setConfig({ ...config, apelido: t })}
                          placeholder="Digite seu apelido..."
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Aniversário:
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={config.aniversario}
                          onChangeText={(t) => setConfig({ ...config, aniversario: t })}
                          placeholder="Ex: 15/05/1995"
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Diabetes Mellitus tipo X:
                        </Text>
                        <TextInput
                          style={styles.input}
                          value={config.tipoDiabetes}
                          onChangeText={(t) => setConfig({ ...config, tipoDiabetes: t })}
                          placeholder="Ex: Tipo 1 / Tipo 2"
                          placeholderTextColor="#A99282"
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Idioma:
                        </Text>
                        <TouchableOpacity
                          style={styles.dropdownButton}
                          onPress={() => setLanguageListOpen(!languageListOpen)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.dropdownButtonText}>{config.idioma}</Text>
                          <MaterialCommunityIcons
                            name={languageListOpen ? 'chevron-up' : 'chevron-down'}
                            size={24}
                            color="#6C5141"
                          />
                        </TouchableOpacity>

                        {languageListOpen && (
                          <View style={styles.dropdownList}>
                            {['Português', 'Inglês', 'Espanhol'].map((lang) => (
                              <TouchableOpacity
                                key={lang}
                                style={styles.dropdownOption}
                                onPress={() => {
                                  setConfig({ ...config, idioma: lang });
                                  setLanguageListOpen(false);
                                }}
                              >
                                <Text style={styles.dropdownOptionText}>{lang}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>

                      <View style={styles.settingRow}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Música:
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            config.musica ? styles.toggleOn : styles.toggleOff,
                          ]}
                          onPress={() => setConfig({ ...config, musica: !config.musica })}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.toggleBtnText}>
                            {config.musica ? 'LIGADO' : 'DESLIGADO'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.settingRow}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Efeitos sonoros:
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            config.efeitosSonoros ? styles.toggleOn : styles.toggleOff,
                          ]}
                          onPress={() =>
                            setConfig({ ...config, efeitosSonoros: !config.efeitosSonoros })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.toggleBtnText}>
                            {config.efeitosSonoros ? 'LIGADO' : 'DESLIGADO'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.settingRow}>
                        <Text style={[styles.inputLabel, { fontSize: labelFontSize }]}>
                          Notificações:
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.toggleBtn,
                            config.notificacoes ? styles.toggleOn : styles.toggleOff,
                          ]}
                          onPress={() =>
                            setConfig({ ...config, notificacoes: !config.notificacoes })
                          }
                          activeOpacity={0.8}
                        >
                          <Text style={styles.toggleBtnText}>
                            {config.notificacoes ? 'LIGADO' : 'DESLIGADO'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.policyBtn}>
                        <Text style={[styles.policyBtnText, { fontSize: labelFontSize }]}>
                          Política de privacidade
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>

                    <TouchableOpacity
                      style={styles.closeModalBtn}
                      onPress={() => {
                        setSettingsVisible(false);
                        setLanguageListOpen(false);
                      }}
                    >
                      <MaterialCommunityIcons name="home" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </ImageBackground>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 20 : 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
    width: '100%',
  },

  topContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
  },
  headerButtons: {
    width: '100%',
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: Platform.OS === 'web' ? 10 : 0,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(108, 81, 65, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  topCard: {
    backgroundColor: 'white',
    width: '85%',
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  glicemiaLabel: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dropIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#8DB863',
    borderRadius: 10,
    borderTopRightRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#6C5141' },
  progressBar: { flex: 1, height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, marginLeft: 15 },
  progressFill: { width: '70%', height: '100%', backgroundColor: '#8DB863', borderRadius: 6 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  glicemiaValue: { fontWeight: '900', color: '#6C5141', lineHeight: 50 },
  glicemiaUnit: { fontSize: 18, fontWeight: 'bold', color: '#6C5141', marginLeft: 5 },
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: '#F29C38',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreLabel: { fontSize: 14, fontFamily: 'Chewy_400Regular', color: 'white' },
  scoreValue: { fontSize: 22, fontFamily: 'Chewy_400Regular', color: 'white' },

  bottomSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  characterImage: {
    width: 220,
    marginBottom: 0,
  },
  bottomGrid: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    width: '100%',
  },
  moduleButton: { aspectRatio: 1 },
  moduleIcon: { width: '100%', height: '100%', resizeMode: 'contain' },

  modalOverlay: { flex: 1 },
  modalBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  modalSafeArea: { flex: 1 },
  notebookContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  notebookTitle: {
    fontFamily: 'Chewy_400Regular',
    color: '#8B5E3C',
    textAlign: 'center',
    marginBottom: 20,
  },
  notebookContent: { paddingBottom: 10 },

  inputGroup: { marginBottom: 15 },
  inputLabel: {
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
  },
  conditionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 2,
  },
  inputSubLabel: {
    fontSize: 11,
    color: '#8B5E3C',
    fontWeight: 'bold',
    textAlign: 'right',
    maxWidth: '65%',
    lineHeight: 14,
  },
  input: {
    fontSize: 18,
    color: '#6C5141',
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    paddingVertical: 5,
  },

  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D2B48C',
    paddingVertical: 5,
  },
  dropdownButtonText: {
    fontSize: 18,
    color: '#6C5141',
  },
  dropdownList: {
    backgroundColor: 'rgba(210, 180, 140, 0.15)',
    borderRadius: 10,
    marginTop: 5,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(210, 180, 140, 0.2)',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#6C5141',
    fontWeight: 'bold',
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  toggleOn: {
    backgroundColor: '#8DB863',
    borderColor: '#5B7A3E',
  },
  toggleOff: {
    backgroundColor: '#D2B48C',
    borderColor: '#A99282',
  },
  toggleBtnText: {
    fontFamily: 'Chewy_400Regular',
    color: '#FFF',
    fontSize: 18,
  },

  policyBtn: {
    marginTop: 10,
    paddingVertical: 10,
  },
  policyBtnText: {
    fontFamily: 'Chewy_400Regular',
    color: '#8B5E3C',
    textDecorationLine: 'underline',
  },

  closeModalBtn: {
    alignSelf: 'center',
    backgroundColor: '#8B5E3C',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
