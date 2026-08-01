import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AnimatedCloud, AnimatedFloat } from '../../components/AnimatedElements';

export default function LoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const titleFontSize = Math.min(width * 0.12, 48);
  const subtitleFontSize = Math.min(width * 0.09, 38);
  const svgWidth = titleFontSize * 0.58;
  const svgHeight = titleFontSize * 0.71;
  const svgMarginTop = titleFontSize * 0.16;

  return (
    <View style={styles.screenWrapper}>
      <ImageBackground
        source={require('../../assets/images/background_consertado.png')}
        style={styles.homeArea}
      >
        <AnimatedCloud top="5%" width={80} duration={30000} initialX={width * 0.1} opacity={0.9} />
        <AnimatedCloud
          top="20%"
          width={120}
          duration={45000}
          initialX={width * 0.6}
          opacity={0.7}
        />
        <AnimatedCloud top="8%" width={60} duration={50000} initialX={width * 0.9} opacity={0.6} />
        <AnimatedCloud top="28%" width={90} duration={35000} initialX={width * 0.3} opacity={0.8} />
        <AnimatedCloud
          top="2%"
          width={150}
          duration={60000}
          initialX={width * 0.75}
          opacity={0.5}
        />

        <AnimatedFloat style={styles.welcomeArea}>
          <Text style={[styles.smallText, { fontSize: subtitleFontSize }]}>Bem-vindo ao</Text>
          <View style={styles.titleRow}>
            <Text style={[styles.bigTitle, { fontSize: titleFontSize }]}>Glicemilt</Text>

            <View
              style={[
                styles.mascotOContainer,
                { marginTop: svgMarginTop, width: svgWidth, height: svgHeight },
              ]}
            >
              <Svg viewBox="15 10 70 85" width="100%" height="100%">
                <Path
                  d="M 35 30 Q 28 10 20 15"
                  fill="none"
                  stroke="#523624"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <Circle cx="20" cy="15" r="4" fill="#523624" />
                <Path
                  d="M 65 30 Q 72 10 80 15"
                  fill="none"
                  stroke="#523624"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <Circle cx="80" cy="15" r="4" fill="#523624" />
                <Circle cx="50" cy="60" r="34" fill="#BA7D53" stroke="#523624" strokeWidth="5" />
                <Circle cx="38" cy="55" r="5" fill="#523624" />
                <Circle cx="62" cy="55" r="5" fill="#523624" />
                <Path
                  d="M 38 70 Q 50 82 62 70"
                  fill="none"
                  stroke="#523624"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <Text style={[styles.bigTitle, { fontSize: titleFontSize }]}>n!</Text>
          </View>
        </AnimatedFloat>

        <View style={styles.dummyButton}>
          <Text style={styles.startButtonText}>COMEÇAR</Text>
        </View>

        <AnimatedFloat style={styles.characterPosition}>
          <Image
            source={require('../../assets/images/character.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </AnimatedFloat>
      </ImageBackground>

      <BlurView intensity={20} tint="dark" style={styles.loginOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.loginContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.navigate('/')}>
              <Text style={styles.closeButtonText}>✖</Text>
            </TouchableOpacity>

            <AnimatedFloat style={styles.loginMascotContainer}>
              <Image
                source={require('../../assets/images/character_login.png')}
                style={styles.loginMascot}
                resizeMode="contain"
              />
            </AnimatedFloat>

            <View style={styles.loginCard}>
              <Text style={styles.loginTitle}>Olá, me chamo{'\n'}Glicemilton!</Text>
              <Text style={styles.loginSubtitle}>Vamos cuidar da{'\n'}saúde juntos?</Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6C5141"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#6C5141"
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.navigate('/onboarding')}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.linksRow}>
                <Text style={styles.linkText}>Criar conta</Text>
                <Text style={styles.linkText}>Esqueci a senha</Text>
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
                  <Text style={styles.socialText}>f</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#db4a39' }]}>
                  <Text style={styles.socialText}>G</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.disclaimer}>Educativo: não possui orientação médica.</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#80A060',
  },
  screenWrapper: { flex: 1, backgroundColor: '#222' },
  homeArea: { flex: 1, width: '100%', height: '100%', alignItems: 'center' },
  welcomeArea: { position: 'absolute', top: '15%', alignItems: 'center', zIndex: 2 },
  smallText: {
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    marginBottom: -5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotOContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 2,
  },
  bigTitle: {
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  dummyButton: {
    position: 'absolute',
    top: '45%',
    backgroundColor: '#B3E0FF',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000',
    opacity: 1,
    zIndex: 2,
  },
  startButtonText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#000',
    textTransform: 'uppercase',
  },
  characterPosition: {
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  characterImage: { width: '100%', height: '100%' },

  loginOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  keyboardView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginContainer: {
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    transform: [{ translateY: -20 }],
  },
  closeButton: { position: 'absolute', top: -10, right: 0, zIndex: 20, padding: 10 },
  closeButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loginMascotContainer: { zIndex: 1, marginBottom: -60 },
  loginMascot: { width: 180, height: 180 },

  loginCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 2,
  },
  loginTitle: {
    fontSize: 28,
    fontFamily: 'Chewy_400Regular',
    color: '#6C5141',
    textAlign: 'center',
    lineHeight: 30,
  },
  loginSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C5141',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: '#BBDDF5',
    color: '#6C5141',
    fontWeight: 'bold',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#D5C44B',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  loginButtonText: {
    fontFamily: 'Chewy_400Regular',
    color: 'white',
    fontSize: 24,
    letterSpacing: 1,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  linkText: { color: '#6C5141', fontWeight: 'bold', fontSize: 14, textDecorationLine: 'underline' },
  socialRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  socialButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  disclaimer: { color: '#888', fontSize: 11, fontWeight: 'bold', textAlign: 'center' },
});
