import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Order from "./Order";
import OrderList from "./OrderList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Order />} />
        <Route path={import.meta.env.VITE_ORDER_LIST_PATH} element={<OrderList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
