import React, { memo } from 'react'
import { FlatList, TouchableOpacity, Text, View, Image } from 'react-native'
import DialogInput from 'react-native-dialog-input'
import { useTheme, useTranslations } from 'dopenative'
import { TNEmptyStateView } from '../../../truly-native'
import IMConversationIconView from '../../IMConversationView/IMConversationIconView/IMConversationIconView'
import dynamicStyles from './styles'

function IMCreateGroupComponent(props) {
  const {
    onCancel,
    isNameDialogVisible,
    friends,
    onSubmitName,
    onCheck,
    onEmptyStatePress,
    onListEndReached,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onCheck(item)}
      style={styles.itemContainer}>
      <View style={styles.chatIconContainer}>
        <IMConversationIconView
          style={styles.photo}
          imageStyle={styles.photo}
          participants={[item]}
        />
        <Text style={styles.name}>{item.firstName}</Text>
      </View>
      <View style={styles.addFlexContainer}>
        {item.checked && (
          <Image style={styles.checked} source={theme.icons.checked} />
        )}
      </View>
      <View style={styles.divider} />
    </TouchableOpacity>
  )

  const emptyStateConfig = {
    title: localized("You can't create groups"),
    description: localized(
      "You don't have enough friends to create groups. Add at least 2 friends to be able to create groups.",
    ),
    buttonName: localized('Go back'),
    onPress: onEmptyStatePress,
  }

  return (
    <View style={styles.container}>
      {friends && friends.length > 1 && (
        <FlatList
          data={friends}
          renderItem={renderItem}
          keyExtractor={item => `${item.id}`}
          initialNumToRender={5}
          removeClippedSubviews={true}
          onListEndReached={onListEndReached}
          onEndReachedThreshold={0.3}
        />
      )}
      {friends && friends.length <= 1 && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
        </View>
      )}
      <DialogInput
        isDialogVisible={isNameDialogVisible}
        title={localized('Type group name')}
        hintInput="Group Name"
        textInputProps={{ selectTextOnFocus: true }}
        submitText="OK"
        submitInput={inputText => {
          onSubmitName(inputText)
        }}
        closeDialog={onCancel}
      />
    </View>
  )
}

export default memo(IMCreateGroupComponent)
