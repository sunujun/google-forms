export const colors = {
    // 라이트 테마 색상
    light: {
        // 기본 배경색
        background: '#F0EBF8',
        cardBackground: '#FFFFFF',

        // 텍스트 색상
        textPrimary: '#202124',
        textSecondary: '#5F6368',
        textHint: '#70757A',
        textDisabled: '#DADCE0',

        // 테두리 및 구분선
        border: '#DADCE0',
        divider: '#DADCE0',

        // 강조 및 버튼 색상
        primary: '#673AB7',
        primaryDark: '#5E35B1',
        primaryLight: '#D1C4E9',
        accent: '#4285F4',
        etc: '#1A73E8',

        // 상태 색상
        error: '#D93025',
        success: '#34A853',
        warning: '#FBBC05',
        info: '#4285F4',

        // 입력 필드
        inputBackground: '#F8F9FA',
        inputBorder: '#DADCE0',
        inputFocused: '#673AB7',

        // 아이콘 색상
        iconPrimary: '#5F6368',
        iconSelected: '#673AB7',
        iconDisabled: '#BDBDBD',

        // 특수 요소
        floatingButton: '#673AB7',
        selectedMark: '#4285F4',
        topMark: '#673AB7',

        // 그림자
        shadow: '#000000',
    },

    // 다크 테마 색상
    dark: {
        // 기본 배경색
        background: '#121212',
        cardBackground: '#1E1E1E',

        // 텍스트 색상
        textPrimary: '#E0E0E0',
        textSecondary: '#B0B0B0',
        textHint: '#909090',
        textDisabled: '#606060',

        // 테두리 및 구분선
        border: '#3C3C3C',
        divider: '#3C3C3C',

        // 강조 및 버튼 색상
        primary: '#BB86FC',
        primaryDark: '#9965F4',
        primaryLight: '#E8DAFF',
        accent: '#03DAC6',
        etc: '#4DA3FF',

        // 상태 색상
        error: '#CF6679',
        success: '#4CAF50',
        warning: '#FB8C00',
        info: '#2196F3',

        // 입력 필드
        inputBackground: '#2C2C2C',
        inputBorder: '#3C3C3C',
        inputFocused: '#BB86FC',

        // 아이콘 색상
        iconPrimary: '#B0B0B0',
        iconSelected: '#BB86FC',
        iconDisabled: '#505050',

        // 특수 요소
        floatingButton: '#BB86FC',
        selectedMark: '#03DAC6',
        topMark: '#BB86FC',

        // 그림자
        shadow: '#000000',
    },
};

export type ColorTheme = typeof colors.light;
