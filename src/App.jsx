import { Route, RouterProvider, Routes } from "react-router-dom";
import LandingPage from "./views/LandingPage";
import AdminLayOut from "./views/AdminLayOut";
import OrderById from "./components/admin/OrderById";
import DashBoard from "./components/admin/DashBoard";
import ProductAdmin from "./components/admin/ProductAdmin";
import TambahProduct from "./components/admin/TambahProduct";
import EditProduct from "./components/admin/EditProduct";
import SignIn from "./components/admin/sign-in";
import ManagerSignIn from "./components/manager/ManagerSignIn";
import ManagerLayout from "./views/ManagerLayout";
import ManagerDashboard from "./components/manager/ManagerDashBoard";
import ManagerProduct from "./components/manager/ManagerProduct";
import ManagerEditProduct from "./components/manager/ManagerEditProduct";
import ManagerOrderById from "./components/manager/ManagerOrderById";

function App() {
  return (
    <main className="h-screen">
      <Routes>
        {/* public */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin */}
        <Route path="/admin/sign-in" element={<SignIn />} />

        {/** private */}
        <Route path="/admin" element={<AdminLayOut />}>
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="product" element={<ProductAdmin />} />
          <Route path="product/tambah" element={<TambahProduct />} />
          <Route path="product/:id/edit" element={<EditProduct />} />
          <Route path="dashboard/order/:id" element={<OrderById />} />
        </Route>

        {/* Manager */}
        <Route path="/manager/sign-in" element={<ManagerSignIn />} />

        {/** private */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
          <Route path="dashboard/order/:id" element={<ManagerOrderById />} />
          <Route path="product" element={<ManagerProduct />} />
          <Route path="product/:id/edit" element={<ManagerEditProduct />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
