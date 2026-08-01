import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Lane, RUNNER_ASSETS, RUNNER_CONFIG, RunnerSpawnItem } from '../../constants/runner';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ITEM_WIDTH = RUNNER_CONFIG.ITEM_SIZE * 3.0;
const ITEM_HEIGHT = RUNNER_CONFIG.ITEM_SIZE * 3.0;
const PLAYER_WIDTH = RUNNER_CONFIG.PLAYER_WIDTH * 2.5;
const PLAYER_HEIGHT = RUNNER_CONFIG.PLAYER_HEIGHT * 1.6;

interface RunnerGameProps {
  currentHealth: number;
  gameStatus: 'PLAYING' | 'LOST' | 'WON';
  onUpdateHUD: (score: number, health: number) => void;
  onGameOver: (reason: 'HEALTH' | 'TIME') => void;
}

interface ActiveItem extends RunnerSpawnItem {
  y: number;
  points?: number;
}

export default function RunnerGame({
  currentHealth,
  gameStatus,
  onUpdateHUD,
  onGameOver,
}: RunnerGameProps) {
  const [currentLane, setCurrentLane] = useState<Lane>(0);
  const [activeItems, setActiveItems] = useState<ActiveItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [trackHeight, setTrackHeight] = useState<number>(SCREEN_HEIGHT * 0.55);

  const scoreRef = useRef(score);
  const healthRef = useRef(currentHealth);
  const trackHeightRef = useRef(trackHeight);

  useEffect(() => {
    scoreRef.current = score;
    healthRef.current = currentHealth;
    trackHeightRef.current = trackHeight;
  }, [score, currentHealth, trackHeight]);

  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const spawnTimer = setInterval(() => {
      const isGood = Math.random() > 0.5;
      const itensBons = ['corda', 'tenis', 'bicicleta'];
      const itensRuins = ['celular', 'sofa', 'cama'];

      const labelSorteado = isGood
        ? itensBons[Math.floor(Math.random() * itensBons.length)]
        : itensRuins[Math.floor(Math.random() * itensRuins.length)];

      const randomLane = Math.random() > 0.5 ? 1 : 0;

      const newItem: ActiveItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: isGood ? 'GOOD' : 'BAD',
        label: labelSorteado,
        lane: randomLane,
        y: -ITEM_HEIGHT,
      };

      setActiveItems((prev) => [...prev, newItem]);
    }, RUNNER_CONFIG.SPAWN_INTERVAL_MS);

    return () => clearInterval(spawnTimer);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const gameLoop = setInterval(() => {
      setActiveItems((prevItems) => {
        const updatedItems: ActiveItem[] = [];
        const currentTrackH = trackHeightRef.current;

        for (let item of prevItems) {
          const nextY = item.y + RUNNER_CONFIG.INITIAL_SPEED;

          if (nextY >= currentTrackH - RUNNER_CONFIG.COLLISION_Y_RANGE && item.y < currentTrackH) {
            if (item.lane === currentLane) {
              if (item.type === 'GOOD') {
                const newScore = scoreRef.current + 10;
                setScore(newScore);
                setTimeout(() => {
                  onUpdateHUD(newScore, healthRef.current);
                }, 0);
              } else {
                const newHealth = Math.max(0, healthRef.current - 25);
                setTimeout(() => {
                  onUpdateHUD(scoreRef.current, newHealth);
                  if (newHealth <= 0) {
                    onGameOver('HEALTH');
                  }
                }, 0);
              }
              continue;
            }
          }

          if (nextY >= currentTrackH) {
            continue;
          }

          updatedItems.push({ ...item, y: nextY });
        }

        return updatedItems;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [currentLane, onGameOver, onUpdateHUD, gameStatus]);

  const getItemImage = (label: string) => {
    switch (label.toLowerCase()) {
      case 'celular':
        return RUNNER_ASSETS.iconCelular;
      case 'corda':
        return RUNNER_ASSETS.iconCorda;
      case 'sofa':
        return RUNNER_ASSETS.iconSofa;
      case 'tenis':
        return RUNNER_ASSETS.iconTenis;
      case 'cama':
        return RUNNER_ASSETS.iconCama;
      case 'bicicleta':
        return RUNNER_ASSETS.iconBicicleta;
      default:
        return RUNNER_ASSETS.iconCorda;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.trackContainer}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout;
          if (height > 0) setTrackHeight(height);
        }}
      >
        <View style={styles.lane} />
        <View style={styles.lane} />

        {activeItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.fallingItem,
              {
                left: item.lane === 0 ? '25%' : '75%',
                marginLeft: -ITEM_WIDTH / 2,
                top: item.y,
              },
            ]}
          >
            <Image
              source={getItemImage(item.label || '')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>
        ))}

        <View
          style={[
            styles.player,
            {
              left: currentLane === 0 ? '25%' : '75%',
              marginLeft: -PLAYER_WIDTH / 2,
            },
          ]}
        >
          <Image
            source={RUNNER_ASSETS.antHappy}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.hugeAnalogButton}
          onPress={() => setCurrentLane(0)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={36} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.hugeAnalogButton}
          onPress={() => setCurrentLane(1)}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-forward" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  trackContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  lane: {
    flex: 1,
    height: '100%',
  },
  fallingItem: {
    position: 'absolute',
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  player: {
    position: 'absolute',
    bottom: 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    height: 95,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    paddingBottom: 10,
  },
  hugeAnalogButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: 'rgba(109, 83, 71, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E0E0E0',
    elevation: 6,
  },
});
