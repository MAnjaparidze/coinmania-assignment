import { DataContext, IMinuteData } from "@/contexts/DataContext";
import { useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";

export default function TabTwoScreen() {
  const { groupedTrades } = useContext(DataContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.pageContainer}>
        <View>
          <Text style={styles.pageHeader}>BTC - USDT</Text>
          <Text style={styles.pageSubHeader}>Trade Averages by Minute</Text>
        </View>

        <FlatList
          data={groupedTrades}
          renderItem={({ item }) => (
            <View
              style={{
                display: "flex",
                borderWidth: 1,
                borderRadius: 4,
                marginBottom: 10,
                padding: 10,
              }}
            >
              <Text>Average Price: {Math.round(item.average * 100) / 100}</Text>

              <Text>Items QT: {item.quantity}</Text>

              <Text>Timestamp: {item.timeStamp}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 20,
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
  groupedItemContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
