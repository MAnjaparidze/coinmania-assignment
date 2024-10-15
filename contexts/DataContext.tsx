import { useState, createContext, useEffect } from "react";

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
}

interface IDataContextState {
  trades: ITransaction[];
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

const dataContextInitialState: IDataContextState = {
  trades: [dummyTrade],
};

export const DataContext = createContext<IDataContextState>(
  dataContextInitialState
);

function DataContextProvider({ children }: any) {
  const [trades, setTrades] = useState<ITransaction[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      setTrades((prevTrades) => [trade, ...prevTrades]);

      // TODO: We can use the Notification Service Here
      // checkThreshold(trade.p);
    };

    return () => ws.close();
  });

  return (
    <DataContext.Provider
      value={{
        trades,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
