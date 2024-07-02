import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  getCurrentQuantityById,
  getFirstItemIdInCart,
} from "../cart/cartSlice";
import { formatCurrency } from "../../utilities/helper";
import Button from "../../ui/Button";
import DeleteItem from "../cart/DeleteItem";
import UpdateItem from "../cart/UpdateItem";
import { useNavigate } from "react-router-dom";

function MenuItem({ product }) {
  const navigate = useNavigate();
  const {
    id,
    type,
    brand,
    car_model,
    year,
    mileage,
    fuel_type,
    quantity,
    seats,
    availability,
    price_per_day,
    description,
    image,
  } = product;

  const dispatch = useDispatch();
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const firstItemIdInCart = useSelector(getFirstItemIdInCart);
  const isInCart = currentQuantity > 0;

  function handleAddToCart() {
    const newItem = {
      id,
      type,
      brand,
      image,
      quantity: 1,
      numberOfDays: 1,
      car_model,
      price_per_day,
      totalPrice: price_per_day * 1,
    };
    dispatch(addItem(newItem));
    navigate("/cart");
  }

  const disableAddToCartButton = firstItemIdInCart && firstItemIdInCart !== id;

  return (
    <li className=" py-2">
      <div className="bg-white shadow-md rounded-md p-4 hover:shadow-lg relative hover:bg-gray-200  hover:cursor-pointer">
        <img
          src={image}
          alt={car_model}
          className={`w-full rounded-t-md transition ${
            availability ? "" : "opacity-70 grayscale"
          }`}
        />
        <p className="font-medium">{car_model}</p>
        <p className="font-medium">{brand}</p>
        <p className="text-sm capitalize italic text-stone-500">{type}</p>
        <p className="text-sm capitalize italic text-stone-500">{year}</p>
        <p className="text-sm capitalize italic text-stone-500">{quantity}</p>
        <div className="mt-auto flex items-center justify-between">
          {availability ? (
            <p className="text-sm ">{formatCurrency(price_per_day)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}

          {isInCart && (
            <div className="sm:gap8 flex items-center gap-3">
              <UpdateItem id={id} currentQuantity={currentQuantity} />
              <DeleteItem id={id} />
            </div>
          )}

          {availability && !isInCart && (
            <Button
              type="small"
              onClick={handleAddToCart}
              disabled={disableAddToCartButton}
            >
              Rent
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
