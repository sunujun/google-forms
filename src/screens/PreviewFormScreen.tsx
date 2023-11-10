import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';

import { PreviewQuestionBox, PreviewTitleBox } from 'components';
import { formState, IQuestion } from 'states';

const PreviewFormScreen = () => {
    const [form, setForm] = useRecoilState(formState);
    const safeAreaInset = useSafeAreaInsets();

    const ListHeaderComponent = useCallback(() => {
        return <PreviewTitleBox />;
    }, []);

    const renderItem = ({ item }: { item: IQuestion }) => {
        return <PreviewQuestionBox item={item} />;
    };

    useEffect(() => {
        const initAnswer: Pick<IQuestion, 'writeAnswer' | 'choiceAnswer' | 'checkAnswer' | 'checkIsRequired'> = {
            writeAnswer: '',
            choiceAnswer: '',
            checkAnswer: [],
            checkIsRequired: false,
        };

        setForm(previousState => {
            return {
                ...previousState,
                questionList: previousState.questionList.map(questionItem => ({ ...questionItem, ...initAnswer })),
            };
        });
    }, [setForm]);

    return (
        <View style={styles.container}>
            <KeyboardAwareFlatList
                contentContainerStyle={{ paddingBottom: safeAreaInset.bottom }}
                data={form.questionList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraHeight={200}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0EBF8',
        flex: 1,
        paddingHorizontal: 12,
    },
});

export default PreviewFormScreen;
