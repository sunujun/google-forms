import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { INPUT_TYPE } from 'constant';
import { useFormContext } from 'contexts/FormContext';

import MultiLineInput from './MultiLineInput';

interface TitleBoxProps {
    updateFlatList?: (posY: number, height: number) => void;
}

const TitleBox = ({ updateFlatList }: TitleBoxProps) => {
    const { formState, dispatch } = useFormContext();

    const titleInputRef = useRef<TextInput>(null);
    const descriptionInputRef = useRef<TextInput>(null);

    const isSelected = formState.selectedID === 'FORM-1';

    const handleUpdateTitle = useCallback(
        (title: string) => {
            dispatch({ type: 'UPDATE_TITLE', payload: title });
        },
        [dispatch],
    );

    const handleUpdateDescription = (description: string) => {
        dispatch({ type: 'UPDATE_DESCRIPTION', payload: description });
    };

    const onPressTitleBox = () => {
        dispatch({ type: 'UPDATE_SELECTED_ID', payload: 'FORM-1' });
    };

    const onFocusTitleInput = () => {
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: 'TITLE-' + formState.id });

        // 텍스트 입력 위치 정보 업데이트
        if (titleInputRef.current && updateFlatList) {
            titleInputRef.current.measureInWindow((_x, y, _width, height) => {
                updateFlatList(y, height);
            });
        }
    };

    const onFocusDescriptionInput = () => {
        dispatch({ type: 'UPDATE_FOCUS_INPUT_ID', payload: 'DESCRIPTION-' + formState.id });

        // 텍스트 입력 위치 정보 업데이트
        if (descriptionInputRef.current && updateFlatList) {
            descriptionInputRef.current.measureInWindow((_x, y, _width, height) => {
                updateFlatList(y, height);
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formState.title === '') {
                handleUpdateTitle('제목 없는 설문지');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [formState.title, handleUpdateTitle]);

    return (
        <Pressable style={styles.container} onPress={onPressTitleBox}>
            {isSelected && <View style={styles.selectedMark} />}
            <View style={styles.topMark} />
            <View style={styles.padding}>
                {isSelected ? (
                    <MultiLineInput
                        inputRef={titleInputRef}
                        type={INPUT_TYPE.Title}
                        placeholder="설문지 제목"
                        value={formState.title}
                        onChangeText={handleUpdateTitle}
                        onFocus={onFocusTitleInput}
                    />
                ) : (
                    <Text style={styles.title}>{formState.title}</Text>
                )}
                {isSelected ? (
                    <MultiLineInput
                        inputRef={descriptionInputRef}
                        type={INPUT_TYPE.Description}
                        placeholder="설문지 설명"
                        value={formState.description}
                        onChangeText={handleUpdateDescription}
                        onFocus={onFocusDescriptionInput}
                    />
                ) : (
                    <Text style={styles.description}>{formState.description}</Text>
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
    topMark: {
        backgroundColor: '#673AB7',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        height: 10,
        position: 'absolute',
        width: '100%',
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
    title: {
        fontSize: 24,
        letterSpacing: 0,
        fontWeight: '400',
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
    },
    description: {
        fontSize: 11,
        letterSpacing: 0,
        lineHeight: 15,
        fontWeight: '400',
        color: '#202124',
        borderBottomWidth: 1,
        borderBottomColor: '#DADCE0',
        marginTop: 8,
    },
});

export default TitleBox;
