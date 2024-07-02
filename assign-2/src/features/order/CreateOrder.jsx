import { Form, useNavigation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  getCart,
  getTotalCartPrice,
  updateNumberOfDays,
} from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utilities/helper";
import { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../ui/Button";

import { ToastContainer, toast } from "react-toastify";

function CreateOrder() {
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const { username } = useSelector((state) => state.user);

  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";

  const dispatch = useDispatch();

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const reservationNumber = generateOrderNumber();

  if (!cart.length) return <EmptyCart />;

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      updateCartWithNumberOfDays(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      updateCartWithNumberOfDays(startDate, date);
    }
  };

  const updateCartWithNumberOfDays = (start, end) => {
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    cart.forEach((item) => {
      dispatch(updateNumberOfDays({ id: item.id, numberOfDays }));
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate dates
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    // Collect form data
    const formData = new FormData(event.target);
    const customerData = {
      customer: formData.get("customerName"),
      phone: formData.get("phone"),
      license: formData.get("license"),
      email: formData.get("email"),
    };

    // Validate email
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email);
    if (!isValidEmail) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(""); // Clear previous error
    }

    // Validate license
    const isValidLicense = /^[A-Z][0-9]{9}$/.test(customerData.license);
    if (!isValidLicense) {
      setLicenseError("Invalid Driver License");
    } else {
      setLicenseError(""); // Clear previous error
    }

    // Validate phone number
    const isValidPhone =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
        customerData.phone
      );
    if (!isValidPhone) {
      setPhoneError("Invalid phone number");
    } else {
      setPhoneError(""); // Clear previous error
    }

    // If any validation fails, stop the form submission
    if (!isValidEmail || !isValidLicense || !isValidPhone) {
      return;
    }

    try {
      // Make POST request to backend
      const response = await fetch("http://localhost:3000/api/order/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerData,
          cart,
          startDate,
          endDate,
          reservationNumber,
        }),
      });

      if (response.ok) {
        dispatch(clearCart());

        // Navigate to confirmation page
        navigate("/order/confirm", {
          state: {
            customerData,
            cart,
            reservationNumber,
          },
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to confirm order");
      }
      // Clear cart on successful order placement
    } catch (error) {
      // console.error("Error placing order:", error.message);
      toast.error("Error placing order: " + error.message);
      // Handle error, show message to user, etc.
    }
  };

  return (
    <div className="px-7">
      <ToastContainer />
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <div className="flex flex-col">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
            className="input grow"
            placeholderText="Select start date"
            required
          />
        </div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
            className="input grow"
            placeholderText="Select end date"
            required
          />
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            type="text"
            name="customerName"
            defaultValue={username}
            className="input grow"
            required
          />
        </div>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Email</label>
          <input
            type="text"
            name="email"
            placeholder="Eg: john@example.com"
            className="input grow"
            required
          />
          {emailError && (
            <p className="mt-2 rounded-e-md bg-red-100 p-2 text-xs text-red-700">
              {emailError}
            </p>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <input
            type="tel"
            name="phone"
            className="input grow"
            placeholder="Eg: 0411234567"
            required
          />
          {phoneError && (
            <p className="mt-2 rounded-e-md bg-red-100 p-2 text-xs text-red-700">
              {phoneError}
            </p>
          )}
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Driver License</label>
          <div className="grow">
            <input
              type="text"
              name="license"
              required
              placeholder="Eg: Z123456789"
              className="input w-half"
            />
            {licenseError && (
              <p className="mt-2 rounded-e-md bg-red-100 p-2 text-xs text-red-700">
                {licenseError}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />

          <button
            disabled={isSubmitting}
            type="submit"
            className="inline-block text-sm rounded-full bg-yellow-400 font-semibold uppercase tracking-wide text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed px-4 py-3 md:px-6 md:py-4"
          >
            {isSubmitting
              ? "Placing Order"
              : `Order now ${formatCurrency(totalCartPrice)}`}
          </button>
          <Button type="secondary" onClick={() => dispatch(clearCart())}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default CreateOrder;

function generateOrderNumber() {
  // Generate a random number between 100000 and 999999
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;
  return `ORDER-#${randomNumber}`;
}
