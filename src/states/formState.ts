import { atom } from 'recoil';

export interface IForm {
    id: string;
    title: string;
    description: string;
    questionList: IQuestion[];
}

export interface IQuestion {
    id: string;
    type: string;
    question: string;
    choice?: IChoice[];
}

export interface IChoice {
    id: string;
    label: string;
}

export const FormState = atom<IForm>({
    key: 'FORM',
    default: {
        id: 'FORM-1',
        title: '제목 없는 설문지',
        description: '',
        questionList: [],
    },
});
