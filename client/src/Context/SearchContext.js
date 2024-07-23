import { useReducer, createContext, useContext, useEffect } from "react";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const loadDatesFromLocalStorage = () => {
  const dates = JSON.parse(localStorage.getItem("dates") || "[]");
  return dates.map((dateRange) => ({
    startDate: new Date(dateRange.startDate),
    endDate: new Date(dateRange.endDate),
  }));
};

const INITIAL_STATE = {
  city: undefined,
  dates: loadDatesFromLocalStorage(),
  options: {
    adult: undefined,
    children: undefined,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("dates", JSON.stringify(state.dates));
  }, [state.dates]);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
