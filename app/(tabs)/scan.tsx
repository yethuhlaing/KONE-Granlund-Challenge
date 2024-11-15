import { CameraCapturedPicture, CameraPictureOptions, CameraView, FlashMode, useCameraPermissions, CameraType, Camera } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { analyzeImage, capitalize, extractData, extractLastSerialNumber } from '../../libs/helper';
import Card from 'components/Card';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Feather, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { keyIconMap } from 'constants/constant';
import Toast from 'react-native-root-toast';
import { useSQLiteContext } from 'expo-sqlite';

export default function ScanPage() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | undefined >(undefined)
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
        guid: ''
      });
    const [startCamera, setStartCamera] = useState(true)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [flashMode, setFlashMode] = useState<FlashMode | undefined>('off')
    const db = useSQLiteContext();


    const updateField = (key: any, value: any) => {
        setResult((prevResult: any) => ({
          ...prevResult,
          [key]: value
        }))
    }
    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View className='flex-1 justify-center'>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const __startCamera = async () => {
        setCapturedImage(undefined)
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
            guid: ''
          })
        const { status } = await Camera.requestCameraPermissionsAsync()
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }

    const __takePicture = async () => {
        setCapturedImage(undefined)
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
            guid: ''
          })
        if (cameraRef.current) {
            const options: CameraPictureOptions = {
                quality: 0.5,
                base64: false
            }
            try {
                const photo = await cameraRef.current.takePictureAsync(options);
                console.log(photo?.uri);
                setCapturedImage(photo);
                setPreviewVisible(true)

            } catch (error) {
                console.log(error)
            }
        }

    }
    const __choosePicture = async () => { 
        const response = await analyzeImage(capturedImage?.uri)
        if (response.success == true) {
            setStartCamera(false)
            setResult(response.data)
            console.log(response.data)
        } else {
            Toast.show(response?.error as string, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }
    }
    const __retakePicture = () => {
        console.log("Retake")
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    const __switchCamera = () => {
        if (facing === 'back') {
            setFacing('front')
        } else {
            setFacing('back')
        }
    }
    const __insertData = async () => {
        if (result) {
            db.runSync('INSERT INTO equipment (equipmentName, location, manufacturer, model, serialNumber, equipmentType, size, age, material, condition, surveyorComments, guid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
                result.guid
                );
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
                guid: ''
                })
            Toast.show("Successfully Added!", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });    
        }
    }
    return (
        <View className="flex-1">
            {startCamera ? (
                <View className="flex-1 w-full">
                    {previewVisible && capturedImage ? (
                        <CameraPreview photo={capturedImage} choosePicture={__choosePicture} retakePicture={__retakePicture} />
                    ) : (
                        <CameraView facing={facing} flash={flashMode} ref={cameraRef} className='flex-1'>
                            <CameraScreen __handleFlashMode={__handleFlashMode} __switchCamera={__switchCamera}  __takePicture={__takePicture} facing={facing} />
                        </CameraView>
                    )}
                </View>
            ) : (
                <View className="bg-[#ffffff] items-center space-y-5 p-4">
                    <View className='flex flex-row space-x-3'>
                        <TouchableOpacity onPress={__startCamera} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                            <View className='flex flex-row justify-center items-center space-x-2'>
                                <Text className="text-neutral-50 font-bold text-center">Back</Text>
                                <FontAwesome name='rotate-left' size={16} color="white" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={__insertData} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                            <View className='flex flex-row justify-center items-center space-x-2'>
                                <Text className="text-neutral-50 font-bold text-center">
                                    Insert
                                </Text>
                                <FontAwesome name='database' size={16} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
                        <ScrollView className='w-screen mb-16'>
                            {
                                result && Object.keys(result).length > 0 && (
                                    Object.entries(result).map(([key, value]) => (
                                        <View key={key}>
                                            <Card>
                                                <View className='flex-row justify-between'>
                                                    <View className='flex-row items-center'>
                                                        <FontAwesome name={keyIconMap[key] as any} size={20} style={{ marginRight: 10 }} color={"#1B55F5"} />
                                                        <Text className='font-bold text-lg pr-2'>{capitalize(key.replace(/_/g, ' '))}</Text>
                                                    </View>
                                                    <TextInput
                                                        value={value || ''}
                                                        onChangeText={(text) => updateField(key, text)}
                                                        placeholder={`Enter ${key}`}
                                                        className="p-2 border rounded w-[45%]"
                                                        />
                                                </View>
                                            </Card>
                                        </View>
                                    ))
                                ) 
                            } 
                        </ScrollView>
                    </KeyboardAvoidingView>


                </View>
            )
            
                // (                    
                //     result?.length ?
                //     (
                //         <View className="bg-[#ffffff] items-center space-y-5 p-4">
                //             <View className='flex flex-row space-x-3'>
                //                 <TouchableOpacity onPress={__startCamera} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                //                     <View className='flex flex-row justify-center items-center space-x-2'>
                //                         <Text className="text-neutral-50 font-bold text-center">Back</Text>
                //                         <FontAwesome name='rotate-left' size={16} color="white" />
                //                     </View>
                //                 </TouchableOpacity>
                //                 {/* <TouchableOpacity onPress={__searchSerialNumber} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                
                //                     <View className='flex flex-row justify-center items-center space-x-2'>
                //                         <Text className="text-neutral-50 font-bold text-center">
                //                             Search
                //                         </Text>                        
                //                         <FontAwesome name='database' size={16} color="white" />
                //                     </View>
                //                 </TouchableOpacity> */}
                //             </View>
                //             <View>
                //                 <Text className="text-center text-[#15803d] p-3">
                //                     Last Serial Number - {result}
                //                 </Text>
                            
                    
                //                 {/* <ScrollView className='w-screen mb-10'>
                //                     {
                //                         generalResult && Object.keys(generalResult).length > 0 && (
                //                             Object.entries(generalResult).map(([key, value]) => (
                //                                 <View key={key}>
                //                                     <Card>
                //                                         <View className='flex-row items-center'>
                //                                             <FontAwesome name={keyIconMap[key] as any} size={20} style={{ marginRight: 10 }} color={"#1B55F5"} />
                //                                             <Text className='font-bold text-lg'>{capitalize(key.replace(/_/g, ' '))}</Text>
                //                                         </View>
                //                                         <Text className='text-sm p-2'>{value?.toString()}</Text>
                //                                     </Card>
                //                                 </View>
                //                             ))
                //                         ) 
                //                     } 
                //                 </ScrollView> */}
                //             </View>
                //         </View>
                //     ) :
                //     (
                //         <ScanNotFound __startCamera={__startCamera} />
                //     )
                       
                // )
            }
        </View>
    );
}


const CameraPreview = ({ photo, retakePicture, choosePicture }: any) => {
    return (
        <View className="bg-transparent flex-1 w-full h-full">
            <ImageBackground source={{ uri: photo && photo.uri }} className="flex-1">
                <View className="flex-1 flex-col p-3 justify-end">
                    <View className="flex-row justify-between gap-4">
                        <TouchableOpacity onPress={retakePicture} className="flex-1 h-10 items-center rounded bg-primary justify-center">
                            <View className='flex flex-row justify-center items-center space-x-2'>
                                <Text className="text-neutral-50 text-lg">
                                    Retake
                                </Text>
                                <FontAwesome name='retweet' size={24 } color="white" />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={choosePicture} className="flex-1 h-10 items-center rounded bg-primary justify-center">
                            <View className='flex flex-row justify-center items-center space-x-2'>
                                <Text className="text-neutral-50 text-lg">
                                    Choose
                                </Text>
                                <Feather name="arrow-right-circle" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
const CameraScreen = ({ __handleFlashMode, __switchCamera, __exitCamera, __takePicture , facing} : any) => {
    return (
        <View className="flex-1 w-full bg-transparent">
            <View className="flex flex-row justify-between p-5">
                <TouchableOpacity onPress={__handleFlashMode} className='h-10'>
                    <Text className="text-lg">
                        <FontAwesome name="bolt" size={30} color="white" />
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={__switchCamera} className='flex'>
                    <Text className="text-lg">
                        <FontAwesome6 name="camera-rotate" size={24} color="white" />                    
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="absolute bottom-0 flex-row flex-1 w-full p-5 justify-between">
                <View className="self-center flex-1 items-center">
                    <TouchableOpacity
                        onPress={__takePicture}
                        style={{
                            width: 70,
                            height: 70,
                            bottom: 0,
                            borderRadius: 50,
                            backgroundColor: '#fff'
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

function ScanFound({ lastSerialNumber, __startCamera }: any) {
    
    const [generalResult, setGeneralResult] = useState(undefined)

    const __searchSerialNumber = async () => {
        console.log(generalResult)
    }
    return (
        <View className="bg-[#ffffff] items-center space-y-5 p-4">
            <View className='flex flex-row space-x-3'>
                <TouchableOpacity onPress={__startCamera} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                    <View className='flex flex-row justify-center items-center space-x-2'>
                        <Text className="text-neutral-50 font-bold text-center">Back</Text>
                        <FontAwesome name='rotate-left' size={16} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={__searchSerialNumber} className="flex-1 rounded bg-primary flex-row justify-center items-center h-10">
                    <View className='flex flex-row justify-center items-center space-x-2'>
                        <Text className="text-neutral-50 font-bold text-center">
                            Search
                        </Text>                        
                        <FontAwesome name='database' size={16} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Text className="text-center text-[#15803d] p-3">
                    Last Serial Number - {lastSerialNumber}
                </Text>
            
  
                <ScrollView className='w-screen mb-10'>
                    {
                        generalResult && Object.keys(generalResult).length > 0 && (
                            Object.entries(generalResult).map(([key, value]) => (
                                <View key={key}>
                                    <Card>
                                        <View className='flex-row items-center'>
                                            <FontAwesome name={keyIconMap[key] as any} size={20} style={{ marginRight: 10 }} color={"#1B55F5"} />
                                            <Text className='font-bold text-lg'>{capitalize(key.replace(/_/g, ' '))}</Text>
                                        </View>
                                        <Text className='text-sm p-2'>{value?.toString()}</Text>
                                    </Card>
                                </View>
                            ))
                        ) 
                    } 
                </ScrollView>
            </View>
        </View>
    )
}

function ScanNotFound({ __startCamera }: any) {
    return (
        <View className='flex-1 bg-[#ffffff] items-center space-y-5'>
            <View className='flex flex-row space-x-5'>
                <TouchableOpacity onPress={__startCamera} className="w-36 mt-10 rounded bg-primary flex-row justify-center items-center h-10">
                    <View className='flex flex-row justify-center items-center space-x-2'>
                        <Text className="text-neutral-50 font-bold text-center">Scan Again</Text>
                        <Ionicons name="scan" size={18} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            <Text className='text-primary'>
                Serial Number not Captured!
            </Text>
        </View>
    )
}