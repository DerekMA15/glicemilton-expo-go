import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CARTOES_COLORS, CardItem, TABULEIRO_CARTOES } from '@/constants/cartoes';

const COLUMNS = 3;
const ROWS = 4;
const TOTAL_PAIRS = TABULEIRO_CARTOES.length / 2;

export default function CardAssociationGrid({ onGameComplete }: { onGameComplete?: () => void }) {
  const [fontsLoaded] = useFonts({ Chewy_400Regular });
  const [firstSelected, setFirstSelected] = useState<CardItem | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

  const insets = useSafeAreaInsets();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onGameCompleteRef = useRef(onGameComplete);

  useEffect(() => {
    onGameCompleteRef.current = onGameComplete;
  });

  const shuffledBoard = useMemo(() => {
    const cards = [...TABULEIRO_CARTOES];
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (matchedPairs.size === TOTAL_PAIRS) {
      setTimeout(() => onGameCompleteRef.current?.(), 500);
    }
  }, [matchedPairs]);

  if (!fontsLoaded) return null;

  function handleCardPress(card: CardItem) {
    if (matchedPairs.has(card.pairId) || wrongIds.size > 0) return;
    if (firstSelected?.id === card.id) return;

    if (!firstSelected) {
      setFirstSelected(card);
      return;
    }

    if (firstSelected.pairId === card.pairId) {
      setMatchedPairs((prev) => new Set([...prev, card.pairId]));
      setFirstSelected(null);
    } else {
      setWrongIds(new Set([firstSelected.id, card.id]));
      setFirstSelected(null);
      timerRef.current = setTimeout(() => setWrongIds(new Set()), 1200);
    }
  }

  function getCardStyle(card: CardItem) {
    if (matchedPairs.has(card.pairId)) return styles.cardSuccess;
    if (wrongIds.has(card.id)) return styles.cardError;
    if (firstSelected?.id === card.id) return styles.cardSelected;
    return styles.cardHidden;
  }

  function isRevealed(card: CardItem) {
    return matchedPairs.has(card.pairId) || firstSelected?.id === card.id || wrongIds.has(card.id);
  }

  const rows: CardItem[][] = [];
  for (let i = 0; i < shuffledBoard.length; i += COLUMNS) {
    rows.push(shuffledBoard.slice(i, i + COLUMNS));
  }

  const TOP_SPACE = insets.top + 65;
  const BOTTOM_SPACE = Math.max(insets.bottom, 12);

  return (
    <View style={[styles.container, { paddingTop: TOP_SPACE, paddingBottom: BOTTOM_SPACE }]}>
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[styles.row, { marginBottom: rowIndex < rows.length - 1 ? 6 : 0 }]}
          >
            {row.map((card, colIndex) => {
              const revealed = isRevealed(card);
              const isMatched = matchedPairs.has(card.pairId);
              const isWrong = wrongIds.has(card.id);

              return (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.card,
                    getCardStyle(card),
                    {
                      marginRight: colIndex < COLUMNS - 1 ? 6 : 0,
                    },
                  ]}
                  onPress={() => handleCardPress(card)}
                  activeOpacity={isMatched ? 1 : 0.75}
                  disabled={isMatched}
                  accessibilityRole="button"
                  accessibilityLabel={card.alt}
                >
                  {revealed ? (
                    <Image source={card.image} style={styles.cardImage} resizeMode="contain" />
                  ) : (
                    <View style={styles.hiddenCover} />
                  )}

                  {isMatched && (
                    <View style={styles.iconOverlay}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={CARTOES_COLORS.successBorder}
                      />
                    </View>
                  )}
                  {isWrong && (
                    <View style={styles.iconOverlay}>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color={CARTOES_COLORS.errorBorder}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    position: 'relative',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  hiddenCover: {
    width: '100%',
    height: '100%',
    backgroundColor: CARTOES_COLORS.cardBackBg,
  },
  iconOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 1,
  },
  cardHidden: {
    backgroundColor: CARTOES_COLORS.cardBackBg,
    borderColor: CARTOES_COLORS.cardBackBorder,
  },
  cardSelected: {
    backgroundColor: CARTOES_COLORS.selectedBg,
    borderColor: CARTOES_COLORS.selectedBorder,
  },
  cardSuccess: {
    backgroundColor: CARTOES_COLORS.successBg,
    borderColor: CARTOES_COLORS.successBorder,
  },
  cardError: {
    backgroundColor: CARTOES_COLORS.errorBg,
    borderColor: CARTOES_COLORS.errorBorder,
  },
});
