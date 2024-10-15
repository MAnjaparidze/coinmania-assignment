import { ITransaction } from "@/contexts/DataContext";
import { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  data: ITransaction;
};

function TradeItem({ data }: Props) {
  let date = new Date(data.T);
  return (
    <View style={styles.itemContainer}>
      {/* <Text style={styles.itemPairName}>BTC - USDT</Text> */}

      <View>
        <Text>
          <Text style={styles.itemPairName}>Price:</Text> {JSON.parse(data.p)}
        </Text>
        <Text>
          <Text style={styles.itemPairName}>Quantity:</Text>{" "}
          {JSON.parse(data.q)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "gray",
  },
  itemPairName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default memo(TradeItem);
