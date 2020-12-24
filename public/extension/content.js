(function () {
  // @todo: find out how to inject Vasco's library instead paste code here
  async function searchTransferMarket(
    options = {
      club: -1,
      count: 100,
      defId: [],
      excludeDefIds: [],
      isExactSearch: false,
      league: -1,
      level: "any",
      maskedDefId: 0,
      maxBid: 0,
      maxBuy: 0,
      minBid: 0,
      minBuy: 0,
      nation: -1,
      offset: 0,
      playStyle: -1,
      rarities: [],
      sortBy: "value",
      subtypes: [],
      _acquiredDate: "",
      _category: "any",
      _position: "any",
      _sort: "desc",
      _type: "player",
      _untradeables: "",
      _zone: -1,
    },
    page = 1
  ) {
    return new Promise((resolve, reject) => {
      window.services.Item.searchTransferMarket(options, page).observe(
        undefined,
        (_, obs) => {
          if (obs.success) {
            resolve(obs.data.items);
          } else reject();
        }
      );
    });
  }

  window.addEventListener(
    "message",
    async (event) => {
      switch (event?.data?.action) {
        case "getUser":
          window.postMessage({
            ...event.data,
            action: "getUser__callback",
            payload: window?.services?.User,
          });
          break;
        case "searchTransferMarket":
          const res = await searchTransferMarket();
          window.postMessage({
            ...event.data,
            action: "searchTransferMarket__callback",
            payload: res,
          });
          break;
        default:
          break;
      }
    },
    false
  );
})();
