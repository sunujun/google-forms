import { useRef } from 'react';
import { Animated, Easing, GestureResponderEvent, Pressable, PressableProps, View } from 'react-native';

const Button = (
    props: PressableProps & React.RefAttributes<View> & { paddingHorizontal?: number; paddingVertical?: number },
) => {
    const scaleAnimation = useRef(new Animated.Value(1)).current;

    const pressInAnimation = () => {
        Animated.timing(scaleAnimation, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.out(Easing.linear),
        }).start();
    };
    const pressOutAnimation = () => {
        Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
            easing: Easing.out(Easing.linear),
        }).start();
    };

    const onPressIn = (event: GestureResponderEvent) => {
        pressInAnimation();
        if (typeof props.onPressIn === 'function') {
            props.onPressIn(event);
        }
    };
    const onPressOut = (event: GestureResponderEvent) => {
        pressOutAnimation();
        if (typeof props.onPressOut === 'function') {
            props.onPressOut(event);
        }
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
            <Pressable
                {...props}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={props.onPress}
                hitSlop={props.hitSlop ?? { left: 0, right: 0, top: 0, bottom: 0 }}
                style={{
                    paddingHorizontal: props.paddingHorizontal,
                    paddingVertical: props.paddingVertical,
                }}>
                {props.children}
            </Pressable>
        </Animated.View>
    );
};

export default Button;
