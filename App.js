import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

const App = () => {
  return(
    <SafeAreaView style={styles.safeAreaView}>
      <Text>Hello Rick and Morty</Text>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  }
})