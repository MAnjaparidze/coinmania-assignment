import TradeItem from "@/components/TradeItem/TradeItem";
import { DataContext, ITransaction } from "@/contexts/DataContext";
import { useCallback, useContext, useEffect, useState } from "react";
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
      <View style={styles.capContainer}>
        <Text style={styles.pageHeader}>BTC - USDT</Text>
        <Text style={styles.pageSubHeader}>Set Low - High Notifications</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  capContainer: {
    padding: 20,
    width: "100%",
  },
  pageHeader: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  pageSubHeader: {
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
