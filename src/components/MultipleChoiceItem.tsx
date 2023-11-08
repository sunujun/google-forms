import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

import { IOption } from 'states';

import SingleLineInput from './SingleLineInput';

export const CHOICE_ITEM_TYPE = {
    Label: 'label',
    ETC: 'etc',
    Add: 'add',
} as const;
export type ChoiceItemID = (typeof CHOICE_ITEM_TYPE)[keyof typeof CHOICE_ITEM_TYPE];

interface MultipleChoiceItemProps {
    item: IOption;
}
const MultipleChoiceItem = ({ item }: MultipleChoiceItemProps) => {
    return (
        <View style={styles.container}>
            <Pressable>
                <Icon name="checkbox-blank-circle-outline" color="#BDBDBD" size={24} />
            </Pressable>
            {item.type === CHOICE_ITEM_TYPE.Label && <SingleLineInput value={item.label} />}
            {item.type === CHOICE_ITEM_TYPE.Add && (
                <View style={styles.addButton}>
                    <Pressable>
                        <Text style={styles.addOptionText}>옵션 추가</Text>
                    </Pressable>
                    <Text style={styles.orText}>또는 </Text>
                    <Pressable>
                        <Text style={styles.etcText}>&apos;기타&apos; 추가</Text>
                    </Pressable>
                </View>
            )}
            {/* <Pressable>
                <Icon name="close" color="#5F6368" size={24} />
            </Pressable> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    addButton: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginLeft: 8,
    },
    addOptionText: {
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        color: '#70757A',
    },
    orText: {
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: '400',
        lineHeight: 20,
        color: '#202124',
        marginLeft: 4,
    },
    etcText: {
        fontSize: 14,
        letterSpacing: 0.25,
        fontWeight: '400',
        lineHeight: 20,
        color: '#1A73E8',
    },
});

export default MultipleChoiceItem;
