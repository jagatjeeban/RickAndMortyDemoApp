import React from "react";
import { SafeAreaView, StyleSheet, Text, Platform } from "react-native";

const App = () => {
  return(
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={{color:'black'}}>{`Hello Rick and Morty on ${Platform.OS === 'macos'? 'Desktop': 'Mobile'}`}</Text>
    </SafeAreaView>
  )
}

export default App;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'white'
  }
})