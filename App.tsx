import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FormProvider } from 'contexts/FormContext';
import { RootStackNavigation } from 'navigation';

const App = () => {
    return (
        <SafeAreaProvider>
            <ActionSheetProvider>
                <FormProvider>
                    <NavigationContainer>
                        <RootStackNavigation />
                    </NavigationContainer>
                </FormProvider>
            </ActionSheetProvider>
        </SafeAreaProvider>
    );
};

export default App;
