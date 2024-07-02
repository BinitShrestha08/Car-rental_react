import { useState, useEffect, useRef } from "react";

function Dropdowns({ uniqueBrands, uniqueTypes, onSelectBrand, onSelectType }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdown1Ref = useRef(null);
  const dropdown2Ref = useRef(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleClickOutside = (event) => {
    if (
      dropdown1Ref.current &&
      !dropdown1Ref.current.contains(event.target) &&
      dropdown2Ref.current &&
      !dropdown2Ref.current.contains(event.target)
    ) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex space-x-4 my-2.5 ml-5">
      {/* First Dropdown */}
      <div className="relative" ref={dropdown1Ref}>
        <button
          className="bg-yellow-500 text-gray-700 px-4 py-2 rounded"
          onClick={() => toggleDropdown("dropdown1")}
        >
          Brands
        </button>
        {openDropdown === "dropdown1" && (
          <ul className="absolute top-full left-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white rounded-md shadow-lg opacity-95">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelectBrand(null);
                setOpenDropdown(null);
              }}
            >
              All Brands
            </li>
            {uniqueBrands.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelectBrand(item);
                  setOpenDropdown(null);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Second Dropdown */}
      <div className="relative" ref={dropdown2Ref}>
        <button
          className="bg-yellow-500 text-gray-700 px-4 py-2 rounded"
          onClick={() => toggleDropdown("dropdown2")}
        >
          Type
        </button>
        {openDropdown === "dropdown2" && (
          <ul className="absolute top-full left-0 z-50 mt-1 max-h-48 overflow-y-auto bg-white rounded-md shadow-lg opacity-95">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelectType(null);
                setOpenDropdown(null);
              }}
            >
              All Types
            </li>
            {uniqueTypes.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelectType(item);
                  setOpenDropdown(null);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dropdowns;
