import { Appearance, StyleSheet } from 'react-native'

const isDarkMode = Appearance.getColorScheme() === 'dark'

const dynamicStyles = (theme, colorScheme) => {
  const colorSet = theme.colors[colorScheme]
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorSet.grey0,
    },
    settingsTitleContainer: {
      width: '100%',
      height: 48,
      justifyContent: 'flex-end',
    },
    settingsTitle: {
      color: colorSet.secondaryText,
      paddingLeft: 10,
      fontSize: 14,
      paddingBottom: 6,
      fontWeight: '500',
    },
    settingsTypesContainer: {
      backgroundColor: colorSet.primaryBackground,
    },
    settingsTypeContainer: {
      borderBottomColor: colorSet.grey3,
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      marginVertical: 2,
    },
    settingsType: {
      color: colorSet.primaryForeground,
      fontSize: 14,
      fontWeight: '500',
    },
    contentContainer: {
      width: '100%',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colorSet.hairline,
      backgroundColor: colorSet.primaryBackground,
    },
    divider: {
      height: 0.5,
      width: '96%',
      alignSelf: 'flex-end',
      backgroundColor: colorSet.hairline,
    },
    text: {
      fontSize: 14,
      color: colorSet.primaryText,
      padding: 4,
    },
    appSettingsTypeContainer: {
      flexDirection: 'row',
      borderBottomWidth: 0,
      justifyContent: 'space-between',
      paddingHorizontal: 15,
    },
    appSettingsSaveContainer: {
      height: 45,
      backgroundColor: colorSet.primaryBackground,
    },
    placeholderTextColor: {
      color: colorSet.placeholderColor,
    },
  })
}

export default dynamicStyles
