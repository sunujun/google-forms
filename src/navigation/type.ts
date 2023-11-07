import { StackScreenProps } from '@react-navigation/stack';

export type RootStackParamList = {
    MakeForm: undefined;
    PreviewForm: undefined;
};

export type RootStackScreenProps<RouteName extends keyof RootStackParamList> = StackScreenProps<
    RootStackParamList,
    RouteName
>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
