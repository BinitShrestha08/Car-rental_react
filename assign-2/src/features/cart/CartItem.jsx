import { formatCurrency } from "../../utilities/helper";
import { useSelector } from "react-redux";
import DeleteItem from "./DeleteItem";
import { getCurrentQuantityById } from "../cart/cartSlice";
import UpdateItem from "./UpdateItem";

function CartItem({ item }) {
  const { id, image, brand, type, totalPrice, quantity } = item;

  const currentQuantity = useSelector(getCurrentQuantityById(id));

  return (
    <>
      <li className="py-3 flex-col sm:flex sm:items-center sm:justify-between">
        <img className="object-scale-downh-48 w-96 gap-4" src={image} alt="" />
        {/*  */}
        <p className="mb-1 sm:mb-0">
          {quantity}&times; {brand} - {type}
        </p>
        <div className="flex items-center justify-between sm:gap-6">
          <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
        </div>
        {/* {numberOfDays !== null && (
          <p>Number of days between the selected dates: {numberOfDays}</p>
        )} */}
      </li>
      <div className="flex gap-3 justify-center">
        <UpdateItem id={id} currentQuantity={currentQuantity} />
        {/* <DeleteItem id={id} /> */}
      </div>
    </>
  );
}

export default CartItem;
