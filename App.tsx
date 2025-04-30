import { StatusBar } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FormProvider } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { RootStackNavigation } from 'navigation';

const App = () => {
    const { isDarkMode, colors } = useTheme();

    const navigationTheme = {
        ...(isDarkMode ? DarkTheme : DefaultTheme),
        colors: {
            ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
            primary: colors.primary,
            background: colors.background,
            card: colors.cardBackground,
            text: colors.textPrimary,
            border: colors.border,
        },
    };

    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <FormProvider>
                    <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                        backgroundColor={colors.background}
                    />
                    <NavigationContainer theme={navigationTheme}>
                        <RootStackNavigation />
                    </NavigationContainer>
                </FormProvider>
            </ActionSheetProvider>
        </SafeAreaProvider>
    );
};

export default App;
