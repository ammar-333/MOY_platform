import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div>
      <nav>navbar</nav>
      <hr />
      <Outlet /> {/* renders child routes */}
      <hr />
      <footer>footer</footer>
    </div>
  );
}

export default AppLayout;
