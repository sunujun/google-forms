import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';

import { RootStackNavigation } from 'navigation';

const App = () => {
    return (
        <RecoilRoot>
            <SafeAreaProvider>
                <ActionSheetProvider>
                    <NavigationContainer>
                        <RootStackNavigation />
                    </NavigationContainer>
                </ActionSheetProvider>
            </SafeAreaProvider>
        </RecoilRoot>
    );
};

export default App;
