import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRecoilState } from 'recoil';

import { formState } from 'states';

import MultiLineInput, { INPUT_TYPE } from './MultiLineInput';

const TitleBox = () => {
    const [form, setForm] = useRecoilState(formState);

    const [title, setTitle] = useState(form.title);
    const [description, setDescription] = useState(form.description);

    const isSelected = form.selectedID === 'FORM-1';

    useEffect(() => {
        const timer = setTimeout(() => {
            if (title === '') {
                setTitle('제목 없는 설문지');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [title]);

    useEffect(() => {
        setForm(previousState => {
            return {
                ...previousState,
                title,
                description,
            };
        });
    }, [description, setForm, title]);

    const onPressTitleBox = () => {
        setForm(previousState => {
            return {
                ...previousState,
                selectedID: 'FORM-1',
            };
        });
    };

    return (
        <Pressable style={styles.container} onPress={onPressTitleBox}>
            {isSelected && <View style={styles.selectedMark} />}
            <View style={styles.topMark} />
            <View style={styles.padding}>
                {isSelected ? (
                    <MultiLineInput
                        type={INPUT_TYPE.Title}
                        placeholder="설문지 제목"
                        value={title}
                        onChangeText={setTitle}
                    />
                ) : (
                    <Text style={styles.title}>{title}</Text>
                )}
                {isSelected ? (
                    <MultiLineInput
                        type={INPUT_TYPE.Description}
                        placeholder="설문지 설명"
                        value={description}
                        onChangeText={setDescription}
                    />
                ) : (
                    <Text style={styles.description}>{description}</Text>
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
