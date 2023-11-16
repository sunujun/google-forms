import { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { OpacityDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { useRecoilState, useRecoilValue } from 'recoil';

import { Button, QuestionBox, TitleBox } from 'components';
import KeyboardAwareDraggableFlatList from 'components/KeyboardAwareDraggableFlatList';
import { ANSWER_TYPE, AnswerID, CHOICE_ITEM_TYPE } from 'constant';
import { flatListState, formState, IQuestion } from 'states';

const MakeFormScreen = () => {
    const safeAreaInset = useSafeAreaInsets();
    const { showActionSheetWithOptions } = useActionSheet();
    const [form, setForm] = useRecoilState(formState);
    const flatList = useRecoilValue(flatListState);

    const scrollOffsetY = useRef(0);

    const [resetOffsetY, setResetOffsetY] = useState<number | null>(null);

    const addQuestion = (type: AnswerID) => {
        const newID = 'QUESTION-' + uuid.v4();
        const newQuestion: IQuestion = {
            id: newID,
            type,
            question: '',
            isRequired: false,
            optionList:
                type === ANSWER_TYPE.Short || type === ANSWER_TYPE.Long
                    ? []
                    : [
                          {
                              id: 'OPTION-' + uuid.v4(),
                              type: CHOICE_ITEM_TYPE.Label,
                              label: '옵션 1',
                          },
                      ],
            writeAnswer: '',
            choiceAnswer: '',
            checkAnswer: [],
            checkIsRequired: false,
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
                        addQuestion(ANSWER_TYPE.Multiple);
                        break;
                    case 4:
                        addQuestion(ANSWER_TYPE.CheckBox);
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
                <QuestionBox item={item} onLongPress={drag} />
            </OpacityDecorator>
        );
    };

    const onDragEnd = ({ data }: { data: IQuestion[] }) => {
        setForm({ ...form, questionList: data });
    };

    useEffect(() => {
        const updateOffset = () => {
            if (resetOffsetY === null) {
                setResetOffsetY(scrollOffsetY.current);
            }
        };

        const resetOffset = () => {
            if (resetOffsetY !== null) {
                flatListRef.current?.scrollToPosition(0, resetOffsetY, true);
                setResetOffsetY(null);
            } else {
                flatListRef.current?.scrollToPosition(0, 0, true);
            }
        };
        if (Platform.OS === 'ios') {
            const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
                updateOffset();
            });
            const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
                resetOffset();
            });

            return () => {
                showSubscription.remove();
                hideSubscription.remove();
            };
        } else if (Platform.OS === 'android') {
            const showSubscription = Keyboard.addListener('keyboardDidShow', event => {
                updateOffset();
                const keyboardPosition = event.endCoordinates.screenY;
                const textInputBottomPosition = flatList.textInputHeight + flatList.textInputPositionY;

                if (textInputBottomPosition > keyboardPosition) {
                    flatListRef.current?.scrollToPosition(0, scrollOffsetY.current + 200, true);
                } else if (textInputBottomPosition > keyboardPosition - 200) {
                    flatListRef.current?.scrollToPosition(
                        0,
                        scrollOffsetY.current + 200 - (keyboardPosition - textInputBottomPosition),
                        true,
                    );
                }
            });
            const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
                resetOffset();
            });

            return () => {
                showSubscription.remove();
                hideSubscription.remove();
            };
        }
    }, [flatList.textInputHeight, flatList.textInputPositionY, resetOffsetY]);

    const flatListRef = useRef<KeyboardAwareFlatList>(null);
    return (
        <View style={styles.container}>
            <KeyboardAwareDraggableFlatList
                ref={flatListRef}
                containerStyle={styles.flatListContainer}
                contentContainerStyle={{ paddingBottom: safeAreaInset.bottom }}
                data={form.questionList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item: IQuestion) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
                onDragEnd={onDragEnd}
                onScrollOffsetChange={(scrollOffset: number) => {
                    scrollOffsetY.current = scrollOffset;
                }}
                removeClippedSubviews={false}
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
        shadowColor: '#000000',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 0.4,
    },
    flatListContainer: {
        flex: 1,
    },
});

export default MakeFormScreen;
