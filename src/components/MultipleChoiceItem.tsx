import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import uuid from 'react-native-uuid';

import { ANSWER_TYPE, AnswerID, CHOICE_ITEM_TYPE } from 'constant';
import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { IOption } from 'types/form';

import SingleLineInput from './SingleLineInput';

interface MultipleChoiceItemProps {
    item: IOption;
    questionID: string;
    questionType: AnswerID;
    updateFlatList?: (posY: number, height: number) => void;
}

const MultipleChoiceItem = ({ item, questionID, questionType, updateFlatList }: MultipleChoiceItemProps) => {
    const { formState, dispatch } = useFormContext();
    const { colors } = useTheme();
    const labelInputRef = useRef<TextInput>(null);

    const questionList = formState.questionList;
    const questionIndex = questionList.findIndex(question => question.id === questionID);
    const optionList = questionList[questionIndex].optionList;
    const optionIndex = optionList.findIndex(option => option.id === item.id);
    const hasETCOption = optionList.some(option => option.type === CHOICE_ITEM_TYPE.ETC);
    const optionCount = optionList.filter(option => option.type === CHOICE_ITEM_TYPE.Label).length;
    const hasClose = item.type === CHOICE_ITEM_TYPE.ETC || (item.type === CHOICE_ITEM_TYPE.Label && optionCount > 1);
    const isQuestionSelected = questionID === formState.selectedID;
    const firstDuplicateIndex = optionList.findIndex(option => option.label === item.label);
    const hasDuplicate = optionList.some(option => option.id !== item.id && option.label === item.label);
    const isError = optionIndex !== firstDuplicateIndex && hasDuplicate;

    const updateLabelOption = useCallback(
        (label: string) => {
            // 질문 내의 옵션 리스트 업데이트
            const updatedOptionList = [...optionList];
            updatedOptionList[optionIndex] = { ...updatedOptionList[optionIndex], label };

            // 질문 리스트 업데이트
            dispatch({
                type: 'UPDATE_QUESTION_BY_ID',
                payload: {
                    id: questionID,
                    question: { optionList: updatedOptionList },
                },
            });
        },
        [questionID, optionList, optionIndex, dispatch],
    );

    const addOption = () => {
        // 새 옵션 추가
        const updatedOptionList = [...optionList];
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

        // 질문 리스트 업데이트
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: questionID,
                question: { optionList: updatedOptionList },
            },
        });
    };

    const addETCOption = () => {
        // 기타 옵션 추가
        const updatedOptionList = [...optionList];
        const newOption: IOption = {
            id: 'OPTION-' + uuid.v4(),
            type: CHOICE_ITEM_TYPE.ETC,
            label: '기타...',
        };
        updatedOptionList.push(newOption);

        // 질문 리스트 업데이트
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: questionID,
                question: { optionList: updatedOptionList },
            },
        });
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: undefined });
    };

    const deleteOption = () => {
        // 옵션을 삭제하고 다음에 포커스할 ID 결정
        const willFocusID = optionIndex === 0 ? optionList[0].id : optionList[optionIndex - 1].id;
        const updatedOptionList = optionList.filter(option => option.id !== item.id);

        if (updatedOptionList.length === 0) {
            return; // 옵션이 없는 경우 삭제하지 않음
        }

        // 질문 리스트 업데이트
        dispatch({
            type: 'UPDATE_QUESTION_BY_ID',
            payload: {
                id: questionID,
                question: { optionList: updatedOptionList },
            },
        });
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: willFocusID });
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
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: item.id });

        // 텍스트 입력 위치 정보 업데이트
        if (labelInputRef.current && updateFlatList) {
            labelInputRef.current.measureInWindow((_x, y, _width, height) => {
                updateFlatList(y, height);
            });
        }
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
            dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: item.id });
        }
    }, [item.id, item.label, dispatch]);

    useEffect(() => {
        if (item.id === formState.focusInputID) {
            labelInputRef.current?.focus();
        } else {
            labelInputRef.current?.blur();
        }
    }, [formState.focusInputID, item.id]);

    return (
        <View style={styles.container}>
            {!(!isQuestionSelected && item.type === CHOICE_ITEM_TYPE.Add) && (
                <Pressable onPress={onPressCheckBox}>
                    {questionType === ANSWER_TYPE.Multiple ? (
                        <Icon name="checkbox-blank-circle-outline" color={colors.iconDisabled} size={24} />
                    ) : (
                        <Icon name="checkbox-blank-outline" color={colors.iconDisabled} size={24} />
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
                <Text style={[styles.labelText, { color: colors.textPrimary }]}>{item.label}</Text>
            )}
            {item.type === CHOICE_ITEM_TYPE.ETC && (
                <Text style={[styles.etcOptionText, { color: colors.textHint }]}>{item.label}</Text>
            )}
            {isQuestionSelected && item.type === CHOICE_ITEM_TYPE.Add && (
                <View style={styles.addButton}>
                    <TouchableOpacity onPress={addOption}>
                        <Text style={[styles.addOptionText, { color: colors.textHint }]}>옵션 추가</Text>
                    </TouchableOpacity>
                    {!hasETCOption && (
                        <>
                            <Text style={[styles.orText, { color: colors.textPrimary }]}>또는 </Text>
                            <TouchableOpacity onPress={addETCOption}>
                                <Text style={[styles.etcText, { color: colors.etc }]}>&apos;기타&apos; 추가</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
            {isError && <Icon style={styles.errorIcon} name="alert" color={colors.error} size={24} />}
            {isQuestionSelected && hasClose && (
                <Pressable
                    style={({ pressed }) => [
                        {
                            backgroundColor: pressed ? '#E1E1E1' : 'transparent',
                        },
                        styles.utilsButton,
                    ]}
                    onPress={deleteOption}>
                    <Icon name="close" color={colors.textSecondary} size={24} />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    etcOptionText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
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
    },
    orText: {
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        marginLeft: 4,
    },
    etcText: {
        fontSize: 14,
        letterSpacing: 0.25,
        fontWeight: '400',
        lineHeight: 20,
    },
    labelText: {
        marginLeft: 8,
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 16,
        fontWeight: '400',
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
