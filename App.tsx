import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RecoilRoot } from 'recoil';

import { RootStackNavigation } from 'navigation';

const App = () => {
    return (
        <RecoilRoot>
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <NavigationContainer>
                        <RootStackNavigation />
                    </NavigationContainer>
                </SafeAreaView>
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
