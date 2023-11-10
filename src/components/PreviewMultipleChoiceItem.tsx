import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSetRecoilState } from 'recoil';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE } from 'constant';
import { formState, IOption, IQuestion } from 'states';

import SingleLineInput from './SingleLineInput';

interface PreviewMultipleChoiceItemProps {
    item: IOption;
    question: IQuestion;
}

const PreviewMultipleChoiceItem = ({ item, question }: PreviewMultipleChoiceItemProps) => {
    const setForm = useSetRecoilState(formState);
    const etcInputRef = useRef<TextInput>(null);

    const updateWriteAnswer = (answer: string) => {
        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem =>
                    questionItem.id === question.id
                        ? { ...questionItem, choiceAnswer: item.id, writeAnswer: answer, checkIsRequired: false }
                        : questionItem,
                ),
            };
        });
    };

    const onPressMultiple = () => {
        if (question.choiceAnswer !== item.id) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.focus();
            }
            setForm(previousState => {
                return {
                    ...previousState,
                    questionList: previousState.questionList.map(questionItem =>
                        questionItem.id === question.id ? { ...questionItem, choiceAnswer: item.id } : questionItem,
                    ),
                };
            });
        } else if (question.choiceAnswer === item.id && !question.isRequired) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.blur();
            }
            setForm(previousState => {
                return {
                    ...previousState,
                    questionList: previousState.questionList.map(questionItem =>
                        questionItem.id === question.id ? { ...questionItem, choiceAnswer: '' } : questionItem,
                    ),
                };
            });
        } else if (question.choiceAnswer === item.id && question.isRequired) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.blur();
            }
        }
    };

    const onPressCheckBox = () => {
        if (question.checkAnswer.includes(item.id)) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.blur();
            }
            setForm(previousState => {
                return {
                    ...previousState,
                    questionList: previousState.questionList.map(questionItem => {
                        if (questionItem.id === question.id) {
                            const updatedCheckAnswer = question.checkAnswer.filter(answer => answer !== item.id);
                            const checkIsRequired = question.isRequired && updatedCheckAnswer.length === 0;

                            return { ...questionItem, checkAnswer: updatedCheckAnswer, checkIsRequired };
                        }

                        return questionItem;
                    }),
                };
            });
        } else {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.focus();
            }
            setForm(previousState => {
                return {
                    ...previousState,
                    questionList: previousState.questionList.map(questionItem => {
                        if (questionItem.id === question.id) {
                            const updatedCheckAnswer = [...question.checkAnswer, item.id];

                            return { ...questionItem, checkAnswer: updatedCheckAnswer, checkIsRequired: false };
                        }

                        return questionItem;
                    }),
                };
            });
        }
    };

    return (
        <Pressable
            style={styles.container}
            onPress={question.type === ANSWER_TYPE.Multiple ? onPressMultiple : onPressCheckBox}>
            <TouchableOpacity onPress={question.type === ANSWER_TYPE.Multiple ? onPressMultiple : onPressCheckBox}>
                {question.type === ANSWER_TYPE.Multiple && question.choiceAnswer === item.id && (
                    <Icon name="checkbox-blank-circle" color="#BDBDBD" size={24} />
                )}
                {question.type === ANSWER_TYPE.Multiple && question.choiceAnswer !== item.id && (
                    <Icon name="checkbox-blank-circle-outline" color="#BDBDBD" size={24} />
                )}
                {question.type === ANSWER_TYPE.CheckBox && question.checkAnswer.includes(item.id) && (
                    <Icon name="checkbox-blank" color="#BDBDBD" size={24} />
                )}
                {question.type === ANSWER_TYPE.CheckBox && !question.checkAnswer.includes(item.id) && (
                    <Icon name="checkbox-blank-outline" color="#BDBDBD" size={24} />
                )}
            </TouchableOpacity>
            {item.type === CHOICE_ITEM_TYPE.Label && <Text style={styles.labelText}>{item.label}</Text>}
            {item.type === CHOICE_ITEM_TYPE.ETC && (
                <View style={styles.etcContainer}>
                    <Text style={styles.labelText}>기타:</Text>
                    <SingleLineInput
                        style={styles.etcInput}
                        inputRef={etcInputRef}
                        value={question.writeAnswer}
                        onChangeText={updateWriteAnswer}
                    />
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    etcOptionText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        color: '#70757A',
        alignSelf: 'center',
        flex: 1,
    },
    labelText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        color: '#202124',
        alignSelf: 'center',
    },
    etcContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    etcInput: {
        flex: 1,
        marginLeft: 12,
    },
});

export default PreviewMultipleChoiceItem;
