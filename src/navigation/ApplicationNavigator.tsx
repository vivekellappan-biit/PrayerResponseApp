import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, ResponseScreen, SplashScreen} from '../screens/index';
import {State} from 'react-native-gesture-handler';
import {COLORS} from '../constants/colors';
import {PrayerRequest} from '../models/PrayerRequest';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Response: {
    item: PrayerRequest;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const ApplicationNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',

          headerShown: false,
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: true,
            title: 'Arulvakku'.toUpperCase(),
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Response"
          component={ResponseScreen}
          options={{
            headerShown: true,
            title: 'Prayer Response'.toUpperCase(),
            headerTitleAlign: 'left',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
