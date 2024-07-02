import { useLocation } from "react-router-dom";
import MenuItem from "./MenuItem";

function SelectedItem() {
  const location = useLocation();
  const { filteredData } = location.state;

  if (filteredData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <img
          className="object-contain h-70 w-96 "
          src="/images/fireCar.png"
          alt=""
        />
        <p className="text-xl font-semibold">
          Oops, the car you're searching for is not available.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-10">
      {filteredData.map((item) => (
        <MenuItem key={item.id} product={item} />
      ))}
    </ul>
  );
}

export default SelectedItem;
