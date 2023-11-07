import { useRef } from 'react';
import { Animated, Easing, StyleSheet, TextInput, View } from 'react-native';

export const INPUT_TYPE = {
    Title: 'title',
    Description: 'Description',
} as const;
type InputID = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

interface MultiLineInputProps {
    type: InputID;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const MultiLineInput = ({ type, placeholder, value, onChangeText }: MultiLineInputProps) => {
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

    return (
        <View>
            <TextInput
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#DADCE0"
                multiline={true}
                style={type === INPUT_TYPE.Title ? styles.title : styles.description}
                onFocus={() => {
                    focusAnimation();
                }}
                onBlur={() => {
                    blurAnimation();
                }}
            />
            <Animated.View
                style={[styles.focusedBottom, { opacity: opacityAnimation, transform: [{ scaleX: scaleXAnimation }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        letterSpacing: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
        marginTop: 8,
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
