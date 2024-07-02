import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProductSearch() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    searchTerm: "",
    suggestions: [],
    searchResults: [],
    recentlySearched: [],
    isFocused: false,
  });

  useEffect(() => {
    // Load recently searched items from local storage on component mount
    const recentlySearched =
      JSON.parse(localStorage.getItem("recentlySearched")) || [];
    setState((prevState) => ({
      ...prevState,
      recentlySearched,
    }));
  }, []);

  const fetchSearchResults = async (searchTerm) => {
    try {
      const response = await axios.get("../../src/data/cars.json");
      const searchData = response.data;

      const filteredResults = searchData.filter(
        (item) =>
          item.car_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setState((prevState) => ({
        ...prevState,
        suggestions: filteredResults,
        searchResults: filteredResults,
      }));
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (state.searchTerm) {
      fetchSearchResults(state.searchTerm);
    }
  }, [state.searchTerm]);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setState((prevState) => ({
      ...prevState,
      searchTerm: value,
    }));
  };

  const handleSearch = () => {
    const { searchTerm, searchResults, recentlySearched } = state;

    if (searchTerm.trim() === "") return;

    // Update recently searched items
    const updatedRecentlySearched = [
      searchTerm,
      ...recentlySearched.filter((term) => term !== searchTerm),
    ];
    if (updatedRecentlySearched.length > 3) {
      updatedRecentlySearched.pop(); // Limit to last 5 items
    }

    // Save to local storage
    localStorage.setItem(
      "recentlySearched",
      JSON.stringify(updatedRecentlySearched)
    );

    setState((prevState) => ({
      ...prevState,
      recentlySearched: updatedRecentlySearched,
    }));

    navigate("/menu/Searched", {
      state: { filteredData: searchResults },
    });
  };

  const handleSuggestionClick = (suggestion) => {
    navigate("/menu/Searched", { state: { filteredData: [suggestion] } });
  };

  const handleRecentSearchClick = (searchTerm) => {
    setState((prevState) => ({
      ...prevState,
      searchTerm,
    }));
    fetchSearchResults(searchTerm);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={state.searchTerm}
        onChange={handleInputChange}
        onFocus={() =>
          setState((prevState) => ({ ...prevState, isFocused: true }))
        }
        onBlur={() =>
          setState((prevState) => ({ ...prevState, isFocused: false }))
        }
        placeholder="Search..."
        className="w-28 sm:w-64 rounded-full border-black px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring-yellow-500 focus:ring-opacity-50 sm:focus:w-72"
      />
      <button
        className="ml-3 py-3 px-4 rounded-full bg-amber-400 hover:bg-amber-500"
        onClick={handleSearch}
      >
        Search
      </button>
      {state.isFocused && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white rounded-md shadow-lg opacity-95">
          {state.recentlySearched.length > 0 && (
            <div className="py-1 border-b">
              <p className="px-3 py-2 text-sm font-semibold">
                Recently Searched
              </p>
              <ul>
                {state.recentlySearched.map((term, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleRecentSearchClick(term)}
                  >
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {state.suggestions.length > 0 && (
            <div className="py-1">
              <p className="px-3 py-2 text-sm font-semibold">Suggestions</p>
              <ul>
                {state.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex"
                    onMouseDown={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="ml-2">
                      {suggestion.brand} - {suggestion.car_model}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
