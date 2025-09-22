import { View, Text, TouchableOpacity,Animated,Dimensions,Modal,StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useState, useRef } from "react";



type RootStackParamList = {
  Home: undefined;
  Registration: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TopNav() {
    const navigation = useNavigation<NavigationProp>();
    const [isPanelVisible, setPanelVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(Dimensions.get("window").width)).current;

      const togglePanel = () => {
        if (isPanelVisible) {
            // slide out
            Animated.timing(slideAnim, {
                toValue: Dimensions.get("window").width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setPanelVisible(false));
        } else {
            setPanelVisible(true);
            // slide in
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <>
            {/* Navbar */}
            <View className="flex-row justify-between items-center bg-white px-4 py-3 shadow-md">
                <Text className="text-lg font-bold">TPB App</Text>

                {/* Hamburger Icon */}
                <TouchableOpacity onPress={togglePanel}>
                <Ionicons name="menu-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>

            {/* Slide Panel Modal */}
            <Modal transparent visible={isPanelVisible} animationType="none">
                {/* Overlay background */}
                <TouchableOpacity style={styles.overlay} onPress={togglePanel} />

                {/* Sliding panel */}
                <Animated.View
                style={[
                    styles.panel,
                    { transform: [{ translateX: slideAnim }] },
                ]}
                >
                {/* Close button */}
                <TouchableOpacity onPress={togglePanel} style={{ marginBottom: 20 }}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>

                {/* Horizontal Row */}
                <View className="flex-1 items-center gap-y-4">
                    <TouchableOpacity>
                    <Text className="text-blue-500 font-semibold text-xl">Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text
                        className="text-blue-500 font-semibold text-xl"
                        onPress={() => {
                            togglePanel();
                            navigation.navigate("Registration");
                        }}>
                            Register Device
                        </Text>
                    </TouchableOpacity>
                </View>
                </Animated.View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // dimmed background
  },
  panel: {
    position: "absolute",
    top: 0,
    right: 0, 
    height: "100%",
    width: "40%",
    backgroundColor: "white",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});