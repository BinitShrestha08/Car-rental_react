import { Outlet } from "react-router-dom";
import Header from "./Header";
// import CartOverview from "../features/cart/CartOverview";

function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <div className=" overflow-scroll">
        <main className="mx-auto bg-grey">
          <Outlet />
        </main>
      </div>
      {/* <CartOverview /> */}
    </div>
  );
}

export default AppLayout;
