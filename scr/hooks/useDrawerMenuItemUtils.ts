import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { useCallback } from "react";

export default function useDrawerMenuItemUtils(
    routeName: string,
    masterProps: DrawerContentComponentProps,
): readonly [isFocused: boolean, onPress: () => void] {
    const focusingRoute = masterProps.state.routes[masterProps.state.index];
    const route = masterProps.state.routes.find(r => r.name === routeName)
    const isFocused = route === focusingRoute
    const navigation = masterProps.navigation

    const onPress = useCallback(() => {
        if (!route)
            throw new Error('[useDrawerMenuItemUtils] can not find route: ' + routeName)

        const event = navigation.emit({
            type: 'drawerItemPress',
            target: route.key,
            canPreventDefault: true,
        })

        if (!event.defaultPrevented) {
            navigation.dispatch({
                ...(isFocused
                    ? DrawerActions.closeDrawer()
                    : CommonActions.navigate({ name: route.name, merge: true })),
                target: masterProps.state.key,
            })
        }
    }, [masterProps])

    return [isFocused, onPress] as const
}