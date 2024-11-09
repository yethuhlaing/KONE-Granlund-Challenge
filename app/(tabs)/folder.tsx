import { View, Text, TouchableOpacity, Image, ScrollView, ImageSourcePropType, ActivityIndicator, TextInput } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { analyzeImage, capitalize, extractData, extractLastSerialNumber } from '../../libs/helper';
import Card from 'components/Card';
import { FontAwesome } from '@expo/vector-icons';
import { keyIconMap } from 'constants/constant';
import Toast from 'react-native-root-toast';
import {  getAllData } from '../../database/db'; // Adjust the path as needed
import * as SQLite from 'expo-sqlite';

export default function folder() {
    const [capturedImage, setCapturedImage] = useState< undefined | ImagePicker.ImagePickerAsset>(undefined)
    const db = SQLite.useSQLiteContext();
    const [result, setResult] = useState({
        equipmentName: '',
        location: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        equipmentType: '',
        size: '',
        age: '',
        material: '',
        condition: '',
        surveyorComments: '',
      });
    const [loading, setLoading] = useState(false);
    const updateField = (key: any, value: any) => {
        setResult((prevResult: any) => ({
          ...prevResult,
          [key]: value
        }))
    }
    const insertInventory = () => {
        if (result) {
            try {
                    const da = db.runAsync(
                        'INSERT INTO equipment (equipmentName, location, manufacturer, model, serialNumber, equipmentType, size, age, material, condition, surveyorComments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [
                            result.equipmentName,
                            result.location,
                            result.manufacturer,
                            result.model,
                            result.serialNumber,
                            result.equipmentType,
                            result.size,
                            result.age,
                            result.material,
                            result.condition,
                            result.surveyorComments,
                        ]);
                        console.log(da.lastInsertRowId, da.changes);
                
                    
            } catch (error) {
                console.log(error)
            }
        }
    }
    const __pickImage = async () => {
        try {
            setLoading(true);
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setCapturedImage(result.assets[0]);
                setResult({
                    equipmentName: '',
                    location: '',
                    manufacturer: '',
                    model: '',
                    serialNumber: '',
                    equipmentType: '',
                    size: '',
                    age: '',
                    material: '',
                    condition: '',
                    surveyorComments: '',
                })
                const response = await analyzeImage(result.assets[0].uri)
                if (response.success) {
                    setResult(response.data)
                    console.log(response.data)
                } else{
                    Toast.show(response?.error as string, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.TOP,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            }else {
                Toast.show('Image picking was canceled', {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.TOP,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            }
        } catch (error: any) {
            Toast.show(error?.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        } finally {
            setLoading(false);
        }

    };

    return (
        <View className='flex-1 bg-[#ffffff] items-center space-y-5 p-4'>
            <View className='flex flex-row justify-center items-center gap-3'>
                <TouchableOpacity onPress={__pickImage} className="flex-1 rounded bg-[#1b55f5] flex-row justify-center items-center h-10">

                    <View className='flex flex-row justify-center items-center space-x-2 '>
                        <Text className="text-neutral-50 font-bold text-center">
                            Import
                        </Text>
                        <FontAwesome name='file' size={16} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={insertInventory} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                    <View className='flex flex-row justify-center items-center space-x-2'>
                        <Text className="text-neutral-50 font-bold text-center">
                            Insert
                        </Text>
                        <FontAwesome name='database' size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            {
                loading ? (
                    <ActivityIndicator size="large" color="#2f95dc" />
                ): (
                    <View>
                        <ScrollView className='w-screen mb-10'>
                            {
                                result && Object.keys(result).length > 0 && (
                                    Object.entries(result).map(([key, value]) => (
                                        <View key={key}>
                                            <Card>
                                                <View className='flex-row items-center'>
                                                    <FontAwesome name={keyIconMap[key] as any} size={20} style={{ marginRight: 10 }} color={"#1B55F5"} />
                                                    <Text className='font-bold text-lg pr-2'>{capitalize(key.replace(/_/g, ' '))}</Text>
                                                    <TextInput
                                                        value={value || ''}
                                                        onChangeText={(text) => updateField(key, text)}
                                                        placeholder={`Enter ${key}`}
                                                        className="p-2 border rounded"
                                                        />
                                                </View>
                                            </Card>
                                        </View>
                                    ))
                                ) 
                            } 
                        </ScrollView>
                    </View>
                )
            }

            
        </View>
    )
}