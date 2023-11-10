import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';
import { useRecoilState } from 'recoil';

import { ANSWER_TYPE, AnswerID, CHOICE_ITEM_TYPE } from 'constant';
import { formState, IOption } from 'states';

import SingleLineInput from './SingleLineInput';

interface MultipleChoiceItemProps {
    item: IOption;
    questionID: string;
    questionType: AnswerID;
}

const MultipleChoiceItem = ({ item, questionID, questionType }: MultipleChoiceItemProps) => {
    const [form, setForm] = useRecoilState(formState);
    const labelInputRef = useRef<TextInput>(null);

    const questionList = form.questionList;
    const questionIndex = questionList.findIndex(question => question.id === questionID);
    const optionList = questionList[questionIndex].optionList;
    const optionIndex = optionList.findIndex(option => option.id === item.id);
    const hasETCOption = optionList.some(option => option.type === CHOICE_ITEM_TYPE.ETC);
    const optionCount = optionList.filter(option => option.type === CHOICE_ITEM_TYPE.Label).length;
    const hasClose = item.type === CHOICE_ITEM_TYPE.ETC || (item.type === CHOICE_ITEM_TYPE.Label && optionCount > 1);
    const isQuestionSelected = questionID === form.selectedID;
    const firstDuplicateIndex = optionList.findIndex(option => option.label === item.label);
    const hasDuplicate = optionList.some(option => option.id !== item.id && option.label === item.label);
    const isError = optionIndex !== firstDuplicateIndex && hasDuplicate;

    const updateLabelOption = useCallback(
        (label: string) => {
            setForm(prevForm => {
                const updatedOptionList = [...prevForm.questionList[questionIndex].optionList];
                updatedOptionList[optionIndex] = { ...updatedOptionList[optionIndex], label };

                const updatedQuestionList = [...prevForm.questionList];
                updatedQuestionList[questionIndex] = {
                    ...updatedQuestionList[questionIndex],
                    optionList: updatedOptionList,
                };

                const updatedForm = { ...prevForm, questionList: updatedQuestionList };

                return updatedForm;
            });
        },
        [optionIndex, questionIndex, setForm],
    );

    const addOption = () => {
        setForm(prevForm => {
            const updatedOptionList = [...prevForm.questionList[questionIndex].optionList];
            const newOption = {
                id: 'OPTION-' + uuid.v4(),
                type: CHOICE_ITEM_TYPE.Label,
                label: '옵션 ' + (optionCount + 1).toString(),
            };
            if (hasETCOption) {
                updatedOptionList.splice(updatedOptionList.length - 1, 0, newOption);
            } else {
                updatedOptionList.push(newOption);
            }

            const updatedQuestionList = [...prevForm.questionList];
            updatedQuestionList[questionIndex] = {
                ...updatedQuestionList[questionIndex],
                optionList: updatedOptionList,
            };

            const updatedForm = { ...prevForm, questionList: updatedQuestionList };

            return updatedForm;
        });
    };

    const addETCOption = () => {
        setForm(prevForm => {
            const updatedOptionList = [...prevForm.questionList[questionIndex].optionList];
            const newOption: IOption = {
                id: 'OPTION-' + uuid.v4(),
                type: CHOICE_ITEM_TYPE.ETC,
                label: '기타...',
            };
            updatedOptionList.push(newOption);

            const updatedQuestionList = [...prevForm.questionList];
            updatedQuestionList[questionIndex] = {
                ...updatedQuestionList[questionIndex],
                optionList: updatedOptionList,
            };

            const updatedForm = { ...prevForm, questionList: updatedQuestionList, focusInputID: undefined };

            return updatedForm;
        });
    };

    const deleteOption = () => {
        setForm(prevForm => {
            const willFocusID = optionIndex === 0 ? optionList[0].id : optionList[optionIndex - 1].id;

            const updatedOptionList = [...prevForm.questionList[questionIndex].optionList].filter(
                option => option.id !== item.id,
            );

            if (updateLabelOption.length === 0) {
                return prevForm;
            }

            const updatedQuestionList = [...prevForm.questionList];
            updatedQuestionList[questionIndex] = {
                ...updatedQuestionList[questionIndex],
                optionList: updatedOptionList,
            };

            const updatedForm = { ...prevForm, questionList: updatedQuestionList, focusInputID: willFocusID };

            return updatedForm;
        });
    };

    const onPressCheckBox = () => {
        if (item.type === CHOICE_ITEM_TYPE.Label) {
            labelInputRef.current?.focus();
        } else if (item.type === CHOICE_ITEM_TYPE.Add) {
            addOption();
        }
    };

    const autoEditLabel = () => {
        if (hasDuplicate) {
            updateLabelOption('옵션 ' + (optionIndex + 1).toString());
        }
    };

    const onFocus = () => {
        setForm(prevForm => {
            return { ...prevForm, focusInputID: item.id };
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (item.label === '') {
                updateLabelOption('옵션 ' + (optionIndex + 1).toString());
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [item.label, optionIndex, updateLabelOption]);

    useEffect(() => {
        if (item.label !== '옵션 1') {
            setForm(prevForm => {
                return { ...prevForm, focusInputID: item.id };
            });
        }
    }, [item.id, item.label, setForm]);

    useEffect(() => {
        if (item.id === form.focusInputID) {
            labelInputRef.current?.focus();
        } else {
            labelInputRef.current?.blur();
        }
    }, [form.focusInputID, item.id, setForm]);

    return (
        <View style={styles.container}>
            {!(!isQuestionSelected && item.type === CHOICE_ITEM_TYPE.Add) && (
                <Pressable onPress={onPressCheckBox}>
                    {questionType === ANSWER_TYPE.Multiple ? (
                        <Icon name="checkbox-blank-circle-outline" color="#BDBDBD" size={24} />
                    ) : (
                        <Icon name="checkbox-blank-outline" color="#BDBDBD" size={24} />
                    )}
                </Pressable>
            )}
            {item.type === CHOICE_ITEM_TYPE.Label && isQuestionSelected && (
                <SingleLineInput
                    style={styles.singleLineInputContainer}
                    inputRef={labelInputRef}
                    value={item.label}
                    isError={isError}
                    onChangeText={updateLabelOption}
                    onFocus={onFocus}
                    onBlur={autoEditLabel}
                />
            )}
            {item.type === CHOICE_ITEM_TYPE.Label && !isQuestionSelected && (
                <Text style={styles.labelText}>{item.label}</Text>
            )}
            {item.type === CHOICE_ITEM_TYPE.ETC && <Text style={styles.etcOptionText}>{item.label}</Text>}
            {isQuestionSelected && item.type === CHOICE_ITEM_TYPE.Add && (
                <View style={styles.addButton}>
                    <TouchableOpacity onPress={addOption}>
                        <Text style={styles.addOptionText}>옵션 추가</Text>
                    </TouchableOpacity>
                    {!hasETCOption && (
                        <>
                            <Text style={styles.orText}>또는 </Text>
                            <TouchableOpacity onPress={addETCOption}>
                                <Text style={styles.etcText}>&apos;기타&apos; 추가</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
            {isError && <Icon style={styles.errorIcon} name="alert" color="#D93025" size={24} />}
            {isQuestionSelected && hasClose && (
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#E1E1E1' : 'transparent',
                        },
                        styles.utilsButton,
                    ]}
                    onPress={deleteOption}>
                    <Icon name="close" color="#5F6368" size={24} />
                </Pressable>
            )}
        </View>
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
    addButton: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: 8,
    },
    addOptionText: {
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        color: '#70757A',
    },
    orText: {
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        color: '#202124',
        marginLeft: 4,
    },
    etcText: {
        fontSize: 14,
        letterSpacing: 0.25,
        fontWeight: '400',
        lineHeight: 20,
        color: '#1A73E8',
    },
    labelText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
        color: '#202124',
        alignSelf: 'center',
        flex: 1,
    },
    errorIcon: {
        marginRight: 8,
    },
    utilsButton: {
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    singleLineInputContainer: {
        marginLeft: 8,
        marginRight: 24,
    },
});

export default MultipleChoiceItem;
