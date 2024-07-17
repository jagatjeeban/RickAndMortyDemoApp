import React from "react";
import { StyleSheet } from "react-native";

//import main stack navigator
import MainStackNavigator from "./src/navigators";

const App = () => {
  return(
    <MainStackNavigator />
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