import { useEffect, useRef } from 'react';
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { useRecoilState } from 'recoil';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE, INPUT_TYPE } from 'constant';
import { formState, IQuestion } from 'states';

import MultiLineInput from './MultiLineInput';
import MultipleChoiceItem from './MultipleChoiceItem';

interface QuestionBoxProps {
    item: IQuestion;
    onLongPress?: ((event: GestureResponderEvent) => void) | null;
}

const QuestionBox = ({ item, onLongPress }: QuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const [form, setForm] = useRecoilState(formState);
    const questionInputRef = useRef<TextInput>(null);

    const isSelected = form.selectedID === item.id;
    const questionList = form.questionList;
    const currentIndex = questionList.findIndex(questionItem => questionItem.id === item.id);

    const updateQuestion = (question: string) => {
        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem =>
                    questionItem.id === item.id ? { ...questionItem, question } : questionItem,
                ),
            };
        });
    };

    const updateIsRequired = (isRequired: boolean) => {
        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem =>
                    questionItem.id === item.id ? { ...questionItem, isRequired } : questionItem,
                ),
                focusInputID: undefined,
            };
        });
    };

    const deleteQuestion = () => {
        const willSelectID = currentIndex === 0 ? form.id : questionList[currentIndex - 1].id;
        const updatedQuestionList = questionList.filter(questionItem => questionItem.id !== item.id);

        setForm({ ...form, questionList: updatedQuestionList, selectedID: willSelectID, focusInputID: undefined });
    };

    const copyQuestion = () => {
        const newID = 'QUESTION-' + uuid.v4();
        const copiedQuestion: IQuestion = { ...item, id: newID };
        const updatedQuestionList = [
            ...questionList.slice(0, currentIndex + 1),
            copiedQuestion,
            ...questionList.slice(currentIndex + 1),
        ];

        setForm({ ...form, questionList: updatedQuestionList, selectedID: newID });
    };

    const onFocus = () => {
        setForm(prevForm => {
            return { ...prevForm, focusInputID: item.id };
        });
    };

    useEffect(() => {
        if (isSelected) {
            setForm(prevForm => {
                return { ...prevForm, focusInputID: item.id };
            });
        }
    }, [isSelected, item.id, setForm]);

    useEffect(() => {
        if (item.id === form.focusInputID) {
            questionInputRef.current?.focus();
        } else {
            questionInputRef.current?.blur();
        }
    }, [form.focusInputID, item.id, setForm]);

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                setForm(previousState => {
                    return {
                        ...previousState,
                        selectedID: item.id,
                    };
                });
            }}
            onLongPress={onLongPress}>
            {isSelected && <View style={styles.selectedMark} />}
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
                        <Text style={[styles.questionText, { maxWidth: width - 24 - 48 - 24 }]}>
                            {item.question === '' ? '질문' : item.question}
                        </Text>
                        {item.isRequired && <Text style={styles.requiredMark}>*</Text>}
                    </View>
                )}
                {item.type === ANSWER_TYPE.Short && (
                    <>
                        <Text style={styles.answerText}>단답형 텍스트</Text>
                        <View style={styles.shortDottedLine}>
                            <View style={styles.dottedLine} />
                        </View>
                    </>
                )}
                {item.type === ANSWER_TYPE.Long && (
                    <>
                        <Text style={styles.answerText}>장문형 텍스트</Text>
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
                            />
                        );
                    })}
                {(item.type === ANSWER_TYPE.Multiple || item.type === ANSWER_TYPE.CheckBox) && (
                    <MultipleChoiceItem
                        item={{ id: 'ADD-1', label: '', type: CHOICE_ITEM_TYPE.Add }}
                        questionID={item.id}
                        questionType={item.type}
                    />
                )}
                {isSelected && (
                    <View style={styles.utilsContainer}>
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
                            <Icon name="content-copy" color="#5F6368" size={20} />
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
                            <Icon name="trash-can-outline" color="#5F6368" size={24} />
                        </Pressable>
                        <View style={styles.divider} />
                        <Text style={styles.requireText}>필수</Text>
                        <Switch
                            trackColor={{ false: '#B9B9B9', true: '#F0EBF8' }}
                            thumbColor={item.isRequired ? '#673AB7' : '#FAFAFA'}
                            ios_backgroundColor="#F0EBF8"
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
        backgroundColor: '#FFFFFF',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#DADCE0',
        borderRadius: 4,
        minHeight: 28,
    },
    selectedMark: {
        backgroundColor: '#4285F4',
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
        color: '#202124',
    },
    requiredMark: {
        color: '#D93025',
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
        color: '#70757A',
    },
    utilsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 28,
        borderTopColor: '#DADCE0',
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
        backgroundColor: '#DADCE0',
    },
    requireText: {
        fontSize: 14,
        fontWeight: '400',
        letterSpacing: 0.2,
        lineHeight: 20,
        color: '#202124',
        marginRight: 8,
    },
});

export default QuestionBox;
