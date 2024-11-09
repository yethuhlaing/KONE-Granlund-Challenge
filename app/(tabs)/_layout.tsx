import React, { Suspense, useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { ActivityIndicator, Text, View, Pressable, Image } from 'react-native';
// import { Asset } from 'expo-asset';
// import * as FileSystem from 'expo-file-system'
// import * as DocumentPicker from 'expo-document-picker';
// import * as Sharing from 'expo-sharing';
// import { DEFAULTDATABASE } from 'constants/constant';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
// const loadDatabase = async () => {
//     const dbName = "motor_database.db.db";
//     const dbAsset = require("../../assets/database/motor_database.db");
//     const dbUri = Asset.fromModule(dbAsset).uri;
//     const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

//     const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
//     if (!fileInfo.exists) {
//         await FileSystem.makeDirectoryAsync(
//             `${FileSystem.documentDirectory}SQLite`,
//             { intermediates: true }
//         );
//         await FileSystem.downloadAsync(dbUri, dbFilePath);
//     }
//     console.log(fileInfo)
// };

export default function TabLayout() {
    // const [dbLoaded, setDbLoaded] = useState(false)


    // useEffect(() => {
    //     loadDatabase()
    //         .then(() => setDbLoaded(true))
    //         .catch((e) => console.error(e))
    // }, [])

    // if (!dbLoaded) {
    //     return (
    //         <View>
    //             <ActivityIndicator size={"large"} />
    //             <Text>Loading Database ...</Text>
    //         </View>
    //     )
    // }
    return (
        <Suspense fallback={
            <View>
                <ActivityIndicator size={"large"} />
                <Text className='text-center'>Loading Database ...</Text>
            </View>
        }>
                <Tabs>
                    <Tabs.Screen
                        name="scan"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon name="camera" color={color} />
                            ),
                            headerTitle: (props) => <Image source={require('../../assets/images/KONE_logo.png')} className='w-24 h-10'/>,
                            tabBarActiveTintColor: "#1B55F5",
                            headerRight: () => (
                                <Link href="/(modals)/modal" asChild>
                                    <Pressable>
                                        {({ pressed }) => (
                                            <FontAwesome
                                                name="bars"
                                                size={25}
                                                style={{
                                                    marginRight: 15,
                                                    opacity: pressed ? 0.5 : 1,
                                                    color: "#1B55F5"
                                                }}
                                            />
                                        )}
                                    </Pressable>
                                </Link>
                            ),

                        }}
                    />
                    <Tabs.Screen
                        name="folder"
                        options={{
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon name="folder" color={color} />
                            ),
                            tabBarActiveTintColor: "#1B55F5",
                            headerTitle: (props) => <Image source={require('../../assets/images/KONE_logo.png')} className='w-24 h-10' />,
                            headerRight: () => (
                                <Link href="/(modals)/modal" asChild>
                                    <Pressable>
                                        {({ pressed }) => (
                                            <FontAwesome
                                                name="bars"
                                                size={25}
                                                style={{
                                                    marginRight: 15,
                                                    opacity: pressed ? 0.5 : 1,
                                                    color: "#1B55F5"
                                                }}
                                            />
                                        )}
                                    </Pressable>
                                </Link>
                            ),
                        }}
                    />
                </Tabs>

        </Suspense>

    );
}
