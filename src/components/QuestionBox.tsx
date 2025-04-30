import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useReorderableDrag } from 'react-native-reorderable-list';
import uuid from 'react-native-uuid';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE, INPUT_TYPE } from 'constant';
import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { IQuestion } from 'types/form';

import MultiLineInput from './MultiLineInput';
import MultipleChoiceItem from './MultipleChoiceItem';

interface QuestionBoxProps {
    item: IQuestion;
    updateFlatList?: (posY: number, height: number) => void;
}

const QuestionBox = ({ item, updateFlatList }: QuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const { formState, dispatch } = useFormContext();
    const { colors } = useTheme();

    const questionInputRef = useRef<TextInput>(null);

    const isSelected = formState.selectedID === item.id;
    const questionList = formState.questionList;
    const currentIndex = questionList.findIndex(questionItem => questionItem.id === item.id);

    const updateQuestion = (question: string) => {
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: item.id,
                question: { question },
            },
        });
    };

    const updateIsRequired = (isRequired: boolean) => {
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: item.id,
                question: { isRequired },
            },
        });
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: undefined });
    };

    const deleteQuestion = () => {
        const willSelectID = currentIndex === 0 ? formState.id : questionList[currentIndex - 1].id;
        const updatedQuestionList = questionList.filter(questionItem => questionItem.id !== item.id);

        dispatch({
            type: 'UPDATE_FORM',
            payload: {
                questionList: updatedQuestionList,
                selectedID: willSelectID,
                focusInputID: undefined,
            },
        });
    };

    const copyQuestion = () => {
        const newID = 'QUESTION-' + uuid.v4();
        const copiedQuestion: IQuestion = { ...item, id: newID };
        const updatedQuestionList = [
            ...questionList.slice(0, currentIndex + 1),
            copiedQuestion,
            ...questionList.slice(currentIndex + 1),
        ];

        dispatch({
            type: 'UPDATE_FORM',
            payload: {
                questionList: updatedQuestionList,
                selectedID: newID,
            },
        });
    };

    const onFocus = () => {
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: item.id });

        if (questionInputRef.current && updateFlatList) {
            questionInputRef.current.measureInWindow((_x, y, _width, height) => {
                updateFlatList(y, height);
            });
        }
    };

    const drag = useReorderableDrag();

    useEffect(() => {
        if (isSelected) {
            dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: item.id });
        }
    }, [isSelected, item.id, dispatch]);

    useEffect(() => {
        if (item.id === formState.focusInputID) {
            questionInputRef.current?.focus();
        } else {
            questionInputRef.current?.blur();
        }
    }, [formState.focusInputID, item.id]);

    return (
        <Pressable
            style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={() => {
                dispatch({ type: 'UPDATE_SELECTED_ID', payload: item.id });
            }}
            onLongPress={drag}>
            {isSelected && <View style={[styles.selectedMark, { backgroundColor: colors.selectedMark }]} />}
            <View style={styles.padding}>
                {isSelected ? (
                    <MultiLineInput
                        inputRef={questionInputRef}
                        type={INPUT_TYPE.Question}
                        placeholder="질문"
                        value={item.question}
                        onChangeText={updateQuestion}
                        onFocus={onFocus}
                    />
                ) : (
                    <View style={styles.questionTextContainer}>
                        <Text
                            style={[
                                styles.questionText,
                                { maxWidth: width - 24 - 48 - 24, color: colors.textPrimary },
                            ]}>
                            {item.question === '' ? '질문' : item.question}
                        </Text>
                        {item.isRequired && <Text style={[styles.requiredMark, { color: colors.error }]}>*</Text>}
                    </View>
                )}
                {item.type === ANSWER_TYPE.Short && (
                    <>
                        <Text style={[styles.answerText, { color: colors.textHint }]}>단답형 텍스트</Text>
                        <View style={styles.shortDottedLine}>
                            <View style={styles.dottedLine} />
                        </View>
                    </>
                )}
                {item.type === ANSWER_TYPE.Long && (
                    <>
                        <Text style={[styles.answerText, { color: colors.textHint }]}>장문형 텍스트</Text>
                        <View style={styles.longDottedLine}>
                            <View style={styles.dottedLine} />
                        </View>
                    </>
                )}
                {(item.type === ANSWER_TYPE.Multiple || item.type === ANSWER_TYPE.CheckBox) &&
                    item.optionList?.map(option => {
                        return (
                            <MultipleChoiceItem
                                key={option.id}
                                item={option}
                                questionID={item.id}
                                questionType={item.type}
                                updateFlatList={updateFlatList}
                            />
                        );
                    })}
                {(item.type === ANSWER_TYPE.Multiple || item.type === ANSWER_TYPE.CheckBox) && (
                    <MultipleChoiceItem
                        item={{ id: 'ADD-1', label: '', type: CHOICE_ITEM_TYPE.Add }}
                        questionID={item.id}
                        questionType={item.type}
                        updateFlatList={updateFlatList}
                    />
                )}
                {isSelected && (
                    <View style={[styles.utilsContainer, { borderTopColor: colors.border }]}>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#E1E1E1' : 'transparent',
                                },
                                styles.utilsButton,
                            ]}
                            onPress={() => {
                                copyQuestion();
                            }}>
                            <Icon name="content-copy" color={colors.iconPrimary} size={20} />
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#E1E1E1' : 'transparent',
                                },
                                styles.utilsButton,
                            ]}
                            onPress={() => {
                                deleteQuestion();
                            }}>
                            <Icon name="trash-can-outline" color={colors.iconPrimary} size={24} />
                        </Pressable>
                        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                        <Text style={[styles.requireText, { color: colors.textPrimary }]}>필수</Text>
                        <Switch
                            trackColor={{ false: '#B9B9B9', true: colors.background }}
                            thumbColor={item.isRequired ? colors.primary : '#FAFAFA'}
                            ios_backgroundColor={colors.background}
                            onValueChange={updateIsRequired}
                            value={item.isRequired}
                        />
                    </View>
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        borderWidth: 1,
        borderRadius: 4,
        minHeight: 28,
    },
    selectedMark: {
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        width: 8,
        position: 'absolute',
        height: '100%',
    },
    padding: {
        padding: 24,
        paddingTop: 22,
    },
    questionTextContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    questionText: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
    },
    requiredMark: {
        fontWeight: '400',
        fontSize: 16,
        paddingLeft: 4,
        width: 24,
    },
    shortDottedLine: {
        width: '50%',
        height: 1,
        overflow: 'hidden',
    },
    longDottedLine: {
        width: '85%',
        height: 1,
        overflow: 'hidden',
    },
    dottedLine: {
        borderStyle: 'dotted',
        borderWidth: 1,
        borderColor: '#00000061',
    },
    answerText: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
    },
    utilsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 28,
        borderTopWidth: 1,
        alignItems: 'center',
        marginBottom: -24,
    },
    utilsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        marginHorizontal: 4,
    },
    divider: {
        width: 1,
        height: 24,
        marginHorizontal: 16,
    },
    requireText: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
        marginRight: 8,
    },
});

export default QuestionBox;
