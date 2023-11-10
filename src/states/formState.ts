import { atom } from 'recoil';

import { AnswerID, ChoiceItemID } from 'constant';

export interface IForm {
    id: string;
    title: string;
    description: string;
    questionList: IQuestion[];
    selectedID: string;
    focusInputID?: string;
}

export interface IQuestion {
    id: string;
    type: AnswerID;
    question: string;
    optionList: IOption[];
    writeAnswer: string;
    choiceAnswer: string;
    checkAnswer: string[];
    isRequired: boolean;
    checkIsRequired: boolean;
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
        focusInputID: undefined,
    },
});
