import { Route, RouterProvider, Routes } from "react-router-dom";
import LandingPage from "./views/LandingPage";
import AdminLayOut from "./views/AdminLayOut";
import OrderById from "./components/admin/OrderById";
import DashBoard from "./components/admin/DashBoard";
import ProductAdmin from "./components/admin/ProductAdmin";
import TambahProduct from "./components/admin/TambahProduct";
import EditProduct from "./components/admin/EditProduct";
import SignIn from "./components/admin/sign-in";

function App() {
  return (
    <main className="h-screen">
      <Routes>
        {/* public */}
        <Route path="/" element={<LandingPage />} />

        <Route path="sign-in" element={<SignIn />} />

        {/** private */}

        <Route path="/admin" element={<AdminLayOut />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="product" element={<ProductAdmin />} />
          <Route path="product/tambah" element={<TambahProduct />} />
          <Route path="product/:id/edit" element={<EditProduct />} />
          <Route path="dashboard/order/:id" element={<OrderById />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
