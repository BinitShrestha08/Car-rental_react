// import LinkButton from "../../ui/LinkButton";

import Button from "../../ui/Button";

function EmptyCart() {
  return (
    <div className="px-4 py-3">
      <Button
        type="secondary"
        to="/menu"
        className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
      >
        &larr; Back to menu
      </Button>

      <p className="mt-7 font-semibold">
        Your cart is still empty. Start adding some items :)
      </p>
    </div>
  );
}

export default EmptyCart;
