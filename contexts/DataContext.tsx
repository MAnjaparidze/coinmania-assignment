import { useState, createContext, useEffect, useRef } from "react";

export interface ITransaction {
  e: string;
  E: number;
  s: string;
  t: number;
  p: string;
  q: string;
  T: number;
  m: boolean;
  M: boolean;
  [key: string]: any;
}

export interface IGroupedTransactions {
  time: string;
  averagePrice: string;
  totalQuantity: string;
}

interface IDataContextState {
  trades: ITransaction[];
  groupedTrades: IGroupedTransactions[];
  setLowCap: any;
  setHighCap: any;
}

const dummyTrade = {
  e: "trade", // Event type
  E: 1672515782136, // Event time
  s: "BNBBTC", // Symbol
  t: 12345, // Trade ID
  p: "0.001", // Price
  q: "100", // Quantity
  T: 1672515782136, // Trade time
  m: true, // Is the buyer the market maker?
  M: true, // Ignore
};

const dataContextInitialState: any = {
  trades: [dummyTrade],
  groupedTrades: [],
};

export const DataContext = createContext<IDataContextState>(
  dataContextInitialState
);

function DataContextProvider({ children }: any) {
  const itemsBuffer = useRef<ITransaction[]>([]);
  const groupsBuffer = useRef<ITransaction[]>([]);

  const countRef = useRef(0);
  const secondsRef = useRef(0);
  const minutesRef = useRef(0);

  const [lowCap, setLowCap] = useState<number | null>(null);
  const [highCap, setHighCap] = useState<number | null>(null);

  const [trades, setTrades] = useState<ITransaction[]>([]);
  const [groupedTrades, setGroupedTrades] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const tradeSecStamp = Math.round(trade.T / 1000);
      const tradeMinStamp = Math.round(trade.T / 10000);

      if (secondsRef.current < tradeSecStamp) {
        secondsRef.current = tradeSecStamp;
        handleSetTrades();
      }

      if (
        minutesRef.current < tradeMinStamp &&
        itemsBuffer.current.length > 0
      ) {
        minutesRef.current = tradeMinStamp;
        groupTradesByMinute();
      }

      groupsBuffer.current = [trade, ...groupsBuffer.current];
      itemsBuffer.current = [trade, ...itemsBuffer.current];

      countRef.current++;
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSetTrades = () => {
    setTrades((prevTrades) => {
      let bufferLen = itemsBuffer.current.length;

      if (prevTrades.length + bufferLen > 1000) {
        prevTrades.splice(-bufferLen, bufferLen);
      }

      return [...itemsBuffer.current, ...prevTrades];
    });

    itemsBuffer.current = [];
  };

  // Group Items by Minutes and Calculate the Average Price of Exchange
  const groupTradesByMinute = () => {
    let quantity = groupsBuffer.current.length;
    let sum = groupsBuffer.current.reduce(
      (acc, trade) => acc + parseFloat(trade.p),
      0
    );

    let minuteData = {
      quantity,
      average: sum / quantity,
      trades: groupsBuffer.current,
    };

    setGroupedTrades((prevGroupedTrades) => {
      if (prevGroupedTrades.length > 60) {
        prevGroupedTrades.splice(-1, 1);
      }

      return [minuteData, ...prevGroupedTrades];
    });

    groupsBuffer.current = [];
  };

  return (
    <DataContext.Provider
      value={{
        trades,
        groupedTrades,
        setLowCap,
        setHighCap,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
