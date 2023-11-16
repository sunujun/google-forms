import { atom } from 'recoil';

export interface IFlatList {
    textInputPositionY: number;
    textInputHeight: number;
}

export const flatListState = atom<IFlatList>({
    key: 'FLAT_LIST',
    default: {
        textInputPositionY: 0,
        textInputHeight: 0,
    },
});
