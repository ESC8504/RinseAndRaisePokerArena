import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen.jsx';
import PlayerVsPlayerScreen from './screens/PlayerVsPlayerScreen.jsx';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="GameVsAiScreen" component={GameVsAiScreen} /> */}
        <Stack.Screen name='PlayerVsPlayer' component={PlayerVsPlayerScreen} />
        {/* <Stack.Screen name='Game' component={GameScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;