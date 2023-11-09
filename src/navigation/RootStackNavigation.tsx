import { Pressable, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { MakeFormScreen, PreviewFormScreen } from 'screens';

const Stack = createStackNavigator();

const RootStackNavigation = () => {
    const navigation = useNavigation();

    const makeFormScreenHeaderRight = () => {
        return (
            <Pressable onPress={() => navigation.navigate('PreviewForm')} style={styles.headerRight}>
                <Icon name="eye-outline" size={28} color="black" />
            </Pressable>
        );
    };

    const previewFormScreenHeaderLeft = () => {
        return (
            <Pressable onPress={() => navigation.goBack()} style={styles.headerLeft}>
                <Icon name="keyboard-backspace" size={28} color="black" />
            </Pressable>
        );
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MakeForm"
                component={MakeFormScreen}
                options={{
                    headerTitle: '폼 생성',
                    headerTitleStyle: {
                        fontSize: 16,
                        lineHeight: 24,
                    },
                    headerRight: makeFormScreenHeaderRight,
                    headerRightContainerStyle: {
                        marginRight: 16,
                    },
                }}
            />
            <Stack.Screen
                name="PreviewForm"
                component={PreviewFormScreen}
                options={{
                    headerTitle: '미리보기',
                    headerTitleStyle: {
                        fontSize: 16,
                        lineHeight: 24,
                    },
                    headerLeft: previewFormScreenHeaderLeft,
                }}
            />
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    headerRight: {
        marginRight: 16,
    },
    headerLeft: {
        marginLeft: 16,
    },
});

export default RootStackNavigation;
