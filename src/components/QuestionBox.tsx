import { useState } from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRecoilState } from 'recoil';

import { formState, IQuestion } from 'states';

import MultiLineInput, { INPUT_TYPE } from './MultiLineInput';

export const ANSWER_TYPE = {
    Short: 'short',
    Long: 'long',
    Multiple: 'multiple',
    CheckBox: 'checkBox',
} as const;
export type AnswerID = (typeof ANSWER_TYPE)[keyof typeof ANSWER_TYPE];

interface QuestionBoxProps {
    id: string;
    type: AnswerID;
    onLongPress?: ((event: GestureResponderEvent) => void) | null;
}

const QuestionBox = ({ id, type, onLongPress }: QuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const [form, setForm] = useRecoilState(formState);

    const [question, setQuestion] = useState('');
    const [isRequired, setIsRequired] = useState(false);

    const isSelected = form.selectedID === id;

    const toggleSwitch = () => {
        setIsRequired(previousState => !previousState);
    };

    const deleteQuestion = (questionID: string) => {
        const questionList = form.questionList;
        const currentIndex = questionList.findIndex(questionItem => questionItem.id === questionID);
        const willSelectID = currentIndex === 0 ? form.id : questionList[currentIndex - 1].id;
        const updatedQuestionList: IQuestion[] = questionList.filter(questionItem => questionItem.id !== questionID);

        setForm({ ...form, questionList: updatedQuestionList, selectedID: willSelectID });
    };

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                setForm(previousState => {
                    return {
                        ...previousState,
                        selectedID: id,
                    };
                });
            }}
            onLongPress={onLongPress}>
            {isSelected && <View style={styles.selectedMark} />}
            <View style={styles.padding}>
                {isSelected ? (
                    <MultiLineInput
                        type={INPUT_TYPE.Question}
                        placeholder="질문"
                        value={question}
                        onChangeText={setQuestion}
                    />
                ) : (
                    <View style={styles.questionTextContainer}>
                        <Text style={[styles.questionText, { maxWidth: width - 24 - 48 - 24 }]}>{question}</Text>
                        {isRequired && <Text style={styles.requiredMark}>*</Text>}
                    </View>
                )}
                {type === ANSWER_TYPE.Short && (
                    <>
                        <Text style={styles.answerText}>단답형 텍스트</Text>
                        <View style={styles.shortDottedLine}>
                            <View style={styles.dottedLine} />
                        </View>
                    </>
                )}
                {type === ANSWER_TYPE.Long && (
                    <>
                        <Text style={styles.answerText}>장문형 텍스트</Text>
                        <View style={styles.longDottedLine}>
                            <View style={styles.dottedLine} />
                        </View>
                    </>
                )}
                {isSelected && (
                    <View style={styles.utilsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                {
                                    backgroundColor: pressed ? '#E1E1E1' : 'transparent',
                                },
                                styles.utilsButton,
                            ]}>
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
                                deleteQuestion(id);
                            }}>
                            <Icon name="trash-can-outline" color="#5F6368" size={24} />
                        </Pressable>
                        <View style={styles.divider} />
                        <Text style={styles.requireText}>필수</Text>
                        <Switch
                            trackColor={{ false: '#B9B9B9', true: '#F0EBF8' }}
                            thumbColor={isRequired ? '#673AB7' : '#FAFAFA'}
                            ios_backgroundColor="#F0EBF8"
                            onValueChange={toggleSwitch}
                            value={isRequired}
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
    },
    questionText: {
        fontSize: 12,
        letterSpacing: 0,
        lineHeight: 24,
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
        marginTop: 12,
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
