import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { MinusIcon, PlusIcon } from "react-native-heroicons/outline";


const DishRow = ({item}) => {
  return (
    <View className='flex-row items-center bg-white'>
      {/* <Text>{item.name}</Text> */}
      <Image source={item.image} style={{height: 100, width: 100}}/>
      <View className='flex flex-1 space-y-3'>
        <View className='pl-3'>
          <Text className='text-xl'>{item.name}</Text>
          <Text className='text-xl'>{item.description}</Text>
        </View>
        <View className='flex-row justify-between items-center pl-3'>
          <Text className='text-lg font-bold text-gray-700'>{item.price} đ</Text>
          <View className='flex-row items-center'>
            <TouchableOpacity className='p-1 rounded-full'>
              <MinusIcon strokeWidth={2} height={20} width={20} stroke={'black'}/>
            </TouchableOpacity>
            <Text className='px-3'>
              {2}
            </Text>
            <TouchableOpacity className='p-1 rounded-full'>
              <PlusIcon strokeWidth={2} height={20} width={20} stroke={'black'}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default DishRow