export const INPUT_TYPE = {
    Title: 'title',
    Description: 'Description',
    Question: 'Question',
    Answer: 'Answer',
} as const;
export type InputID = (typeof INPUT_TYPE)[keyof typeof INPUT_TYPE];

export const ANSWER_TYPE = {
    Short: 'short',
    Long: 'long',
    Multiple: 'multiple',
    CheckBox: 'checkBox',
} as const;
export type AnswerID = (typeof ANSWER_TYPE)[keyof typeof ANSWER_TYPE];

export const CHOICE_ITEM_TYPE = {
    Label: 'label',
    ETC: 'etc',
    Add: 'add',
} as const;
export type ChoiceItemID = (typeof CHOICE_ITEM_TYPE)[keyof typeof CHOICE_ITEM_TYPE];
