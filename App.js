import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import FlashMessage from "react-native-flash-message";

//import main stack navigator
import MainStackNavigator from "./src/navigators";

//import constants
import { Colors } from "./src/common/constants";

const App = () => {
  return(
    <>
      <StatusBar backgroundColor={Colors.BgColor} />
      <MainStackNavigator />
      <FlashMessage position={'bottom'} floating />
    </>
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