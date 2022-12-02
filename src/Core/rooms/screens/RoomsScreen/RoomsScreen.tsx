import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useTheme } from 'dopenative'
import { LeavesBackground } from '../../../../components/LeavesBackground'
import { useConfig } from '../../../../config'
import RoomCard from '../../components/RoomCard'
import { chunk } from 'lodash'

const RoomsScreen = () => {
  const { theme, appearance } = useTheme()
  const colorSet = theme.colors[appearance]

  const styles = dynamicStyles(colorSet)

  const rooms = useConfig().rooms

  const restOfRoomsInSections = chunk(rooms.slice(1), 2)

  return (
    <View style={styles.container}>
      <LeavesBackground />
      <ScrollView contentContainerStyle={{ padding: 4 }}>
        <View style={styles.columnWrapper}>
          <RoomCard {...rooms[0]} first />
        </View>
        {restOfRoomsInSections.map((chunk, index) => (
          <View style={styles.columnWrapper} key={index}>
            {chunk.map(room => (
              <RoomCard key={room.id} {...room} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const dynamicStyles = colorSet => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.primaryBackground,
    },
    columnWrapper: {
      flexDirection: 'row',
      width: '100%',
    },
  })
}

export default RoomsScreen
