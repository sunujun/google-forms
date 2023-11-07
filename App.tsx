import { StyleSheet } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';

import { RootStackNavigation } from 'navigation';

const App = () => {
    return (
        <RecoilRoot>
            <SafeAreaProvider>
                <ActionSheetProvider>
                    <SafeAreaView style={styles.container}>
                        <NavigationContainer>
                            <RootStackNavigation />
                        </NavigationContainer>
                    </SafeAreaView>
                </ActionSheetProvider>
            </SafeAreaProvider>
        </RecoilRoot>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
