import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ColorSchemeProvider } from 'contexts/ColorSchemeContext';
import { FormProvider } from 'contexts/FormContext';
import { ThemeProvider, useTheme } from 'contexts/ThemeContext';
import { RootStackNavigation } from 'navigation';

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ActionSheetProvider>
                    <ColorSchemeProvider>
                        <ThemeProvider>
                            <FormProvider>
                                <Main />
                            </FormProvider>
                        </ThemeProvider>
                    </ColorSchemeProvider>
                </ActionSheetProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

const Main = () => {
    const { isDarkMode } = useTheme();

    return (
        <>
            <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
                <RootStackNavigation />
            </NavigationContainer>
        </>
    );
};

export default App;
