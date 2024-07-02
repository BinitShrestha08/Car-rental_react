import { Link, useLocation } from "react-router-dom";
import ProductSearch from "../features/menu/ProductSearch";

import ShoppingCartSharpIcon from "@mui/icons-material/ShoppingCartSharp";

function Header() {
  const location = useLocation();
  const selectedRoutes = ["/", "/cart", "/order/confirm"];
  const shouldRenderSearch = selectedRoutes.includes(location.pathname);

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-yellow-500 px-4 uppercase sm:px-6">
      <Link to="/" className="tracking-widest flex items-center">
        <img className="h-24" src="../public/logo.png" alt="Go Products logo" />
      </Link>

      {!shouldRenderSearch && <ProductSearch />}
      <Link to="/cart">
        <ShoppingCartSharpIcon />
      </Link>
    </header>
  );
}

export default Header;
