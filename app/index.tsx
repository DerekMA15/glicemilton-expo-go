import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { AnimatedCloud, AnimatedFloat, GrassClump } from '@/components/AnimatedElements';

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const titleFontSize = Math.min(width * 0.12, 48);
  const subtitleFontSize = Math.min(width * 0.09, 38);
  const svgWidth = titleFontSize * 0.58;
  const svgHeight = titleFontSize * 0.71;
  const svgMarginTop = titleFontSize * 0.16;

  return (
    <View style={[styles.screenWrapper, { height }]}>
      <ImageBackground
        source={require('../assets/images/background_consertado.png')}
        style={styles.homeArea}
        imageStyle={{ transform: [{ scale: 1.1 }, { translateX: -15 }] }}
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

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.navigate('/two')}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>COMEÇAR</Text>
        </TouchableOpacity>

        <AnimatedFloat style={styles.characterPosition}>
          <Image
            source={require('../assets/images/character.png')}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </AnimatedFloat>

        <GrassClump left="10%" delay={0} scale={1.2} />
        <GrassClump left="40%" delay={1000} scale={0.9} />
        <GrassClump left="75%" delay={500} scale={1.1} />
        <GrassClump left="90%" delay={2000} scale={0.8} />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#222',
    width: '100%',
    overflow: 'hidden',
  },
  homeArea: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
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
  startButton: {
    position: 'absolute',
    top: '45%',
    backgroundColor: '#B3E0FF',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  startButtonText: {
    fontFamily: 'Chewy_400Regular',
    fontSize: 24,
    color: '#000',
    textTransform: 'uppercase',
  },
  characterPosition: {
    position: 'absolute',
    bottom: 40,
    left: '15%',
    width: 100,
    height: 100,
    zIndex: 2,
  },
  characterImage: {
    position: 'absolute',
    bottom: '10%',
    left: '10%',
    height: '160%',
    width: '160%',
  },
});
