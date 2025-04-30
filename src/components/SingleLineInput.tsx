import { useRef } from 'react';
import {
    Animated,
    Easing,
    NativeSyntheticEvent,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputFocusEventData,
    View,
    ViewStyle,
} from 'react-native';

import { useTheme } from 'contexts/ThemeContext';

interface SingleLineInputProps {
    inputRef?: React.LegacyRef<TextInput>;
    style?: StyleProp<ViewStyle>;
    placeholder?: string;
    value?: string;
    isError?: boolean;
    onChangeText?: (text: string) => void;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const SingleLineInput = ({
    inputRef,
    style,
    placeholder,
    value,
    isError,
    onChangeText,
    onFocus,
    onBlur,
}: SingleLineInputProps) => {
    const { colors } = useTheme();
    const scaleXAnimation = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(1)).current;

    const focusAnimation = () => {
        opacityAnimation.setValue(1);
        Animated.timing(scaleXAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp),
        }).start();
    };

    const blurAnimation = () => {
        Animated.timing(opacityAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(({ finished }) => {
            if (finished) {
                scaleXAnimation.setValue(0);
            }
        });
    };

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        focusAnimation();
        if (typeof onFocus === 'function') {
            onFocus(event);
        }
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        blurAnimation();
        if (typeof onBlur === 'function') {
            onBlur(event);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                ref={inputRef}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
                style={
                    isError
                        ? [styles.errorOption, { color: colors.textPrimary, borderBottomColor: colors.error }]
                        : [styles.option, { color: colors.textPrimary, borderBottomColor: colors.border }]
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <Animated.View
                style={[
                    isError
                        ? [styles.errorBottom, { backgroundColor: colors.error }]
                        : [styles.focusedBottom, { backgroundColor: colors.primary }],
                    { opacity: opacityAnimation, transform: [{ scaleX: scaleXAnimation }] },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    option: {
        flex: 1,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        borderBottomWidth: 1,
    },
    errorOption: {
        flex: 1,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        borderBottomWidth: 1,
    },
    focusedBottom: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '100%',
    },
    errorBottom: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '100%',
    },
});

export default SingleLineInput;
