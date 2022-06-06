
import React, { useEffect, useState } from "react";
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackHistorial, StackReporte } from './stacknavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PrimaryColor, cardColor } from '../Styles/BachesColor';
import { SafeAreaProvider } from "react-native-safe-area-context";
const Tab = createBottomTabNavigator();

const NavegacionBaches = () => {

  return (
    <SafeAreaProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mis Datos') {
              iconName = focused
                ? "person"
                : 'person';
            } else if (route.name === 'Reportar') {
              iconName = focused ? 'clipboard' : 'clipboard';
            } if (route.name === 'Historial') {
              iconName = focused ? 'book' : 'book';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: "#f8bb68",
          inactiveTintColor: cardColor,
          tabStyle: { backgroundColor: PrimaryColor },
          safeAreaInsets: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        }}
      >
        <Tab.Screen name="Reportar" component={StackReporte} ></Tab.Screen>
        <Tab.Screen name="Historial" component={StackHistorial}></Tab.Screen>
      </Tab.Navigator>
    </SafeAreaProvider>
  )
}
export default NavegacionBaches;