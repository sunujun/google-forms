import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { useRecoilState } from 'recoil';

import { ANSWER_TYPE } from 'constant';
import { formState, IQuestion } from 'states';

import SingleLineInput from './SingleLineInput';

interface PreviewQuestionBoxProps {
    item: IQuestion;
}

const PreviewQuestionBox = ({ item }: PreviewQuestionBoxProps) => {
    const { width } = useWindowDimensions();
    const [form, setForm] = useRecoilState(formState);
    const [answer, setAnswer] = useState('');
    const [checkIsRequired, setCheckIsRequired] = useState(false);

    return (
        <View style={checkIsRequired ? styles.errorContainer : styles.container}>
            <View style={styles.padding}>
                <View style={styles.questionTextContainer}>
                    <Text style={[styles.questionText, { maxWidth: width - 24 - 48 - 24 }]}>{item.question}</Text>
                    {item.isRequired && <Text style={styles.requiredMark}>*</Text>}
                </View>
                {item.type === ANSWER_TYPE.Short && (
                    <>
                        <View style={styles.shortInput}>
                            <SingleLineInput
                                placeholder="내 답변"
                                value={answer}
                                // TODO: error 상태에서 입력되면 error 해제
                                onChangeText={setAnswer}
                                isError={item.isRequired ? checkIsRequired : undefined}
                                onBlur={() => {
                                    if (item.isRequired && answer === '') {
                                        setCheckIsRequired(true);
                                    } else {
                                        setCheckIsRequired(false);
                                    }
                                }}
                            />
                        </View>
                        {checkIsRequired && (
                            <View style={styles.requiredContainer}>
                                <Icon name="alert-circle-outline" color="#D93025" size={24} />
                                <Text style={styles.requiredText}>필수 질문입니다.</Text>
                            </View>
                        )}
                    </>
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
});

export default PreviewQuestionBox;
