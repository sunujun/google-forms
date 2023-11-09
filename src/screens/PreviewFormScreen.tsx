import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';

import { PreviewQuestionBox, PreviewTitleBox } from 'components';
import { formState, IQuestion } from 'states';

const PreviewFormScreen = () => {
    const form = useRecoilValue(formState);
    const safeAreaInset = useSafeAreaInsets();

    const ListHeaderComponent = useCallback(() => {
        return <PreviewTitleBox />;
    }, []);

    const renderItem = ({ item }: { item: IQuestion }) => {
        return <PreviewQuestionBox item={item} />;
    };

    return (
        <View style={styles.container}>
            <FlatList
                contentContainerStyle={{ paddingBottom: safeAreaInset.bottom }}
                data={form.questionList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
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
    flatListContainer: {
        flex: 1,
    },
});

export default PreviewFormScreen;
