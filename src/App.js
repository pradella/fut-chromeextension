import { useContext, useEffect } from "react";

import "./App.css";
import { GET_USER } from "./constants/actions";
import TransferMarket from "./container/TransferMarket";
import { GlobalContext } from "./context/GlobalState";

function App() {
  const {
    setUser,
    user,
    initializeConnection,
    executeAction,
    isConnectionInitialized,
  } = useContext(GlobalContext);

  useEffect(() => {
    initializeConnection();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isConnectionInitialized) {
      executeAction(GET_USER, null, (payload) => {
        setUser({
          uid: payload?.currentUserId,
          email: payload?.userDao?.authDelegate?.sessionUtas?.user?.email,
        });
      });
    }
  }, [isConnectionInitialized]); //eslint-disable-line

  return (
    <div className="App">
      {!isConnectionInitialized && <span>Connecting...</span>}
      {isConnectionInitialized && !user && <span>Could not find FUT user</span>}
      {isConnectionInitialized && user?.email && (
        <>
          <h2>Account: {user?.email}</h2>
          <TransferMarket />
        </>
      )}
    </div>
  );
}

export default App;
