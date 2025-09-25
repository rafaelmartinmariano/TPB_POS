import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerDeviceApi, syncProductsApi } from '../api/device';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { registerDevice as saveDeviceToDB, getAllDevices, initDatabase, closeDBConnection } from '../database/db';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { useDeviceRegistration } from '../hooks/useDeviceRegistration';

type RootStackParamList = {
    Registration: undefined;
    Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;

export default function RegistrationScreen() {
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [deviceRegistered, setDeviceRegistered] = useState<boolean>(false);

    const navigation = useNavigation<NavigationProp>();

    //check if the device is already registered and not yet expired
    const { isRegistered } = useDeviceRegistration();

    const handleRegisterDevice = async () => {
        console.log("inside handle reg");

        if (!token.trim()) {
            Alert.alert('Error', 'Please enter token.');
            return;
        }

        setLoading(true);

        let db: SQLiteDatabase | null = null;
        try {
            console.log("inside try");
            const imei = await DeviceInfo.getUniqueId();

            // Register in Laravel API
            const device = await registerDeviceApi(imei, token);

            console.log(device);

            Alert.alert('Success', 'Device registered successfully');

            // Save in SQLite
            //const db = await getDBConnection();
            db = await initDatabase();
            console.log("Saving to SQLite:", { imei, token });
            await saveDeviceToDB(db, imei, token);

            // ✅ Fetch and check
            const devices = await getAllDevices(db);
            console.log("Local devices:", devices);
            Alert.alert("Local DB", JSON.stringify(devices));

            setDeviceRegistered(true);

            // Optionally navigate to Products
            navigation.navigate('Home');

        } catch (error: any) {
            console.log("inside catch");
            Alert.alert('Error', error.message || 'Something went wrong.');
        } finally {
            console.log("inside finally");
            console.log(db);
            if (db) {
                await closeDBConnection(db); // 🔑 close here
                console.log("DB closed");
            }
            setLoading(false);
        }
    };

    const syncData = async () => {
        try {
            const deviceId = await AsyncStorage.getItem('device_id');
            if (!deviceId) {
                Alert.alert('Error', 'Device not registered.');
                return;
            }

            const products = await syncProductsApi(Number(deviceId));

            await AsyncStorage.setItem('products', JSON.stringify(products));
            Alert.alert('Success', 'Data synced successfully.');
        } catch (error: any) {
            Alert.alert('Error', 'Failed to sync data.');
        }
    };


    console.log("RS.TSX isRegistered: ", isRegistered);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistered ? 'Device already registered' : 'Device Registration'}</Text>

            {
                isRegistered ?
                    ""
                    :
                    (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter token"
                            value={token}
                            onChangeText={setToken}
                            autoCapitalize="none"
                        />
                    )
            }

            {
                isRegistered ?
                    ""
                    :
                    (
                        <Button
                            title={loading ? 'Registering...' : 'Register Now'}
                            onPress={handleRegisterDevice}
                            disabled={loading}
                        />
                    )
            }





            {deviceRegistered && (
                <View style={{ marginTop: 20 }}>
                    <Button title="Sync Data" onPress={syncData} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});