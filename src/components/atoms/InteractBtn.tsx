import React from "react";
import {
    TouchableOpacity,
    StyleSheet
} from "react-native";

type Props = {
    name: string,
    onPressFn: () => void
}

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const InteractBtn = ({ name, onPressFn }: Props) => {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPressFn}>
            <MaterialIcons
                name={name}
                size={28}
                color="#fff"
                style={name === "share" ? styles.iconShare : undefined}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        backgroundColor: "#F44336",
        borderRadius: 28,
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    iconShare: {
        alignSelf: "flex-start",
        marginLeft: 12, 
    },
});