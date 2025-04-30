import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PreviewQuestionBox, PreviewTitleBox } from 'components';
import { useFormContext } from 'contexts/FormContext';
import { IQuestion } from 'types/form';

const PreviewFormScreen = () => {
    const { formState, dispatch } = useFormContext();
    const safeAreaInset = useSafeAreaInsets();

    const ListHeaderComponent = useCallback(() => {
        return <PreviewTitleBox />;
    }, []);

    const renderItem = ({ item }: { item: IQuestion }) => {
        return <PreviewQuestionBox item={item} />;
    };

    useEffect(() => {
        // 화면 진입 시 초기화 작업이 필요하다면 여기에 추가

        // 화면에서 나갈 때(컴포넌트 언마운트 시) 모든 질문의 답변 상태 초기화
        return () => {
            // RESET_ANSWERS 액션을 디스패치하여 모든 답변 초기화
            dispatch({ type: 'RESET_ANSWERS' });
        };
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <KeyboardAwareFlatList
                contentContainerStyle={{ paddingBottom: safeAreaInset.bottom }}
                data={formState.questionList}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListHeaderComponent={ListHeaderComponent}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraHeight={200}
                removeClippedSubviews={false}
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
