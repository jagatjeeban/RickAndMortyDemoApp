import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//import constants
import { Colors } from '../common/constants';

//import all the screens
import Characters from '../screens/Characters';
import CharacterProfile from '../screens/CharacterProfile';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {

  const screenOptions = {
    headerShown: false,
    gestureEnabled: false,
    navigationBarColor: Colors.BgColor
  }

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name='Characters'       component={Characters} />
            <Stack.Screen name='CharacterProfile' component={CharacterProfile} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator;