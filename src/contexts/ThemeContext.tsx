import { createContext, ReactNode, useContext } from 'react';

import { colors } from 'constant/colors';

import { useColorScheme } from './ColorSchemeContext';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    colors: typeof colors.light;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    colors: colors.light,
    isDarkMode: false,
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { colorScheme } = useColorScheme();

    const isDarkMode = colorScheme === 'dark';

    const currentColors = isDarkMode ? colors.dark : colors.light;

    const contextValue: ThemeContextType = {
        colors: currentColors,
        isDarkMode,
    };

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
