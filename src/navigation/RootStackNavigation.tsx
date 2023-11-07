import { createStackNavigator } from '@react-navigation/stack';

import { MakeFormScreen, PreviewFormScreen } from 'screens';

const Stack = createStackNavigator();

const RootStackNavigation = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="MakeForm" component={MakeFormScreen} />
            <Stack.Screen name="PreviewForm" component={PreviewFormScreen} />
        </Stack.Navigator>
    );
};

export default RootStackNavigation;
