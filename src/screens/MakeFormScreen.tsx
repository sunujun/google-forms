import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import DraggableFlatList, { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useRecoilState } from 'recoil';

import { ANSWER_TYPE, AnswerID, Button, QuestionBox, TitleBox } from 'components';
import { formState, IQuestion } from 'states';

const MakeFormScreen = () => {
    const safeAreaInset = useSafeAreaInsets();
    const { showActionSheetWithOptions } = useActionSheet();
    const [form, setForm] = useRecoilState(formState);

    const addQuestion = (type: AnswerID) => {
        const newID = 'QUESTION-' + uuid.v4();
        const newQuestion: IQuestion = {
            id: newID,
            type,
            question: '',
            isRequired: false,
        };
        const updatedQuestionList = [...form.questionList, newQuestion];

        setForm({ ...form, questionList: updatedQuestionList, selectedID: newID });
    };

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
                        addQuestion(ANSWER_TYPE.Short);
                        break;
                    case 2:
                        addQuestion(ANSWER_TYPE.Long);
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

    const ListHeaderComponent = useCallback(() => {
        return <TitleBox />;
    }, []);

    const renderItem = ({ item, drag }: RenderItemParams<IQuestion>) => {
        return (
            <OpacityDecorator>
                <QuestionBox id={item.id} type={item.type} onLongPress={drag} />
            </OpacityDecorator>
        );
    };

    const onDragEnd = ({ data }: { data: IQuestion[] }) => {
        setForm({ ...form, questionList: data });
    };

    return (
        <View style={styles.container}>
            <DraggableFlatList
                data={form.questionList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
                onDragEnd={onDragEnd}
            />
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
