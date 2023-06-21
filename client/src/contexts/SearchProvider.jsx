import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchText, _setSearchText] = useState("");
    const setSearchText = (text) => {
        const searchValue = text;
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
