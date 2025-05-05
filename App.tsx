import { StatusBar } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ColorSchemeProvider } from 'contexts/ColorSchemeContext';
import { FormProvider } from 'contexts/FormContext';
import { ThemeProvider, useTheme } from 'contexts/ThemeContext';
import { RootStackNavigation } from 'navigation';

const App = () => {
    const { isDarkMode } = useTheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ActionSheetProvider>
                    <ColorSchemeProvider>
                        <ThemeProvider>
                            <FormProvider>
                                <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
                                <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
                                    <RootStackNavigation />
                                </NavigationContainer>
                            </FormProvider>
                        </ThemeProvider>
                    </ColorSchemeProvider>
                </ActionSheetProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;
