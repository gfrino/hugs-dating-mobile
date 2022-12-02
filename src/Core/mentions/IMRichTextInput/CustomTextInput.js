import React, { useRef } from 'react'
import { Text, View, TextInput, ScrollView } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function CustomTextInput(props) {
  const {
    editorStyles = {},
    editorHeight,
    formattedText,
    placeholder,
    inputText,
    onChange,
    handleSelectionChange,
    onContentSizeChange,
  } = props
  const scrollRef = useRef()
  const inputRef = useRef()

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const onTextFieldPress = () => {
    inputRef.current?.focus()
  }
  props.inputRef.current = inputRef.current

  return (
    <View styles={[editorStyles.mainContainer]}>
      <View style={[styles.container, editorStyles.mainContainer]}>
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          ref={scrollRef}
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({ animated: true })
          }}
          style={[styles.editorContainer, editorStyles.editorContainer]}>
          <View style={[{ height: editorHeight }]}>
            <TextInput
              ref={inputRef}
              style={[styles.input, editorStyles.input]}
              multiline
              autoFocus
              numberOfLines={100}
              value={inputText}
              onBlur={props.toggleEditor}
              onChangeText={onChange}
              onSelectionChange={handleSelectionChange}
              placeholder={placeholder}
              onContentSizeChange={onContentSizeChange}
              scrollEnabled={false}
            />
            <TouchableWithoutFeedback
              onPress={onTextFieldPress}
              style={[
                styles.formmatedTextWrapper,
                editorStyles.inputMaskTextWrapper,
              ]}>
              {formattedText !== '' ? (
                <Text
                  style={[styles.formmatedText, editorStyles.inputMaskText]}>
                  {formattedText}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.placeholderText,
                    editorStyles.placeholderText,
                  ]}>
                  {placeholder}
                </Text>
              )}
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

CustomTextInput.defaultProps = {
  inputRef: {
    current: {},
  },
}
