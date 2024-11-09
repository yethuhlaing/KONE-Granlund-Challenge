import { View, Text, Image, TouchableOpacity, Linking, FlatList } from 'react-native'
import { Link } from 'expo-router'
import React, { useState, useEffect } from 'react';
import {  getAllData } from 'database/db';
import { useSQLiteContext } from 'expo-sqlite';

type inventory = {
  id?: string,
  equipmentName: string,
  location: string,
  manufacturer: string,
  model: string,
  serialNumber: string,
  equipmentType: string,
  size: string,
  age: string,
  material: string,
  condition: string,
  surveyorComments: string,
}
const Home = () => {
  const db = useSQLiteContext();
  const [result, setResult] = useState<inventory[]>([]);

  useEffect(() => {
    async function setup() {
      const result = await db.getAllSync<inventory>('SELECT * FROM equipment');
      console.log(result)
      setResult(result);
    }
    setup();
  }, []);

  const renderCard = ({ item }: { item: inventory}) => (
    <View className="bg-white p-4 mb-4 rounded-lg shadow-sm">
      <Text className="text-xl font-bold mb-2">{item.equipmentName}</Text>
      <Text className="text-gray-600">Location: {item.location}</Text>
      <Text className="text-gray-600">Manufacturer: {item.manufacturer}</Text>
      <Text className="text-gray-600">Model: {item.model}</Text>
      <Text className="text-gray-600">Serial Number: {item.serialNumber}</Text>
      <Text className="text-gray-600">Type: {item.equipmentType}</Text>
      <Text className="text-gray-600">Size: {item.size}</Text>
      <Text className="text-gray-600">Age: {item.age}</Text>
      <Text className="text-gray-600">Material: {item.material}</Text>
      <Text className="text-gray-600">Condition: {item.condition}</Text>
      <Text className="text-gray-600">Surveyor Comments: {item.surveyorComments}</Text>
    </View>
  );
    return (
      <View className='bg-[#ffffff] flex-1 h-screen flex p-6'>
        {/* <Text className='text-3xl font-bold'>We engineer tomorrow to build a better future</Text>
        <Text className='text-md mt-3 text-neutral-500'>With leading application know-how, and sustainable innovation, we set out to become our customers’ preferred decarbonization partner, with a focus on long-term value creation for our customers and employees.</Text> */}
        <FlatList
        data={result}
        renderItem={renderCard}
        keyExtractor={(item) => item?.id?.toString()!}
        />
      </View>
    )
}

export default Home
