import { createContext, ReactNode, useContext, useReducer } from 'react';

import { IForm, IQuestion } from 'types/form';

// 초기 상태
const initialFormState: IForm = {
    id: 'FORM-1',
    title: '제목 없는 설문지',
    description: '',
    questionList: [],
    selectedID: 'FORM-1',
    focusInputID: undefined,
};

// 액션 타입들
type FormAction =
    | { type: 'UPDATE_FORM'; payload: Partial<IForm> }
    | { type: 'UPDATE_TITLE'; payload: string }
    | { type: 'UPDATE_DESCRIPTION'; payload: string }
    | { type: 'UPDATE_SELECTED_ID'; payload: string }
    | { type: 'UPDATE_FOCUS_INPUT_ID'; payload: string | undefined }
    | { type: 'UPDATE_QUESTION_LIST'; payload: IQuestion[] }
    | { type: 'UPDATE_QUESTION_BY_ID'; payload: { id: string; question: Partial<IQuestion> } }
    | { type: 'RESET_ANSWERS' };

// 리듀서 함수
function formReducer(state: IForm, action: FormAction): IForm {
    switch (action.type) {
        case 'UPDATE_FORM':
            return { ...state, ...action.payload };
        case 'UPDATE_TITLE':
            return { ...state, title: action.payload };
        case 'UPDATE_DESCRIPTION':
            return { ...state, description: action.payload };
        case 'UPDATE_SELECTED_ID':
            return { ...state, selectedID: action.payload };
        case 'UPDATE_FOCUS_INPUT_ID':
            return { ...state, focusInputID: action.payload };
        case 'UPDATE_QUESTION_LIST':
            return { ...state, questionList: action.payload };
        case 'UPDATE_QUESTION_BY_ID':
            const { id, question } = action.payload;
            return {
                ...state,
                questionList: state.questionList.map(q => (q.id === id ? { ...q, ...question } : q)),
            };
        case 'RESET_ANSWERS':
            // 모든 질문의 답변 상태 초기화
            return {
                ...state,
                questionList: state.questionList.map(question => ({
                    ...question,
                    writeAnswer: '',
                    choiceAnswer: '',
                    checkAnswer: [],
                    checkIsRequired: false,
                })),
            };
        default:
            return state;
    }
}

// Context 인터페이스
interface FormContextType {
    formState: IForm;
    dispatch: React.Dispatch<FormAction>;
}

// Context 생성
const FormContext = createContext<FormContextType | undefined>(undefined);

// Context Provider 컴포넌트
export function FormProvider({ children }: { children: ReactNode }) {
    const [formState, dispatch] = useReducer(formReducer, initialFormState);

    return <FormContext.Provider value={{ formState, dispatch }}>{children}</FormContext.Provider>;
}

// Custom Hook
export function useFormContext() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}
