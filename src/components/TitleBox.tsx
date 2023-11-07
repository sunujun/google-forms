import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import MultiLineInput, { INPUT_TYPE } from './MultiLineInput';

const TitleBox = () => {
    const [title, setTitle] = useState('제목 없는 설문지');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (title === '') {
                setTitle('제목 없는 설문지');
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [title]);

    return (
        <Pressable style={styles.container}>
            {/* <View style={styles.selectedMark} /> */}
            <View style={styles.topMark} />
            <View style={styles.padding}>
                <MultiLineInput
                    type={INPUT_TYPE.Title}
                    placeholder="설문지 제목"
                    value={title}
                    onChangeText={setTitle}
                />
                <MultiLineInput
                    type={INPUT_TYPE.Description}
                    placeholder="설문지 설명"
                    value={description}
                    onChangeText={setDescription}
                />
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
        borderRadius: 8,
        minHeight: 28,
    },
    topMark: {
        backgroundColor: '#673AB7',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        height: 10,
        position: 'absolute',
        width: '100%',
    },
    selectedMark: {
        backgroundColor: '#4285F4',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        width: 6,
        position: 'absolute',
        height: '100%',
    },
    padding: {
        padding: 24,
        paddingTop: 22,
    },
});

export default TitleBox;
