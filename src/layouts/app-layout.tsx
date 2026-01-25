import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <Navbar />
      <hr />
      <Outlet /> {/* renders child routes */}
      <hr />
      <Footer />
    </div>
  );
}

export default AppLayout;
