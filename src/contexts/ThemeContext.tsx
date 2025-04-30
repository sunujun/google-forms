import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { colors } from 'constant/colors';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: ThemeType;
    isDarkMode: boolean;
    setTheme: (theme: ThemeType) => void;
    colors: typeof colors.light;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'system',
    isDarkMode: true,
    setTheme: () => {},
    colors: colors.dark,
});

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();

    const [theme, setTheme] = useState<ThemeType>('system');

    const isDarkMode = useMemo(() => {
        if (theme === 'system') {
            return systemColorScheme === 'dark';
        }
        return theme === 'dark';
    }, [theme, systemColorScheme]);

    const currentColors = isDarkMode ? colors.dark : colors.light;

    const contextValue: ThemeContextType = {
        theme,
        isDarkMode,
        setTheme,
        colors: currentColors,
    };

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
