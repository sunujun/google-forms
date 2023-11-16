import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { INPUT_TYPE } from 'constant';
import { flatListState, formState } from 'states';

import MultiLineInput from './MultiLineInput';

const TitleBox = () => {
    const [form, setForm] = useRecoilState(formState);
    const setFlatList = useSetRecoilState(flatListState);
    const titleInputRef = useRef<TextInput>(null);
    const descriptionInputRef = useRef<TextInput>(null);

    const isSelected = form.selectedID === 'FORM-1';

    const updateTitle = useCallback(
        (title: string) => {
            setForm(previousState => {
                return {
                    ...previousState,
                    title,
                };
            });
        },
        [setForm],
    );

    const updateDescription = (description: string) => {
        setForm(previousState => {
            return {
                ...previousState,
                description,
            };
        });
    };

    const onPressTitleBox = () => {
        setForm(previousState => {
            return {
                ...previousState,
                selectedID: 'FORM-1',
            };
        });
    };

    const onFocusTitleInput = () => {
        setForm(prevForm => {
            return { ...prevForm, focusInputID: 'TITLE-' + prevForm.id };
        });
        if (titleInputRef.current) {
            titleInputRef.current.measureInWindow((_x, y, _width, height) => {
                setFlatList({
                    textInputPositionY: y,
                    textInputHeight: height,
                });
            });
        }
    };

    const onFocusDescriptionInput = () => {
        setForm(prevForm => {
            return { ...prevForm, focusInputID: 'DESCRIPTION-' + prevForm.id };
        });
        if (descriptionInputRef.current) {
            descriptionInputRef.current.measureInWindow((_x, y, _width, height) => {
                setFlatList({
                    textInputPositionY: y,
                    textInputHeight: height,
                });
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (form.title === '') {
                updateTitle('제목 없는 설문지');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [form.title, updateTitle]);

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
                        value={form.title}
                        onChangeText={updateTitle}
                        onFocus={onFocusTitleInput}
                    />
                ) : (
                    <Text style={styles.title}>{form.title}</Text>
                )}
                {isSelected ? (
                    <MultiLineInput
                        inputRef={descriptionInputRef}
                        type={INPUT_TYPE.Description}
                        placeholder="설문지 설명"
                        value={form.description}
                        onChangeText={updateDescription}
                        onFocus={onFocusDescriptionInput}
                    />
                ) : (
                    <Text style={styles.description}>{form.description}</Text>
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
