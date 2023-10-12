import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from './state/store';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RulesScreen from './screens/RulesScreen';
import AboutScreen from './screens/AboutScreen';
import PlayerVsPlayerScreen from './screens/PlayerVsPlayerScreen';

const Stack = createStackNavigator();
const App: React.FC = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}
export default App;