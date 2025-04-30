import { StyleSheet, Text, View } from 'react-native';

import { useFormContext } from 'contexts/FormContext';

const PreviewTitleBox = () => {
    const { formState } = useFormContext();
    const hasIsRequired = formState.questionList.some(question => question.isRequired);

    return (
        <View style={styles.container}>
            <View style={styles.topMark} />
            <View style={styles.padding}>
                <Text style={styles.title}>{formState.title}</Text>
                {formState.description !== '' && <Text style={styles.description}>{formState.description}</Text>}
            </View>
            {hasIsRequired && (
                <View style={styles.cautionContainer}>
                    <Text style={styles.cautionText}>* 표시는 필수 질문임</Text>
                </View>
            )}
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
    topMark: {
        backgroundColor: '#673AB7',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        height: 10,
        position: 'absolute',
        width: '100%',
    },
    padding: {
        padding: 24,
        paddingTop: 22,
    },
    title: {
        fontSize: 24,
        letterSpacing: 0,
        fontWeight: '400',
        color: '#202124',
        height: 40,
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        fontWeight: '400',
        color: '#202124',
        marginTop: 8,
    },
    cautionContainer: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginTop: -12,
        borderTopWidth: 1,
        borderColor: '#DADCE0',
    },
    cautionText: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 20,
        fontWeight: '400',
        color: '#D93025',
    },
});

export default PreviewTitleBox;
