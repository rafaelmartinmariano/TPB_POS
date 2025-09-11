import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    onPress?: () => void;
};

const MenuButton = ({ title, onPress }: Props) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#03dac6",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        color: "#000",
    },
});

export default MenuButton;