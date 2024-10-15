import { ITransaction } from "@/contexts/DataContext";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  data: ITransaction;
};

function TradeItem({ data }: Props) {
  return (
    <View style={styles.itemContainer}>
      <Text>{`${data.s.slice(0, 2)} - ${data.s.slice(3, 5)}`}</Text>

      <Text>{data.p}</Text>
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    height: 40,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "gray",
  },
});

export default TradeItem;
