import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchText, _setSearchText] = useState("");

    const setSearchText = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(" ")) {
            _setSearchText(searchValue);
        }
    };

    return (
        <SearchContext.Provider
            value={{
                searchText,
                setSearchText,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => useContext(SearchContext);
