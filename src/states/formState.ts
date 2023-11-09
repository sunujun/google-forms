import { atom } from 'recoil';

import { AnswerID, ChoiceItemID } from 'components';

export interface IForm {
    id: string;
    title: string;
    description: string;
    questionList: IQuestion[];
    selectedID: string;
}

export interface IQuestion {
    id: string;
    type: AnswerID;
    question: string;
    optionList: IOption[];
    isRequired: boolean;
}

export interface IOption {
    id: string;
    type: ChoiceItemID;
    label: string;
}

export const formState = atom<IForm>({
    key: 'FORM',
    default: {
        id: 'FORM-1',
        title: '제목 없는 설문지',
        description: '',
        questionList: [],
        selectedID: 'FORM-1',
    },
});
