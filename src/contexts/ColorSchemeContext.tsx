import type { ReactNode, RefObject } from 'react';
import { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import { Appearance, Dimensions, StyleSheet, View } from 'react-native';
import { Canvas, Circle, dist, Image, ImageShader, makeImageFromView, mix, vec } from '@shopify/react-native-skia';
import { Easing, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import type { SkImage } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export type ColorSchemeName = 'light' | 'dark';

interface ColorScheme {
    active: boolean;
    statusBarStyle: ColorSchemeName;
    colorScheme: ColorSchemeName;
    overlay1: SkImage | null;
    overlay2: SkImage | null;
}

interface ColorSchemeContext extends ColorScheme {
    ref: RefObject<View>;
    transition: SharedValue<number>;
    circle: SharedValue<{ x: number; y: number; r: number }>;
    dispatch: (scheme: ColorScheme) => void;
}

const { width, height } = Dimensions.get('window');
const corners = [vec(0, 0), vec(width, 0), vec(width, height), vec(0, height)];

const getDefaultValue = (): ColorScheme => {
    const systemColorScheme = Appearance.getColorScheme() ?? 'light';
    return {
        active: false,
        statusBarStyle: systemColorScheme === 'dark' ? 'light' : 'dark',
        colorScheme: systemColorScheme,
        overlay1: null,
        overlay2: null,
    };
};

const ColorSchemeContext = createContext<ColorSchemeContext | null>(null);

const colorSchemeReducer = (_: ColorScheme, colorScheme: ColorScheme): ColorScheme => {
    return colorScheme;
};

export const useColorScheme = () => {
    const ctx = useContext(ColorSchemeContext);
    if (ctx === null) {
        throw new Error('ColorScheme 컨텍스트를 찾을 수 없습니다');
    }

    const { colorScheme, dispatch, ref, transition, circle, active } = ctx;

    const toggle = useCallback(
        async (x: number, y: number) => {
            if (active) {
                console.log('이미 테마 전환 중입니다');
                return;
            }

            const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
            const newStatusBarStyle = newColorScheme === 'light' ? 'dark' : 'light';

            dispatch({
                active: true,
                colorScheme,
                overlay1: null,
                overlay2: null,
                statusBarStyle: newStatusBarStyle,
            });

            try {
                const r = Math.max(...corners.map(corner => dist(corner, { x, y }))) * 1.1;
                circle.value = { x, y, r };

                await wait(30);
                const overlay1 = await makeImageFromView(ref);
                if (!overlay1) throw new Error('첫 번째 스크린샷 생성 실패');

                dispatch({
                    active: true,
                    colorScheme,
                    overlay1,
                    overlay2: null,
                    statusBarStyle: newStatusBarStyle,
                });

                await wait(60);
                dispatch({
                    active: true,
                    colorScheme: newColorScheme,
                    overlay1,
                    overlay2: null,
                    statusBarStyle: newStatusBarStyle,
                });

                await wait(60);
                const overlay2 = await makeImageFromView(ref);
                if (!overlay2) throw new Error('두 번째 스크린샷 생성 실패');

                dispatch({
                    active: true,
                    colorScheme: newColorScheme,
                    overlay1,
                    overlay2,
                    statusBarStyle: newStatusBarStyle,
                });

                await wait(30);
                transition.value = 0;
                transition.value = withTiming(1, {
                    duration: 650,
                    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                });

                await wait(700);
                overlay1.dispose();
                overlay2.dispose();
                transition.value = 0;
                dispatch({
                    active: false,
                    colorScheme: newColorScheme,
                    overlay1: null,
                    overlay2: null,
                    statusBarStyle: newStatusBarStyle,
                });
            } catch (error) {
                console.error('테마 전환 중 오류 발생:', error);
                dispatch({
                    active: false,
                    colorScheme: newColorScheme,
                    overlay1: null,
                    overlay2: null,
                    statusBarStyle: newStatusBarStyle,
                });
            }
        },
        [circle, colorScheme, dispatch, ref, transition, active],
    );

    return { colorScheme, toggle, active };
};

interface ColorSchemeProviderProps {
    children: ReactNode;
}

export const ColorSchemeProvider = ({ children }: ColorSchemeProviderProps) => {
    const circle = useSharedValue({ x: 0, y: 0, r: 0 });
    const transition = useSharedValue(0);
    const ref = useRef(null);
    const [{ colorScheme, overlay1, overlay2, active, statusBarStyle }, dispatch] = useReducer(
        colorSchemeReducer,
        getDefaultValue(),
    );

    const r = useDerivedValue(() => {
        const easedProgress = 0.5 - 0.5 * Math.cos(transition.value * Math.PI);
        return mix(easedProgress, 0, circle.value.r);
    });

    const contextValue = useMemo(
        () => ({
            active,
            colorScheme,
            overlay1,
            overlay2,
            dispatch,
            ref,
            transition,
            circle,
            statusBarStyle,
        }),
        [active, colorScheme, overlay1, overlay2, statusBarStyle, transition, circle],
    );

    return (
        <View style={styles.container}>
            <View ref={ref} style={styles.container} collapsable={false}>
                <ColorSchemeContext.Provider value={contextValue}>{children}</ColorSchemeContext.Provider>
            </View>

            {active && (
                <Canvas style={styles.canvas}>
                    {overlay1 && <Image image={overlay1} x={0} y={0} width={width} height={height} />}
                    <Circle c={circle} r={r}>
                        <ImageShader image={overlay2} x={0} y={0} width={width} height={height} fit="cover" />
                    </Circle>
                </Canvas>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    canvas: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
    },
});
