import DraggableFlatList from 'react-native-draggable-flatlist';
import listenToKeyboardEvents from 'react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC';

const config = {
    enableOnAndroid: true,
    enableAutomaticScroll: true,
    extraHeight: 200,
    enableResetScrollToCoords: false,
    contentContainerStyle: undefined,
    extraScrollHeight: 0,
    keyboardOpeningTime: 250,
    viewIsInsideTabBar: false,
};

export default listenToKeyboardEvents(config)(DraggableFlatList);
