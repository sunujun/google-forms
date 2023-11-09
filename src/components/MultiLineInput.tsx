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

interface MultiLineInputProps {
    inputRef?: React.LegacyRef<TextInput>;
    type: InputID;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const MultiLineInput = ({ inputRef, type, placeholder, value, onChangeText, onFocus, onBlur }: MultiLineInputProps) => {
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
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#DADCE0"
                multiline={true}
                style={
                    type === INPUT_TYPE.Title
                        ? styles.title
                        : type === INPUT_TYPE.Description
                        ? styles.description
                        : styles.question
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <Animated.View
                style={[styles.focusedBottom, { opacity: opacityAnimation, transform: [{ scaleX: scaleXAnimation }] }]}
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
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        fontWeight: '400',
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
        marginTop: 8,
    },
    question: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
        backgroundColor: '#F8F9FA',
    },
    focusedBottom: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '100%',
        backgroundColor: '#673AB7',
    },
});

export default MultiLineInput;
