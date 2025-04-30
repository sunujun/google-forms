import { StyleSheet, Text, View } from 'react-native';

import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';

const PreviewTitleBox = () => {
    const { formState } = useFormContext();
    const { colors } = useTheme();
    const hasIsRequired = formState.questionList.some(question => question.isRequired);

    return (
        <View style={[styles.container, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={[styles.topMark, { backgroundColor: colors.primary }]} />
            <View style={styles.padding}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>{formState.title}</Text>
                {formState.description !== '' && (
                    <Text style={[styles.description, { color: colors.textPrimary }]}>{formState.description}</Text>
                )}
            </View>
            {hasIsRequired && (
                <View style={[styles.cautionContainer, { borderColor: colors.border }]}>
                    <Text style={[styles.cautionText, { color: colors.error }]}>* 표시는 필수 질문임</Text>
                </View>
            )}
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
    topMark: {
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
        height: 40,
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        fontWeight: '400',
        marginTop: 8,
    },
    cautionContainer: {
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginTop: -12,
        borderTopWidth: 1,
    },
    cautionText: {
        fontSize: 14,
        letterSpacing: 0.2,
        lineHeight: 20,
        fontWeight: '400',
    },
});

export default PreviewTitleBox;
