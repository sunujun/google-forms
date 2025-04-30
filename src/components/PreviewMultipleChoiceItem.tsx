import { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE } from 'constant';
import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { IOption, IQuestion } from 'types/form';

import SingleLineInput from './SingleLineInput';

interface PreviewMultipleChoiceItemProps {
    item: IOption;
    question: IQuestion;
}

const PreviewMultipleChoiceItem = ({ item, question }: PreviewMultipleChoiceItemProps) => {
    const { dispatch } = useFormContext();
    const { colors } = useTheme();
    const etcInputRef = useRef<TextInput>(null);

    const updateWriteAnswer = (answer: string) => {
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: question.id,
                question: {
                    choiceAnswer: item.id,
                    writeAnswer: answer,
                    checkIsRequired: false,
                },
            },
        });
    };

    const onPressMultiple = () => {
        if (question.choiceAnswer !== item.id) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.focus();
            }
            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: question.id,
                    question: { choiceAnswer: item.id },
                },
            });
        } else if (question.choiceAnswer === item.id && !question.isRequired) {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.blur();
            }
            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: question.id,
                    question: { choiceAnswer: '' },
                },
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

            const updatedCheckAnswer = question.checkAnswer.filter(answer => answer !== item.id);
            const checkIsRequired = question.isRequired && updatedCheckAnswer.length === 0;

            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: question.id,
                    question: {
                        checkAnswer: updatedCheckAnswer,
                        checkIsRequired,
                    },
                },
            });
        } else {
            if (item.type === CHOICE_ITEM_TYPE.ETC) {
                etcInputRef.current?.focus();
            }

            const updatedCheckAnswer = [...question.checkAnswer, item.id];

            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: question.id,
                    question: {
                        checkAnswer: updatedCheckAnswer,
                        checkIsRequired: false,
                    },
                },
            });
        }
    };

    return (
        <Pressable
            style={styles.container}
            onPress={question.type === ANSWER_TYPE.Multiple ? onPressMultiple : onPressCheckBox}>
            <TouchableOpacity onPress={question.type === ANSWER_TYPE.Multiple ? onPressMultiple : onPressCheckBox}>
                {question.type === ANSWER_TYPE.Multiple && question.choiceAnswer === item.id && (
                    <Icon name="checkbox-blank-circle" color={colors.iconDisabled} size={24} />
                )}
                {question.type === ANSWER_TYPE.Multiple && question.choiceAnswer !== item.id && (
                    <Icon name="checkbox-blank-circle-outline" color={colors.iconDisabled} size={24} />
                )}
                {question.type === ANSWER_TYPE.CheckBox && question.checkAnswer.includes(item.id) && (
                    <Icon name="checkbox-blank" color={colors.iconDisabled} size={24} />
                )}
                {question.type === ANSWER_TYPE.CheckBox && !question.checkAnswer.includes(item.id) && (
                    <Icon name="checkbox-blank-outline" color={colors.iconDisabled} size={24} />
                )}
            </TouchableOpacity>
            {item.type === CHOICE_ITEM_TYPE.Label && (
                <Text style={[styles.labelText, { color: colors.textHint }]}>{item.label}</Text>
            )}
            {item.type === CHOICE_ITEM_TYPE.ETC && (
                <View style={styles.etcContainer}>
                    <Text style={[styles.labelText, { color: colors.textHint }]}>기타:</Text>
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
    labelText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
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
