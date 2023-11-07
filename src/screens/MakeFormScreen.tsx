import { StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, TitleBox } from 'components';

const MakeFormScreen = () => {
    const safeAreaInset = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <TitleBox />
            <View style={[styles.floatingButtonContainer, { bottom: safeAreaInset.bottom + 24 }]}>
                <Button>
                    <View style={styles.floatingButton}>
                        <Icon name="plus" color="white" size={30} />
                    </View>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0EBF8',
        flex: 1,
        paddingHorizontal: 12,
    },
    floatingButtonContainer: {
        position: 'absolute',
        right: 12,
    },
    floatingButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#673AB7',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default MakeFormScreen;
