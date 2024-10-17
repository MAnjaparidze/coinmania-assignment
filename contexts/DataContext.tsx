import {
  useState,
  createContext,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { Alert } from "react-native";

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
  [key: string]: string | number | boolean;
}

interface INotifyRef {
  lowCap: number | null;
  highCap: number | null;
  shouldNotify: boolean;
}

export interface IMinuteData {
  average: number;
  quantity: number;
  timeStamp: string;
}

export interface IDataContextState {
  trades: ITransaction[];
  groupedTrades: IMinuteData[];
  shouldNotify: boolean;
  toggleShouldNotify: Dispatch<SetStateAction<boolean>>;
  notifyRef: MutableRefObject<INotifyRef>;
  lowCap: number | null;
  highCap: number | null;
  handleSetLowCap: (str: string) => void;
  handleSetHighCap: (str: string) => void;
}

const dataContextInitialState: IDataContextState = {
  trades: [],
  groupedTrades: [],
  shouldNotifyRef: { current: false },
  shouldNotify: false,
  // @ts-expect-error
  notifyRef: {},
  toggleShouldNotify: () => {},
  lowCap: null,
  highCap: null,
  handleSetLowCap: () => {},
  handleSetHighCap: () => {},
};

export const DataContext = createContext<IDataContextState>(
  dataContextInitialState
);

function DataContextProvider({ children }: any) {
  const itemsBufferRef = useRef<ITransaction[]>([]);
  const groupsBufferRef = useRef<ITransaction[]>([]);
  const notifyRef = useRef<INotifyRef>({
    lowCap: null,
    highCap: null,
    shouldNotify: false,
  });

  const countRef = useRef(0);
  const secondsRef = useRef(Math.round(Date.now() / 3000));
  const minutesRef = useRef(Math.round(Date.now() / 60000));

  const [shouldNotify, toggleShouldNotify] = useState(false);
  const [lowCap, setLowCap] = useState<number | null>(0);
  const [highCap, setHighCap] = useState<number | null>(0);

  const [trades, setTrades] = useState<ITransaction[]>([]);
  const [groupedTrades, setGroupedTrades] = useState<IMinuteData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const tradeSecStamp = Math.round(trade.T / 3000);
      const tradeMinStamp = Math.round(trade.T / 60000);

      // Check caps if we have notifications on
      if (notifyRef.current.shouldNotify) {
        checkCaps(trade);
      }

      // Update trades state if one second has passed and buffer array is not empty
      if (
        secondsRef.current < tradeSecStamp &&
        itemsBufferRef.current.length > 0
      ) {
        // Set the first second
        secondsRef.current = tradeSecStamp;
        handleSetTrades();
      }

      // Update grouped trades state if one minute has passed and buffer array is not empty
      if (
        minutesRef.current < tradeMinStamp &&
        groupsBufferRef.current.length > 0
      ) {
        // Set the first minute
        minutesRef.current = tradeMinStamp;
        groupTradesByMinute();
      }

      // Continue setting the buffer states
      itemsBufferRef.current = [trade, ...itemsBufferRef.current];
      groupsBufferRef.current = [trade, ...groupsBufferRef.current];

      // Count checker for tests
      countRef.current++;
    };

    return () => {
      ws.close();
    };
  }, []);

  // 3 Effects to manage asynchronous data passing to ws.onmessage
  useEffect(() => {
    notifyRef.current.lowCap = lowCap ? lowCap : null;
  }, [lowCap]);

  useEffect(() => {
    notifyRef.current.highCap = highCap;
  }, [highCap]);

  useEffect(() => {
    notifyRef.current.shouldNotify = shouldNotify;
  }, [shouldNotify]);

  const checkCaps = (trade: ITransaction) => {
    let roundedPrice = Math.round(parseFloat(trade.p) * 100) / 100;
    const { lowCap, highCap } = notifyRef.current;

    // Check specific cap existence and compare
    if (
      (highCap && roundedPrice >= highCap) ||
      (lowCap && roundedPrice <= lowCap)
    ) {
      // Reset the notification to evade refire of checkCaps()
      toggleShouldNotify(false);

      // Notify user and give option to see details of trade
      Alert.alert(`Cap Reached!`, `Caught price: ${roundedPrice}`, [
        {
          text: "Go to Bid Details",
          onPress: () => console.log("Navigate to Bid Page"),
        },
        {
          text: "Close",
        },
      ]);
      setHighCap(null);
      setLowCap(null);
    }
  };

  const handleSetTrades = () => {
    setTrades((prevTrades) => {
      let bufferLen = itemsBufferRef.current.length;

      // Max count 1000 for state to evade performance issues
      if (prevTrades.length + bufferLen > 1000) {
        prevTrades.splice(-bufferLen, bufferLen);
      }

      return [...itemsBufferRef.current, ...prevTrades];
    });

    // Clear buffer
    itemsBufferRef.current = [];
  };

  const groupTradesByMinute = () => {
    let date = new Date((minutesRef.current - 2) * 60000);
    let quantity = groupsBufferRef.current.length;
    let timeStamp = `${date}`;

    // Calc sum of buffer items
    let sum = groupsBufferRef.current.reduce(
      (acc, trade) => acc + parseFloat(trade.p),
      0
    );

    // Initialize minute object
    let minuteData = {
      quantity,
      average: sum / quantity,
      timeStamp,
      trades: groupsBufferRef.current,
    };

    setGroupedTrades((prevGroupedTrades) => {
      // Save data of last hour
      if (prevGroupedTrades.length > 60) {
        prevGroupedTrades.splice(-1, 1);
      }

      return [minuteData, ...prevGroupedTrades];
    });
    // Clear buffer
    groupsBufferRef.current = [];
  };

  const handleSetLowCap = (str: string) => {
    toggleShouldNotify(false);
    let num = str === "" ? null : JSON.parse(str);

    setLowCap(num);
  };

  const handleSetHighCap = (str: string) => {
    toggleShouldNotify(false);
    let num = str === "" ? null : JSON.parse(str);

    setHighCap(num);
  };

  return (
    <DataContext.Provider
      value={{
        trades,
        groupedTrades,
        notifyRef,
        shouldNotify,
        toggleShouldNotify,
        lowCap,
        highCap,
        handleSetLowCap,
        handleSetHighCap,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
