import { useContext, useState } from "react";
import _ from "lodash";

import { SEARCH_TRANSFER_MARKET } from "../constants/actions";
import { GlobalContext } from "../context/GlobalState";

function TransferMarket() {
  const { executeAction } = useContext(GlobalContext);
  const [auctions, setAuctions] = useState([]);

  function handleSearch() {
    executeAction(SEARCH_TRANSFER_MARKET, null, (payload) => {
      setAuctions(payload);
    });
  }

  return (
    <div>
      <button onClick={handleSearch}>search</button>
      <ol>
        {_.map(auctions, (auction, i) => {
          const { resourceId, rating, _staticData, _auction } = auction;
          const { name } = _staticData;
          const { expires, buyNowPrice } = _auction;
          return (
            <li>
              {resourceId} - {rating} - {name} - {expires} - {buyNowPrice}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default TransferMarket;
