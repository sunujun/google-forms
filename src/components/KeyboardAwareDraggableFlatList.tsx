import { Platform } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import listenToKeyboardEvents from 'react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC';

const config = {
    enableAutomaticScroll: Platform.OS === 'ios',
    extraHeight: 200,
    enableResetScrollToCoords: false,
    contentContainerStyle: undefined,
    extraScrollHeight: 0,
    keyboardOpeningTime: 250,
    viewIsInsideTabBar: false,
};

export default listenToKeyboardEvents(config)(DraggableFlatList);
