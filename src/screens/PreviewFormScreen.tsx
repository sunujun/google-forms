import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PreviewQuestionBox, PreviewTitleBox } from 'components';
import { ColorSchemeButton } from 'components/ColorSchemeButton';
import { useFormContext } from 'contexts/FormContext';
import { useTheme } from 'contexts/ThemeContext';
import { IQuestion } from 'types/form';

const PreviewFormScreen = () => {
    const { formState, dispatch } = useFormContext();
    const { colors } = useTheme();
    const safeAreaInset = useSafeAreaInsets();

    const ListHeaderComponent = useCallback(() => {
        return <PreviewTitleBox />;
    }, []);

    const renderItem = ({ item }: { item: IQuestion }) => {
        return <PreviewQuestionBox item={item} />;
    };

    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET_ANSWERS' });
        };
    }, [dispatch]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <View style={[styles.floatingButtonContainer, { bottom: safeAreaInset.bottom + 24 }]}>
                <ColorSchemeButton />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
    },
    floatingButtonContainer: {
        position: 'absolute',
        right: 12,
    },
});

export default PreviewFormScreen;
