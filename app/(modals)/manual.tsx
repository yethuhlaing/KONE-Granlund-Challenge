import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function UserManual(){
    return (
        <ScrollView className="flex-1 p-4 bg-[#ffffff]">
            <Text className="text-2xl font-bold mb-4 text-[#1b55f5]">User Manual</Text>

            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Scan</Text>
                <Text className="text-base leading-6 text-gray-800">
                    In the scan tab, you can scan using your device's camera. You have the option to turn on the flash with a flash button, switch between the front and rear cameras, and capture an image.
                    After capturing the image, a preview screen will be displayed where you can either retake the image.
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-xl font-bold mb-2">Folder</Text>
                <Text className="text-base leading-6 text-gray-800">
                    In the folder tab, you can upload an image file, crop it if needed, and extract the insightful information from the image. The extracted data will then be displayed on the screen.
                </Text>
            </View>
        </ScrollView>
    );
};
