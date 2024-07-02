import { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./MenuItem";
import Dropdowns from "../../ui/Dropdowns";
function Menu() {
  const [products, setProducts] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("src/data/cars.json");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const getUniqueValues = (products, key) => {
    const uniqueValues = new Set(products.map((item) => item[key]));
    return [...uniqueValues];
  };

  const handleSelectBrand = (brand) => {
    setSelectedBrand(brand);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  // Get unique brands and types
  const uniqueBrands = getUniqueValues(products, "brand");
  const uniqueTypes = getUniqueValues(products, "type");

  // Filter products based on selected brand and type
  const filteredProducts = products.filter((product) => {
    return (
      (!selectedBrand || product.brand === selectedBrand) &&
      (!selectedType || product.type === selectedType)
    );
  });

  return (
    <>
      <Dropdowns
        uniqueBrands={uniqueBrands}
        uniqueTypes={uniqueTypes}
        onSelectBrand={handleSelectBrand}
        onSelectType={handleSelectType}
      />
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-10">
        {filteredProducts.map((item) => (
          <MenuItem className="col" key={item.id} product={item} />
        ))}
      </ul>
    </>
  );
}

export default Menu;
