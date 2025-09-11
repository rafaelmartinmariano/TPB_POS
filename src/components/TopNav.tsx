import { View, Text, TouchableOpacity } from "react-native";

export default function TopNav() {
    return (
        <View className="flex-row justify-between items-center bg-white px-4 py-3 shadow-md">
            {/* Logo */}
            <Text className="text-xl font-bold text-black">TPB_POS</Text>

            {/* Login Button */}
            <TouchableOpacity>
                <Text className="text-blue-500 font-semibold">Login</Text>
            </TouchableOpacity>
        </View>
    );
}