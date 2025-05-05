import React from 'react';
import { View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { useColorScheme } from 'contexts/ColorSchemeContext';
import { useTheme } from 'contexts/ThemeContext';

export const ColorSchemeButton = () => {
    const { colors } = useTheme();
    const { toggle, colorScheme, active } = useColorScheme();
    const tap = Gesture.Tap()
        .runOnJS(true)
        .onStart(e => {
            if (!active) {
                toggle(e.absoluteX, e.absoluteY);
            }
        });

    return (
        <GestureDetector gesture={tap}>
            <View collapsable={false}>
                <Feather name={colorScheme === 'light' ? 'moon' : 'sun'} color={colors.primary} size={32} />
            </View>
        </GestureDetector>
    );
};
