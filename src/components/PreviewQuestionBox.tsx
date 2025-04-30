import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, useWindowDimensions, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE, INPUT_TYPE } from 'constant';
import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { IQuestion } from 'types/form';

import MultiLineInput from './MultiLineInput';
import PreviewMultipleChoiceItem from './PreviewMultipleChoiceItem';
import SingleLineInput from './SingleLineInput';

interface PreviewQuestionBoxProps {
    item: IQuestion;
}

const PreviewQuestionBox = ({ item }: PreviewQuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const { dispatch } = useFormContext();
    const { colors } = useTheme();

    const etcID = item.optionList.find(option => option.type === CHOICE_ITEM_TYPE.ETC)?.id;
    const isMultipleError = item.isRequired && item.choiceAnswer === etcID && item.writeAnswer === '';

    const updateWriteAnswer = (answer: string) => {
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: item.id,
                question: {
                    writeAnswer: answer,
                    checkIsRequired: false,
                },
            },
        });
    };

    const updateCheckIsRequired = useCallback(
        (checkIsRequired: boolean) => {
            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: item.id,
                    question: { checkIsRequired },
                },
            });
        },
        [item.id, dispatch],
    );

    const removeChoiceAnswer = () => {
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: item.id,
                question: { choiceAnswer: '' },
            },
        });
    };

    useEffect(() => {
        if (item.type === ANSWER_TYPE.Multiple) {
            updateCheckIsRequired(isMultipleError);
        }
    }, [isMultipleError, item.type, updateCheckIsRequired]);

    return (
        <View
            style={
                item.checkIsRequired
                    ? [styles.errorContainer, { backgroundColor: colors.cardBackground, borderColor: colors.error }]
                    : [styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]
            }>
            <View style={styles.padding}>
                <View style={styles.questionTextContainer}>
                    <Text style={[styles.questionText, { maxWidth: width - 24 - 48 - 24, color: colors.textPrimary }]}>
                        {item.question}
                    </Text>
                    {item.isRequired && <Text style={[styles.requiredMark, { color: colors.error }]}>*</Text>}
                </View>
                {item.type === ANSWER_TYPE.Short && (
                    <SingleLineInput
                        placeholder="내 답변"
                        value={item.writeAnswer}
                        onChangeText={updateWriteAnswer}
                        isError={item.isRequired ? item.checkIsRequired : undefined}
                        onBlur={() => {
                            if (item.isRequired && item.writeAnswer === '') {
                                updateCheckIsRequired(true);
                            } else {
                                updateCheckIsRequired(false);
                            }
                        }}
                    />
                )}
                {item.type === ANSWER_TYPE.Long && (
                    <MultiLineInput
                        placeholder="내 답변"
                        value={item.writeAnswer}
                        type={INPUT_TYPE.Answer}
                        onChangeText={updateWriteAnswer}
                        isError={item.isRequired ? item.checkIsRequired : undefined}
                        onBlur={() => {
                            if (item.isRequired && item.writeAnswer === '') {
                                updateCheckIsRequired(true);
                            } else {
                                updateCheckIsRequired(false);
                            }
                        }}
                    />
                )}
                {(item.type === ANSWER_TYPE.Multiple || item.type === ANSWER_TYPE.CheckBox) &&
                    item.optionList?.map(option => {
                        return <PreviewMultipleChoiceItem key={option.id} item={option} question={item} />;
                    })}
                {item.type === ANSWER_TYPE.Multiple && !item.isRequired && item.choiceAnswer !== '' && (
                    <View style={styles.checkInitContainer}>
                        <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={removeChoiceAnswer}>
                            <Text style={[styles.checkInitText, { color: colors.textSecondary }]}>선택해제</Text>
                        </TouchableHighlight>
                    </View>
                )}
                {item.checkIsRequired && (
                    <View style={styles.requiredContainer}>
                        <Icon name="alert-circle-outline" color={colors.error} size={24} />
                        <Text style={[styles.requiredText, { color: colors.error }]}>필수 질문입니다.</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
        borderWidth: 1,
        borderRadius: 4,
        minHeight: 28,
    },
    errorContainer: {
        marginVertical: 12,
        borderWidth: 1,
        borderRadius: 4,
        minHeight: 28,
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
    requiredContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    requiredText: {
        fontSize: 12,
        letterSpacing: 0,
        lineHeight: 14,
        fontWeight: '400',
        marginLeft: 8,
    },
    checkInitContainer: {
        alignItems: 'flex-end',
    },
    checkInitText: {
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 0.25,
        lineHeight: 20,
        marginVertical: 4,
        marginHorizontal: 8,
    },
});

export default PreviewQuestionBox;
