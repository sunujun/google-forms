import { AnswerID, ChoiceItemID } from 'constant';

export interface IOption {
    id: string;
    type: ChoiceItemID;
    label: string;
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

export interface IForm {
    id: string;
    title: string;
    description: string;
    questionList: IQuestion[];
    selectedID: string;
    focusInputID?: string;
}

export interface IFlatList {
    textInputPositionY: number;
    textInputHeight: number;
}
