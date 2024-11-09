import { View, Text, Image, TouchableOpacity, Linking, FlatList, Alert } from 'react-native'
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
  guid: string
}
const Home = () => {
  const db = useSQLiteContext();
  const [result, setResult] = useState<inventory[]>([]);
  const [expandedCardId, setExpandedCardId] = useState(''); // Track which card is expanded
  async function setup() {
    const result = await db.getAllAsync<inventory>('SELECT * FROM equipment');
    console.log(result)
    setResult(result);
  }
  useEffect(() => {
    setup();
  }, []);

  const handleRefresh = () => {
    setup();
  }
    // Delete a specific entry
  const handleDelete = (id: string) => {
      Alert.alert(
        'Delete Item',
        'Are you sure you want to delete this item?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteData(id) },
        ]
      );
    };
  const deleteData = (id: string) => {
    // deleteDataById(id, fetchData); // Refresh data after deletion
    const result = db.getAllSync<inventory>('DELETE FROM equipment WHERE id = ?;',[id]);
    setup();
    console.log(result)
  };
  const toggleExpandCard = (id: string) => {
    setExpandedCardId((prevId: string) => (prevId === id ? '' : id));
  };

  const renderCard = ({ item }: { item: inventory}) => {
    const isExpanded = item.id === expandedCardId;

    return (
      <TouchableOpacity
        onPress={() => toggleExpandCard(item.id!)}
        className="bg-white p-4 mb-4 rounded-lg shadow-sm bg-[#F2F0F4]"
      >
        <Text className="text-xl font-bold mb-2">{item.equipmentName}</Text>
        <Text className="text-gray-600">Location: {item.location}</Text>
        <Text className="text-gray-600">Manufacturer: {item.manufacturer}</Text>

        {/* Show more details if the card is expanded */}
        {isExpanded && (
          <View>
            <Text className="text-gray-600">Model: {item.model}</Text>
            <Text className="text-gray-600">Serial Number: {item.serialNumber}</Text>
            <Text className="text-gray-600">Type: {item.equipmentType}</Text>
            <Text className="text-gray-600">Size: {item.size}</Text>
            <Text className="text-gray-600">Age: {item.age}</Text>
            <Text className="text-gray-600">Material: {item.material}</Text>
            <Text className="text-gray-600">Condition: {item.condition}</Text>
            <Text className="text-gray-600">Surveyor Comments: {item.surveyorComments}</Text>
            <Text className="text-gray-600">GUID: {item.guid}</Text>

            {/* Delete Button */}
            <View className="flex-row justify-center mt-4">
              <TouchableOpacity
                className="mt-4 p-2 bg-red-500 rounded-lg bg-[#1B55F5] w-full"
                onPress={() => handleDelete(item.id!)}
              >
                <Text className="text-white text-center font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </TouchableOpacity>
    );
  };

    return (
      <View className='bg-[#ffffff] flex-1 h-screen flex px-6 pb-6'>
        {/* <Text className='text-3xl font-bold'>We engineer tomorrow to build a better future</Text>
        <Text className='text-md mt-3 text-neutral-500'>With leading application know-how, and sustainable innovation, we set out to become our customers’ preferred decarbonization partner, with a focus on long-term value creation for our customers and employees.</Text> */}
        <View className="flex-row justify-center my-4">
          <TouchableOpacity
            className="py-4 bg-red-500 rounded-lg bg-[#1B55F5] w-full"
            onPress={() => handleRefresh()}
          >
            <Text className="text-white text-center font-semibold">Refresh</Text>
          </TouchableOpacity>
        </View>
        <FlatList
        data={result}
        renderItem={renderCard}
        keyExtractor={(item) => item?.id?.toString()!}
        />
      </View>
    )
}

export default Home
