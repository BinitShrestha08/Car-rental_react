import { useLocation } from "react-router-dom";
import OrderItem from "./OrderItem";
import { ToastContainer, toast } from "react-toastify";

function Order() {
  const location = useLocation();
  const customerData = location.state?.customerData;
  const cart = location.state?.cart;
  const reservationNumber = location.state?.reservationNumber;
  const numberOfDays = location.state?.numberOfDays;

  const date = new Date();
  const formattedDate = new Date().toDateString();
  const formattedTime = date.toLocaleTimeString(); // "16:43:14" (default format)

  const handleConfirmation = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/order/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationNumber, cart }),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success(data.message || "Order confirmed successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to confirm order");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-4 mx-auto max-w-4xl">
      <ToastContainer />
      <div className="flex flex-wrap items-center justify-between gap-2 my-5">
        <p className="text-xl font-semibold">{reservationNumber}</p>
      </div>
      <div className="bg-stone-200 px-6 py-5 my-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>{customerData.customer.toUpperCase()}</p>
          <p className="text-m text-stone-500">
            {customerData.license},{" "}
            <span className="font-bold">{customerData.license}</span>
          </p>
        </div>
        <p>{customerData.phone}</p>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-m text-stone-500">{formattedDate}</p>
          <p className="text-xs text-stone-500">(Time: {formattedTime})</p>
        </div>
      </div>

      <ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem item={item} key={item.id} />
        ))}
      </ul>
      <p>{numberOfDays}</p>
      <div className="space-y-2 bg-stone-200 px-6 py-5 flex flex-col my-5">
        <p className="text-sm font-medium text-stone-600 text-center">
          Please click on the link to confirm reservation,{" "}
          <span
            onClick={handleConfirmation}
            className="text-lg font-bold underline hover:cursor-pointer text-blue-400 hover:text-yellow-700"
          >
            Link
          </span>
          <br />
        </p>
      </div>
    </div>
  );
}

export default Order;
