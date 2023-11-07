import { StyleSheet, View } from 'react-native';

import { TitleBox } from 'components';

const MakeFormScreen = () => {
    return (
        <View style={styles.container}>
            <TitleBox />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0EBF8',
        flex: 1,
        paddingHorizontal: 12,
    },
});

export default MakeFormScreen;
