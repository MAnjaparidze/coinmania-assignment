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
  Pressable,
} from "react-native";

export default function HomeScreen() {
  const {
    trades,
    shouldNotify,
    toggleShouldNotify,
    lowCap,
    highCap,
    handleSetLowCap,
    handleSetHighCap,
  } = useContext(DataContext);

  const [countMultiplier, setCountMultiplier] = useState<number>(1);

  const listMultiplier = 10;

  const handleIncreaseMultiplier = () => {
    setCountMultiplier((prevCount) => prevCount + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.capContainer}>
        <Text style={styles.pageHeader}>BTC - USDT</Text>
        <Text style={styles.pageSubHeader}>Set Low - High Notifications</Text>
        <Pressable
          onPress={() => toggleShouldNotify((prevState) => !prevState)}
          style={styles.flexRow}
        >
          <View
            style={shouldNotify ? styles.checkBoxActive : styles.checkBox}
          ></View>
          <Text style={{ color: shouldNotify ? "green" : "black" }}>
            Active Bid
          </Text>
        </Pressable>
        <View>
          <View style={styles.inputsContainer}>
            <TextInput
              value={`${lowCap || ""}`}
              style={styles.inputWrapper}
              onChangeText={handleSetLowCap}
              keyboardType="numeric"
              placeholder="Low"
            />
            <TextInput
              value={`${highCap || ""}`}
              style={styles.inputWrapper}
              onChangeText={handleSetHighCap}
              keyboardType="numeric"
              placeholder="High"
            />
          </View>
        </View>
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
  flexRow: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 0,
    gap: 4,
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
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
  },
  checkBoxActive: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderBlockColor: "green",
    backgroundColor: "green",
  },
});
