import { useRef } from 'react';
import { Animated, Easing, StyleSheet, TextInput, View } from 'react-native';

interface SingleLineInputProps {
    inputRef?: React.LegacyRef<TextInput>;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

const SingleLineInput = ({ inputRef, placeholder, value, onChangeText }: SingleLineInputProps) => {
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
        <View style={styles.container}>
            <TextInput
                ref={inputRef}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#DADCE0"
                style={styles.option}
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
    container: {
        flex: 1,
        marginLeft: 8,
        marginRight: 24,
    },
    option: {
        flex: 1,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
    },
    focusedBottom: {
        position: 'absolute',
        bottom: -1,
        height: 2,
        width: '100%',
        backgroundColor: '#673AB7',
    },
});

export default SingleLineInput;
