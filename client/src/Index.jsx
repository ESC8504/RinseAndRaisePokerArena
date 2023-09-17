import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GameStateProvider } from './contexts/GameStateContext.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import GameScreen from './screens/GameScreen.jsx';
import RulesScreen from './screens/RulesScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';
import PlayerVsPlayerScreen from './screens/PlayerVsPlayerScreen.jsx';

const Stack = createStackNavigator();
function App() {
  return (
    <GameStateProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Rules" component={RulesScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          {/* <Stack.Screen name="GameVsAiScreen" component={GameVsAiScreen} /> */}
          <Stack.Screen name="PlayerVsPlayer" component={PlayerVsPlayerScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameStateProvider>
  );
}
export default App;