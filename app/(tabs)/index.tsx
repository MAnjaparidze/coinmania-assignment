import TradeItem from "@/components/TradeItem/TradeItem";
import { DataContext, ITransaction } from "@/contexts/DataContext";
import { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
  Text,
  Button,
  ScrollView,
  FlatList,
} from "react-native";

export default function HomeScreen() {
  const { trades } = useContext(DataContext);

  const [lowCap, setLowCap] = useState<number | null>(null);
  const [highCap, setHighCap] = useState<number | null>(null);
  const [countMultiplier, setCountMultiplier] = useState<number>(1);

  const listMultiplier = 25;

  const handleSaveCaps = () => {};

  const handleIncreaseMultiplier = () => {
    setCountMultiplier((prevCount) => prevCount + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.capContainer}>
          <Text style={styles.pairLabel}>BTC - USDT</Text>
          <Text style={styles.capLabel}>Set Low - High Notifications</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={styles.inputWrapper}
              keyboardType="numeric"
              placeholder="Low"
            />
            <TextInput
              style={styles.inputWrapper}
              keyboardType="numeric"
              placeholder="High"
            />
          </View>

          <Button onPress={handleSaveCaps} title="Save" />
        </View>

        <FlatList
          contentContainerStyle={{ gap: 8 }}
          onEndReached={handleIncreaseMultiplier}
          data={trades.slice(0, listMultiplier * countMultiplier)}
          renderItem={({ item }) => <TradeItem data={item} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  capContainer: {
    padding: 20,
    width: "100%",
  },
  pairLabel: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  capLabel: {
    fontSize: 18,
    fontWeight: "semibold",
    paddingBottom: 10,
  },
  inputsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 10,
    borderRadius: 8,
    width: 150,
  },
});

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native';
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// function TradeListScreen() {
//   const [trades, setTrades] = useState([]);
//   const [thresholds, setThresholds] = useState({ low: null, high: null });

//   useEffect(() => {
//     const ws = new WebSocket('wss://stream.binance.com:443/ws/btcusdt@trade');

//     ws.onmessage = (event) => {
//       const trade = JSON.parse(event.data);
//       setTrades((prevTrades) => {
//         const updatedTrades = [trade, ...prevTrades].slice(0, 25);
//         saveTradeHistory(updatedTrades); // Persist the trade history
//         return updatedTrades;
//       });
//       checkThreshold(trade.p); // Check for threshold violations
//     };

//     return () => ws.close();
//   }, []);

//   const saveTradeHistory = async (updatedTrades) => {
//     try {
//       const history = await AsyncStorage.getItem('tradeHistory') || '[]';
//       const newHistory = JSON.parse(history).concat(updatedTrades).slice(-3600); // Keep last one hour data
//       await AsyncStorage.setItem('tradeHistory', JSON.stringify(newHistory));
//     } catch (e) {
//       console.log('Error saving trade history:', e);
//     }
//   };

//   const checkThreshold = (price) => {
//     const { low, high } = thresholds;
//     if ((low && price <= low) || (high && price >= high)) {
//       Alert.alert('Threshold Alert', `Price ${price} crossed the threshold!`);
//     }
//   };

//   return (
//     <View>
//       <TextInput placeholder="Low Threshold" onChangeText={(text) => setThresholds({ ...thresholds, low: text })} />
//       <TextInput placeholder="High Threshold" onChangeText={(text) => setThresholds({ ...thresholds, high: text })} />
//       <FlatList
//         data={trades}
//         renderItem={({ item }) => <Text>{`Price: ${item.p} - Quantity: ${item.q}`}</Text>}
//         keyExtractor={(item) => item.t.toString()}
//       />
//     </View>
//   );
// }
