import { useRef } from 'react';
import {
    Animated,
    Easing,
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputFocusEventData,
    View,
} from 'react-native';

import { INPUT_TYPE, InputID } from 'constant';
import { useTheme } from 'contexts/ThemeContext';

interface MultiLineInputProps {
    inputRef?: React.LegacyRef<TextInput>;
    type: InputID;
    placeholder?: string;
    value?: string;
    isError?: boolean;
    onChangeText?: (text: string) => void;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const MultiLineInput = ({
    inputRef,
    type,
    placeholder,
    value,
    isError,
    onChangeText,
    onFocus,
    onBlur,
}: MultiLineInputProps) => {
    const scaleXAnimation = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(1)).current;

    const { colors } = useTheme();

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
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textDisabled}
                multiline={true}
                style={
                    type === INPUT_TYPE.Title
                        ? [styles.title, { color: colors.textPrimary, borderBottomColor: colors.border }]
                        : type === INPUT_TYPE.Description
                          ? [styles.description, { color: colors.textPrimary, borderBottomColor: colors.border }]
                          : type === INPUT_TYPE.Question
                            ? [
                                  styles.question,
                                  {
                                      color: colors.textPrimary,
                                      borderBottomColor: colors.border,
                                      backgroundColor: colors.inputBackground,
                                  },
                              ]
                            : isError
                              ? [styles.errorAnswer, { color: colors.textPrimary, borderBottomColor: colors.error }]
                              : [styles.answer, { color: colors.textPrimary, borderBottomColor: colors.border }]
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <Animated.View
                style={[
                    isError
                        ? [styles.errorBottom, { backgroundColor: colors.error }]
                        : [styles.focusedBottom, { backgroundColor: colors.inputFocused }],
                    { opacity: opacityAnimation, transform: [{ scaleX: scaleXAnimation }] },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        letterSpacing: 0,
        fontWeight: '400',
        borderBottomWidth: 1,
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        fontWeight: '400',
        borderBottomWidth: 1,
        marginTop: 8,
    },
    question: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        borderBottomWidth: 1,
    },
    answer: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        borderBottomWidth: 1,
    },
    errorAnswer: {
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

export default MultiLineInput;
