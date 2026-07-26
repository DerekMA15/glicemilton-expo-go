import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useFonts as useExpoFonts } from 'expo-font';
import { Chewy_400Regular } from '@expo-google-fonts/chewy';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Phase = 'intro' | 'chart' | 'game';
type FoodCategory = 'carbs' | 'drinks' | 'proteins' | 'vegetables' | 'fruits';

export type FoodItem = {
  id: string;
  name: string;
  category: FoodCategory;
  portion: string;
  carbs: number;
  cals: number;
  insulin: number;
  conveyorImage: any | null;
  plateSliceImage: any | null;
  color: string;
  isSolid?: boolean;
  uniqueId?: string;
};

const FOOD_DATABASE: FoodItem[] = [
  {
    id: 'c1',
    name: 'Pão francês',
    category: 'carbs',
    portion: '1 unid. (50g)',
    carbs: 29,
    cals: 135,
    insulin: 2,
    conveyorImage: require('@/assets/images/prato/carboidratos/pao_frances.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/pao_frances.png'),
    color: '#D7CCC8',
  },
  {
    id: 'c2',
    name: 'Pão de queijo',
    category: 'carbs',
    portion: '1 unid. média (27g)',
    carbs: 9,
    cals: 55,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/carboidratos/pao_queijo.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/pao_queijo.png'),
    color: '#FFE082',
  },
  {
    id: 'c3',
    name: 'Arroz branco',
    category: 'carbs',
    portion: '1 col. sopa (20g)',
    carbs: 6,
    cals: 26,
    insulin: 0.5,
    conveyorImage: require('@/assets/images/prato/carboidratos/arroz.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/arroz.png'),
    color: '#E0E0E0',
  },
  {
    id: 'c4',
    name: 'Macarrão ao alho e óleo',
    category: 'carbs',
    portion: '1 escumadeira (110g)',
    carbs: 28,
    cals: 195,
    insulin: 2,
    conveyorImage: require('@/assets/images/prato/carboidratos/macarrao.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/macarrao.png'),
    color: '#FFCC80',
  },
  {
    id: 'c5',
    name: 'Massa de panqueca sem recheio',
    category: 'carbs',
    portion: '1 unid. pequena (30g)',
    carbs: 9,
    cals: 79,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/carboidratos/panqueca.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/panqueca.png'),
    color: '#FFD54F',
  },
  {
    id: 'c6',
    name: 'Macaxeira cozida',
    category: 'carbs',
    portion: '1 pedaço grande (100g)',
    carbs: 30,
    cals: 120,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/carboidratos/macaxeira.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/macaxeira.png'),
    color: '#FFF59D',
  },
  {
    id: 'c7',
    name: 'Cuscuz de milho com sal',
    category: 'carbs',
    portion: '1 pedaço pequeno (85g)',
    carbs: 21,
    cals: 96,
    insulin: 2,
    conveyorImage: require('@/assets/images/prato/carboidratos/cuscuz.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/cuscuz.png'),
    color: '#FFCA28',
  },
  {
    id: 'c8',
    name: 'Bolo de milho',
    category: 'carbs',
    portion: '1 fatia média (60g)',
    carbs: 32,
    cals: 174,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/carboidratos/bolo_milho.png'),
    plateSliceImage: require('@/assets/images/prato/carboidratos/bolo_milho.png'),
    color: '#FFB300',
  },
  {
    id: 'p1',
    name: 'Coxa de frango',
    category: 'proteins',
    portion: '1 unid. média (55g)',
    carbs: 0,
    cals: 118,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/coxa.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/coxa.png'),
    color: '#FFC107',
  },
  {
    id: 'p2',
    name: 'Carne assada',
    category: 'proteins',
    portion: '1 fatia média (90g)',
    carbs: 0,
    cals: 259,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/carne_assada.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/carne_assada.png'),
    color: '#8D6E63',
  },
  {
    id: 'p3',
    name: 'Filé de peixe frito',
    category: 'proteins',
    portion: '1 filé (100g)',
    carbs: 0,
    cals: 180,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/file.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/file.png'),
    color: '#BCAAA4',
  },
  {
    id: 'p4',
    name: 'Ovo frito',
    category: 'proteins',
    portion: '1 unid. média (65g)',
    carbs: 2,
    cals: 110,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/ovo.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/ovo.png'),
    color: '#FFF59D',
  },
  {
    id: 'p5',
    name: 'Feijão comum carioquinha cozido',
    category: 'proteins',
    portion: '1 col. sopa média (17g)',
    carbs: 3,
    cals: 19,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/feijao_comum.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/feijao_comum.png'),
    color: '#795548',
  },
  {
    id: 'p6',
    name: 'Feijão preto cozido',
    category: 'proteins',
    portion: '1 col. sopa (17g)',
    carbs: 2,
    cals: 13,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/feijao_preto.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/feijao_preto.png'),
    color: '#3E2723',
  },
  {
    id: 'p7',
    name: 'Queijo minas padrão',
    category: 'proteins',
    portion: '1 fatia média (30g)',
    carbs: 0,
    cals: 107,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/queijo.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/queijo.png'),
    color: '#F5F5F5',
  },
  {
    id: 'p8',
    name: 'Nuggets de frango simples',
    category: 'proteins',
    portion: '1 unid. (22g)',
    carbs: 3,
    cals: 40,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/proteinas/nuggets.png'),
    plateSliceImage: require('@/assets/images/prato/proteinas/nuggets.png'),
    color: '#FFB300',
  },
  {
    id: 'v1',
    name: 'Alface',
    category: 'vegetables',
    portion: '1 folha média (10g)',
    carbs: 0,
    cals: 1,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/alface.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/alface.png'),
    color: '#4CAF50',
  },
  {
    id: 'v2',
    name: 'Tomate',
    category: 'vegetables',
    portion: '1 fatia média (15g)',
    carbs: 0.6,
    cals: 3,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/tomate.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/tomate.png'),
    color: '#F44336',
  },
  {
    id: 'v3',
    name: 'Cenoura crua ralada',
    category: 'vegetables',
    portion: '1 col. sopa (12g)',
    carbs: 1,
    cals: 4,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/cenoura.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/cenoura.png'),
    color: '#FF9800',
  },
  {
    id: 'v4',
    name: 'Repolho cru picado',
    category: 'vegetables',
    portion: '1 col. sopa cheia (10g)',
    carbs: 0,
    cals: 2,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/repolho.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/repolho.png'),
    color: '#C8E6C9',
  },
  {
    id: 'v5',
    name: 'Cebola picada',
    category: 'vegetables',
    portion: '1 col. sopa (10g)',
    carbs: 1,
    cals: 4,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/cebola.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/cebola.png'),
    color: '#E1BEE7',
  },
  {
    id: 'v6',
    name: 'Pepino',
    category: 'vegetables',
    portion: '1 fatia pequena (3g)',
    carbs: 0,
    cals: 1,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/pepino.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/pepino.png'),
    color: '#81C784',
  },
  {
    id: 'v7',
    name: 'Couve',
    category: 'vegetables',
    portion: '1 folha média (20g)',
    carbs: 1,
    cals: 10,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/couve.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/couve.png'),
    color: '#2E7D32',
  },
  {
    id: 'v8',
    name: 'Brócolis cozido',
    category: 'vegetables',
    portion: '1 col. sopa (10g)',
    carbs: 0,
    cals: 4,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/vegetais/brocolis.png'),
    plateSliceImage: require('@/assets/images/prato/vegetais/brocolis.png'),
    color: '#388E3C',
  },
  {
    id: 'f1',
    name: 'Banana prata',
    category: 'fruits',
    portion: '1 unid. média (100g)',
    carbs: 24,
    cals: 185,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/banana.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/banana.png'),
    color: '#FFF59D',
  },
  {
    id: 'f2',
    name: 'Maçã',
    category: 'fruits',
    portion: '1 unid. pequena (90g)',
    carbs: 14,
    cals: 58,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/maca.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/maca.png'),
    color: '#E53935',
  },
  {
    id: 'f3',
    name: 'Uva verde',
    category: 'fruits',
    portion: '10 gomos médios (80g)',
    carbs: 10,
    cals: 50,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/uva.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/uva.png'),
    color: '#8E24AA',
  },
  {
    id: 'f4',
    name: 'Goiaba',
    category: 'fruits',
    portion: '1 unid. média (100g)',
    carbs: 14,
    cals: 50,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/goiaba.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/goiaba.png'),
    color: '#F48FB1',
  },
  {
    id: 'f5',
    name: 'Caju',
    category: 'fruits',
    portion: '1 unid. média (120g)',
    carbs: 12,
    cals: 51.6,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/caju.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/caju.png'),
    color: '#FFCA28',
  },
  {
    id: 'f6',
    name: 'Laranja lima',
    category: 'fruits',
    portion: '1 unid. média (180g)',
    carbs: 20,
    cals: 82,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/frutas/laranja.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/laranja.png'),
    color: '#FF9800',
  },
  {
    id: 'f7',
    name: 'Mamão papaia',
    category: 'fruits',
    portion: '1 fatia média (160g)',
    carbs: 16,
    cals: 68,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/mamao.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/mamao.png'),
    color: '#FF8A65',
  },
  {
    id: 'f8',
    name: 'Melancia',
    category: 'fruits',
    portion: '1 fatia média (200g)',
    carbs: 13,
    cals: 58,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/frutas/melancia.png'),
    plateSliceImage: require('@/assets/images/prato/frutas/melancia.png'),
    color: '#EF5350',
  },
  {
    id: 'b1',
    name: 'Café sem açúcar',
    category: 'drinks',
    portion: '1 xícara (200ml)',
    carbs: 0,
    cals: 16,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/bebidas/cafe.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/cafe.png'),
    color: '#3E2723',
  },
  {
    id: 'b2',
    name: 'Café com açúcar',
    category: 'drinks',
    portion: '1 xícara (200ml)',
    carbs: 20,
    cals: 76,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/bebidas/cafe_acucar.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/cafe_acucar.png'),
    color: '#5D4037',
  },
  {
    id: 'b3',
    name: 'Suco de laranja (S/A)',
    category: 'drinks',
    portion: '1 copo (200ml)',
    carbs: 21,
    cals: 66,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/bebidas/suco_laranja.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/suco_laranja.png'),
    color: '#FF9800',
  },
  {
    id: 'b4',
    name: 'Suco maracujá (C/A)',
    category: 'drinks',
    portion: '1 copo (200ml)',
    carbs: 12,
    cals: 52,
    insulin: 1,
    conveyorImage: require('@/assets/images/prato/bebidas/suco_maracuja.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/suco_maracuja.png'),
    color: '#FFE082',
  },
  {
    id: 'b5',
    name: 'Coca-Cola normal',
    category: 'drinks',
    portion: '1 copo (200ml)',
    carbs: 21,
    cals: 85,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/bebidas/coca.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/coca.png'),
    color: '#D32F2F',
  },
  {
    id: 'b6',
    name: 'Coca-Cola Zero',
    category: 'drinks',
    portion: '1 copo (200ml)',
    carbs: 0,
    cals: 0,
    insulin: 0,
    conveyorImage: require('@/assets/images/prato/bebidas/coca_zero.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/coca_zero.png'),
    color: '#212121',
  },
  {
    id: 'b7',
    name: 'Água-de-coco verde',
    category: 'drinks',
    portion: '1 copo (200ml)',
    carbs: 11,
    cals: 44,
    insulin: 0.5,
    conveyorImage: require('@/assets/images/prato/bebidas/agua_coco.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/agua_coco.png'),
    color: '#AED581',
  },
  {
    id: 'b8',
    name: 'Brigadeiro',
    category: 'drinks',
    portion: '1 unid. pequena (15g)',
    carbs: 9,
    cals: 60,
    insulin: 0.5,
    conveyorImage: require('@/assets/images/prato/bebidas/brigadeiro.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/brigadeiro.png'),
    color: '#4E342E',
    isSolid: true,
  },
  {
    id: 'b9',
    name: 'Lasanha',
    category: 'drinks',
    portion: '1 escumadeira (170g)',
    carbs: 23,
    cals: 224,
    insulin: 2,
    conveyorImage: require('@/assets/images/prato/bebidas/lasanha.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/lasanha.png'),
    color: '#FFCC80',
    isSolid: true,
  },
  {
    id: 'b10',
    name: 'Misto quente',
    category: 'drinks',
    portion: '1 unid. (85g)',
    carbs: 29,
    cals: 212,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/bebidas/misto.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/misto.png'),
    color: '#FFAB91',
    isSolid: true,
  },
  {
    id: 'b11',
    name: 'Pizza de calabresa',
    category: 'drinks',
    portion: '1 fatia média (100g)',
    carbs: 21,
    cals: 240,
    insulin: 2.5,
    conveyorImage: require('@/assets/images/prato/bebidas/pizza.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/pizza.png'),
    color: '#E64A19',
    isSolid: true,
  },
  {
    id: 'b12',
    name: 'Mini hambúrguer (com pão)',
    category: 'drinks',
    portion: '1 unid. (60g)',
    carbs: 15,
    cals: 123,
    insulin: 2,
    conveyorImage: require('@/assets/images/prato/bebidas/hamburger.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/hamburger.png'),
    color: '#A1887F',
    isSolid: true,
  },
  {
    id: 'b13',
    name: 'Chocolate ao leite',
    category: 'drinks',
    portion: '1 barra média (30g)',
    carbs: 19.6,
    cals: 159.6,
    insulin: 1.5,
    conveyorImage: require('@/assets/images/prato/bebidas/chocolate.png'),
    plateSliceImage: require('@/assets/images/prato/bebidas/chocolate.png'),
    color: '#6D4C41',
    isSolid: true,
  },
];

const MENU_BUTTONS = [
  {
    id: 'carbs',
    image: require('@/assets/images/prato/carboidratos/carboidratos.png'),
    label: 'CARBOIDRATOS',
  },
  {
    id: 'proteins',
    image: require('@/assets/images/prato/proteinas/proteinas.png'),
    label: 'PROTEÍNAS',
  },
  {
    id: 'vegetables',
    image: require('@/assets/images/prato/vegetais/vegetais.png'),
    label: 'VEGETAIS',
  },
  { id: 'fruits', image: require('@/assets/images/prato/frutas/frutas.png'), label: 'FRUTAS' },
  {
    id: 'drinks',
    image: require('@/assets/images/prato/bebidas/bebidas.png'),
    label: 'EXTRAS / BEBIDAS',
  },
] as const;

interface DraggableFoodProps {
  item: FoodItem;
  onDropInPlate: (item: FoodItem) => void;
}

function DraggableFood({ item, onDropInPlate }: DraggableFoodProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      isDragging.value = false;
      if (event.translationY < -100) {
        runOnJS(onDropInPlate)(item);
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.2 : 1 },
      ],
      zIndex: isDragging.value ? 999 : 1,
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.stagedFoodBadge, animatedStyle]}>
        <View
          style={[
            styles.stagedFoodIcon,
            {
              backgroundColor: item.conveyorImage ? 'transparent' : item.color,
              borderWidth: item.conveyorImage ? 0 : 2,
              overflow: 'hidden',
            },
          ]}
        >
          {item.conveyorImage ? (
            <Image
              source={item.conveyorImage}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.stagedFoodIconText} numberOfLines={2}>
              {item.name}
            </Text>
          )}
        </View>
        <Text style={styles.stagedFoodLabel}>Arraste até o prato!</Text>
      </Animated.View>
    </GestureDetector>
  );
}

export default function PratoScreen() {
  const pulseAnim = useSharedValue(1);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const insets = useSafeAreaInsets();

  const sideMenuWidth = 70;
  const availableWidth = windowWidth - sideMenuWidth - 40;

  const headerHeight = Math.max(insets.top + 20, 60) + 100;
  const statsPanelHeight = 130;
  const availableHeight =
    windowHeight - headerHeight - statsPanelHeight - Math.max(insets.bottom, 20);

  const availablePlateHeight = availableHeight - 125;

  const PLATE_SIZE = Math.max(140, Math.min(availableWidth, availablePlateHeight, 360));

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2, stiffness: 80 }),
        withSpring(1.0, { damping: 2, stiffness: 80 })
      ),
      -1,
      true
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: pulseAnim.value }] };
  });

  const [phase, setPhase] = useState<Phase>('intro');
  const [plateItems, setPlateItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<FoodCategory | null>(null);
  const [stagedFood, setStagedFood] = useState<FoodItem | null>(null);

  const [showIntroBtn, setShowIntroBtn] = useState(false);

  const bottomSheetY = useSharedValue(1500);

  useEffect(() => {
    if (activeCategory) {
      bottomSheetY.value = withTiming(0, { duration: 300 });
    } else {
      bottomSheetY.value = withTiming(windowHeight, { duration: 300 });
    }
  }, [activeCategory, windowHeight]);

  const animatedSheetStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: bottomSheetY.value }] };
  });

  const [fontsLoaded] = useExpoFonts({ Chewy_400Regular });

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setShowIntroBtn(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (!fontsLoaded) return null;

  const handleSelectFood = (food: FoodItem) => {
    setActiveCategory(null);
    setStagedFood(food);
  };

  const handleDropInPlate = (food: FoodItem) => {
    setPlateItems((prev) => {
      const foodInstance = {
        ...food,
        uniqueId: `${food.id}-${Date.now()}-${Math.random()}`,
      };

      if (food.category === 'drinks' && !food.isSolid) {
        const mesaSemBebidas = prev.filter(
          (item) => !(item.category === 'drinks' && !item.isSolid)
        );
        return [...mesaSemBebidas, foodInstance];
      }
      return [...prev, foodInstance];
    });
    setStagedFood(null);
  };

  const handleRemoveFromPlate = (uniqueId: string) => {
    setPlateItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  const totalCarbs = plateItems.reduce((acc, item) => acc + item.carbs, 0);
  const totalCals = plateItems.reduce((acc, item) => acc + item.cals, 0);

  const visibleFoods = FOOD_DATABASE.filter((food) => food.category === activeCategory);

  const drinksOnTable = plateItems.filter((item) => item.category === 'drinks' && !item.isSolid);
  const foodOnPlate = plateItems.filter((item) => item.category !== 'drinks' || item.isSolid);

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
              <Text style={styles.introTitle}>Alimentação saudável</Text>
              <Image
                source={require('@/assets/images/prato/prato_intro.png')}
                style={styles.introIcon}
                resizeMode="contain"
              />
              <Text style={styles.introText}>
                A alimentação deve ser variada e equilibrada, baseada em alimentos naturais ou
                minimamente processados, e evitar os ultraprocessados.
              </Text>
              {showIntroBtn && (
                <Animated.View entering={FadeIn.duration(800)} style={animatedPulseStyle}>
                  <TouchableOpacity style={styles.introCircleBtn} onPress={() => setPhase('chart')}>
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

  if (phase === 'chart') {
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
              <Text style={styles.introTitle}>O prato ideal é composto por:</Text>
              <Image
                source={require('@/assets/images/prato/prato_cheio.png')}
                style={styles.chartImage}
                resizeMode="contain"
              />
              <Text style={styles.sourceText}>Fonte: Sociedade Brasileira de Diabetes, 2020</Text>
              <Text style={styles.introText}>Vamos lá!</Text>
              <Animated.View style={animatedPulseStyle}>
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

  return (
    <GestureHandlerRootView style={styles.rootGestureView}>
      <ImageBackground
        source={require('@/assets/images/prato/fundo_verde.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.View
          style={[styles.topHomeBtn, { top: Math.max(insets.top + 10, 40) }, animatedPulseStyle]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.homeBtnTouch}>
            <MaterialCommunityIcons name="home" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Text
          style={[
            styles.titleText,
            {
              marginTop: Math.max(insets.top + 20, 60),
            },
          ]}
        >
          Monte seu prato
        </Text>

        <Text style={styles.subtitle}>O que você vai comer agora?</Text>

        <View style={styles.mainGameArea}>
          <View style={styles.sideMenu}>
            {MENU_BUTTONS.map((btn) => (
              <TouchableOpacity
                key={btn.id}
                onPress={() =>
                  setActiveCategory(activeCategory === btn.id ? null : (btn.id as FoodCategory))
                }
                style={[styles.menuBtn, activeCategory === btn.id && styles.menuBtnActive]}
              >
                <Image source={btn.image} style={styles.menuCustomIcon} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tableArea}>
            <View style={styles.drinkArea}>
              {drinksOnTable.length === 0 && (
                <View style={styles.placeholderContainer} pointerEvents="none">
                  <Text style={styles.dragHintTextDrinks}>Bebida</Text>
                </View>
              )}
              {drinksOnTable.map((item, index) => (
                <Animated.View
                  key={`drink-${item.uniqueId}`}
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={[styles.absoluteItem, { zIndex: index }]}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleRemoveFromPlate(item.uniqueId!)}
                    style={styles.foodItemTouch}
                  >
                    {item.plateSliceImage ? (
                      <Image
                        source={item.plateSliceImage}
                        style={styles.drinkImageProportional}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={[styles.fallbackFoodView, { backgroundColor: item.color }]}>
                        <Text style={styles.fallbackFoodText}>{item.name}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>

            <View style={styles.plateArea}>
              <ImageBackground
                source={require('@/assets/images/prato/prato_vazio.png')}
                style={[styles.plateImage, { width: PLATE_SIZE, height: PLATE_SIZE }]}
                resizeMode="contain"
              >
                {foodOnPlate.length === 0 && (
                  <View style={styles.placeholderContainer} pointerEvents="none">
                    <Text style={styles.dragHintText}>Pegue o alimento{'\n'}e solte aqui</Text>
                  </View>
                )}

                <View style={styles.plateInsideContainer}>
                  {foodOnPlate.map((item, index) => (
                    <Animated.View
                      key={`food-${item.uniqueId}`}
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={[styles.foodItemWrapper, { zIndex: index }]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleRemoveFromPlate(item.uniqueId!)}
                        style={styles.foodItemTouch}
                      >
                        {item.plateSliceImage ? (
                          <Image
                            source={item.plateSliceImage}
                            style={styles.foodImageProportional}
                            resizeMode="contain"
                          />
                        ) : (
                          <View style={[styles.fallbackFoodView, { backgroundColor: item.color }]}>
                            <Text style={styles.fallbackFoodText}>{item.name}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </ImageBackground>
            </View>
          </View>
        </View>

        <View style={styles.statsPanel}>
          <View style={styles.statBox}>
            <Text style={styles.statText}>Carboidratos: {totalCarbs}g</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>Calorias: {totalCals} kcal</Text>
          </View>
        </View>

        {stagedFood && !activeCategory && (
          <View style={styles.stagingArea}>
            <DraggableFood item={stagedFood} onDropInPlate={handleDropInPlate} />
          </View>
        )}

        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>
              {MENU_BUTTONS.find((b) => b.id === activeCategory)?.label}
            </Text>
            <TouchableOpacity onPress={() => setActiveCategory(null)} style={styles.closeSheetBtn}>
              <MaterialCommunityIcons name="close" size={24} color="#6D4C41" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={visibleFoods}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.sheetListItem}
                onPress={() => handleSelectFood(item)}
              >
                <View
                  style={[
                    styles.sheetListItemIcon,
                    {
                      backgroundColor: item.conveyorImage ? 'transparent' : item.color,
                      overflow: 'hidden',
                    },
                  ]}
                >
                  {item.conveyorImage ? (
                    <Image
                      source={item.conveyorImage}
                      style={styles.sheetItemImageFill}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.fallbackIconText} numberOfLines={2}>
                      {item.name}
                    </Text>
                  )}
                </View>

                <View style={styles.sheetListItemTextContainer}>
                  <Text style={styles.sheetListItemName}>{item.name}</Text>
                  <Text style={styles.sheetListItemPortion}>{item.portion}</Text>
                </View>
                <View style={styles.sheetListItemCarbsBadge}>
                  <Text style={styles.sheetListItemCarbs}>{item.carbs}g Carb.</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#80A060',
  },
  topHomeBtn: {
    position: 'absolute',
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#5D4037',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  titleText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontWeight: '100',
    fontFamily: 'Chewy_400Regular',
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  mainGameArea: {
    flexDirection: 'row',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  sideMenu: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    zIndex: 10,
  },
  menuBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#8B9C73',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A3C27C',
    elevation: 4,
  },
  menuBtnActive: { backgroundColor: '#5D4037', borderColor: '#FFF', transform: [{ scale: 1.1 }] },
  menuCustomIcon: {
    width: 60,
    height: 60,
  },
  tableArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drinkArea: {
    width: 105,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderStyle: 'dashed',
    borderRadius: 52.5,
    position: 'relative',
  },
  plateArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateImage: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  dragHintText: {
    color: '#b3a5998a',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dragHintTextDrinks: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  plateInsideContainer: {
    width: '68%',
    height: '68%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  foodItemWrapper: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
  },
  foodItemTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImageProportional: {
    width: '100%',
    height: '100%',
  },
  drinkImageProportional: {
    width: '80%',
    height: '80%',
  },
  absoluteItem: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackFoodView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackFoodText: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  statsPanel: { paddingHorizontal: 20, paddingBottom: 20, gap: 8, zIndex: 5, width: '100%' },
  statBox: { backgroundColor: '#628641', padding: 12, borderRadius: 10, elevation: 3 },
  statText: { fontSize: 16, color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  stagingArea: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    zIndex: 90,
  },
  stagedFoodBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#A3C27C',
    alignItems: 'center',
    elevation: 8,
  },
  stagedFoodIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  stagedFoodIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  stagedFoodLabel: {
    color: '#6D4C41',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 15,
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6D4C41',
  },
  closeSheetBtn: {
    padding: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  sheetListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  sheetListItemIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    overflow: 'hidden',
  },
  sheetListItemTextContainer: {
    flex: 1,
  },
  sheetListItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  sheetListItemPortion: {
    fontSize: 13,
    color: '#777',
  },
  sheetListItemCarbsBadge: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  sheetListItemCarbs: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  chartImage: { width: 250, height: 250, marginBottom: 10 },
  sourceText: {
    fontSize: 13,
    color: '#7F6055',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 20,
  },
  playBtn: {
    backgroundColor: '#80A060',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
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
    backgroundColor: '#6D4C41',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 99,
  },
  introIcon: { width: 200, height: 200, marginVertical: 20 },
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
  rootGestureView: {
    flex: 1,
    backgroundColor: '#80A060',
    overflow: 'hidden',
  },
  sheetItemImageFill: {
    width: '100%',
    height: '100%',
  },
  fallbackIconText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  homeBtnTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
