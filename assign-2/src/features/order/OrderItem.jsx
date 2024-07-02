import { formatCurrency } from "../../utilities/helper";

function OrderItem({ item }) {
  const { quantity, brand, totalPrice, image, numberOfDays } = item;

  return (
    <li className="space-y-1 py-3">
      <div className="flex items-center justify-between gap-4 text-sm">
        <img className="object-contain h-48 w-96 " src={image} alt="" />
        <p>
          <span className="font-bold">{quantity}&times;</span>
          {brand}
          {"   ----------    "}
          <span className="font-bold">{numberOfDays}</span>
          {"  days"}
        </p>
        {"   -------------  "}
        <p className="font-boldw">{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default OrderItem;
