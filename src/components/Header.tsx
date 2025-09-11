import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>TPB POS</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: "#6200ee",
    },
    headerText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default Header;