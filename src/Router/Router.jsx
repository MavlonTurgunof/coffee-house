import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Menu from "../pages/Menu";
import AppLayout from "../pages/AppLayout";
import Cart from "../pages/Cart";

import WishlistPage from "../pages/WishlistPage";
import Registration from "../pages/Registration";
import SignIn from "../pages/SignIn";
import Order from "../pages/Order";
import Confirmation from "../pages/Confirmation";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Main />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/order" element={<Order />} />
          <Route path="/order/confirmed/:orderId" element={<Confirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
