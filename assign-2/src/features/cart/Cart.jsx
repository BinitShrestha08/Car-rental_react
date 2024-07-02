import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "./cartSlice";
import { useNavigate } from "react-router-dom";
import { getUsername } from "../user/userSlice";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import Button from "../../ui/Button";
import CreateOrder from "../order/CreateOrder";

function Cart() {
  const username = useSelector(getUsername);
  const navigate = useNavigate();
  const cart = useSelector(getCart);

  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />;

  const handleOrder = async (event) => {
    event.preventDefault();
    try {
      // Make POST request to backend to verify the order
      const response = await fetch("http://localhost:3000/api/cart/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }), // Assuming `cart` contains the items in the order
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to verify order");
      }

      // If order is verified successfully, redirect to the order placement page
      navigate("/order/new"); // Redirect to the order placement page
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="mt-4 ml-4">
        <Button
          type="secondary"
          to="/menu"
          className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
        >
          &larr; Back to menu
        </Button>
      </div>
      <div className="px-4  mx-auto max-w-4xl ">
        <h2 className="text-xl font-semibold ">Your cart, {username}</h2>

        <div className="flex">
          <ul>
            {cart.map((item) => (
              <CartItem item={item} key={item.id} />
            ))}
          </ul>
          <CreateOrder />
        </div>
      </div>
    </>
  );
}

export default Cart;
