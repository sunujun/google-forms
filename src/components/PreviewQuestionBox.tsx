import { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, useWindowDimensions, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useSetRecoilState } from 'recoil';

import { ANSWER_TYPE, CHOICE_ITEM_TYPE, INPUT_TYPE } from 'constant';
import { formState, IQuestion } from 'states';

import MultiLineInput from './MultiLineInput';
import PreviewMultipleChoiceItem from './PreviewMultipleChoiceItem';
import SingleLineInput from './SingleLineInput';

interface PreviewQuestionBoxProps {
    item: IQuestion;
}

const PreviewQuestionBox = ({ item }: PreviewQuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const setForm = useSetRecoilState(formState);

    const etcID = item.optionList.find(option => option.type === CHOICE_ITEM_TYPE.ETC)?.id;
    const isMultipleError = item.isRequired && item.choiceAnswer === etcID && item.writeAnswer === '';

    const updateWriteAnswer = (answer: string) => {
        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem =>
                    questionItem.id === item.id
                        ? { ...questionItem, writeAnswer: answer, checkIsRequired: false }
                        : questionItem,
                ),
            };
        });
    };

    const updateCheckIsRequired = useCallback(
        (checkIsRequired: boolean) => {
            setForm(previousState => {
                return {
                    ...previousState,
                    questionList: previousState.questionList.map(questionItem =>
                        questionItem.id === item.id ? { ...questionItem, checkIsRequired } : questionItem,
                    ),
                };
            });
        },
        [item.id, setForm],
    );

    const removeChoiceAnswer = () => {
        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem =>
                    questionItem.id === item.id ? { ...questionItem, choiceAnswer: '' } : questionItem,
                ),
            };
        });
    };

    useEffect(() => {
        if (item.type === ANSWER_TYPE.Multiple) {
            updateCheckIsRequired(isMultipleError);
        }
    }, [isMultipleError, item.type, updateCheckIsRequired]);

    return (
        <View style={item.checkIsRequired ? styles.errorContainer : styles.container}>
            <View style={styles.padding}>
                <View style={styles.questionTextContainer}>
                    <Text style={[styles.questionText, { maxWidth: width - 24 - 48 - 24 }]}>{item.question}</Text>
                    {item.isRequired && <Text style={styles.requiredMark}>*</Text>}
                </View>
                {item.type === ANSWER_TYPE.Short && (
                    <View style={styles.shortInput}>
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
                    </View>
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
                            <Text style={styles.checkInitText}>선택해제</Text>
                        </TouchableHighlight>
                    </View>
                )}
                {item.checkIsRequired && (
                    <View style={styles.requiredContainer}>
                        <Icon name="alert-circle-outline" color="#D93025" size={24} />
                        <Text style={styles.requiredText}>필수 질문입니다.</Text>
                    </View>
                )}
            </View>
        </View>
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
    errorContainer: {
        backgroundColor: '#FFFFFF',
        marginVertical: 12,
        borderWidth: 1,
        borderColor: '#D93025',
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
        color: '#202124',
    },
    requiredMark: {
        color: '#D93025',
        fontWeight: '400',
        fontSize: 16,
        paddingLeft: 4,
        width: 24,
    },
    shortInput: {
        height: 24,
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
        color: '#D93025',
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
        color: '#5f6368',
        marginVertical: 4,
        marginHorizontal: 8,
    },
});

export default PreviewQuestionBox;
