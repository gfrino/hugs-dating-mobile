import React, { ComponentProps, FC } from 'react'
import {  StyleSheet } from 'react-native';
  import { Button } from 'react-native-paper';

  type ButtonProps =  ComponentProps<typeof Button>

export const MinimalistBTN: FC<ButtonProps> = (props) => {
  return <Button color="#777070" style={styles.base} {...props}/>; 
}

const styles = StyleSheet.create({
  base: {
    borderColor: '#d6cccc',
    borderBottomWidth: .5,
    borderTopWidth: .5,
    paddingVertical: 8,
    marginVertical: 5,
    width: "100%",
    height: 50,
    
  },
});
