import { StyleSheet, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANSWER_TYPE, Button, QuestionBox, TitleBox } from 'components';

const MakeFormScreen = () => {
    const safeAreaInset = useSafeAreaInsets();
    const { showActionSheetWithOptions } = useActionSheet();

    const onPressFloatingButton = () => {
        const options = ['취소', '단답형', '장문형', '객관식 질문', '체크박스'];
        const cancelButtonIndex = 0;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (selectedIndex?: number) => {
                switch (selectedIndex) {
                    case cancelButtonIndex:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    default:
                        break;
                }
            },
        );
    };

    return (
        <View style={styles.container}>
            <TitleBox />
            <QuestionBox type={ANSWER_TYPE.Long} />
            <View style={[styles.floatingButtonContainer, { bottom: safeAreaInset.bottom + 24 }]}>
                <Button onPress={onPressFloatingButton}>
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
