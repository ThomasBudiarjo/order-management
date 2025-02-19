import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const data = await pb.collection("orders").getFullList({
        sort: "-created",
      });
      setOrders(data);
    } catch {
      // alert("Failed to fetch orders");
    }
  };

  const handleStatusChange = async (order, itemIndex) => {
    try {
      const updatedItems = [...order.order.items];
      updatedItems[itemIndex].status =
        updatedItems[itemIndex].status === "pending" ? "done" : "pending";

      await pb.collection("orders").update(order.id, {
        order: {
          items: updatedItems,
        },
      });

      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? { ...order, order: { ...order.order, items: updatedItems } }
            : o
        )
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const handleDoneAll = async (order) => {
    try {
      const updatedItems = order.order.items.map((item) => ({
        ...item,
        status: "done",
      }));
      await pb.collection("orders").update(order.id, {
        order: {
          items: updatedItems,
        },
      });

      setOrders(
        orders.map((o) =>
          o.id === order.id
            ? { ...order, order: { ...order.order, items: updatedItems } }
            : o
        )
      );
    } catch {
      alert("Failed to update all items");
    }
  };

  const handleDelete = async (order) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (!confirmed) return;
      await pb.collection("orders").delete(order.id);
      setOrders(orders.filter((o) => o.id !== order.id));
    } catch {
      alert("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const unsubscribe = pb.collection("orders").subscribe("*", async (e) => {
      if (e.action === "create") {
        // Check if order already exists before adding
        setOrders((prevOrders) => {
          if (prevOrders.some((order) => order.id === e.record.id)) {
            return prevOrders;
          }
          return [e.record, ...prevOrders];
        });
      } else if (e.action === "update") {
        // Update the order in the list
        const updatedOrder = e.record;
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else if (e.action === "delete") {
        // Remove the deleted order
        const deletedId = e.record.id;
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== deletedId)
        );
      }
    });

    // Cleanup subscription on unmount
    return () => {
      pb.collection("orders").unsubscribe(unsubscribe);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "2rem",
        padding: "2rem",
        maxWidth: "100%",
      }}
    >
      {orders.map((order) => (
        <article
          key={order.id}
          style={{
            flex: "1 1 1 1 1",
            minWidth: "250px",
            alignItems: "flex-start",
            backgroundColor: "#333",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <h4>Order List</h4>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <h5>Name:</h5>
            <p>{order.name}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <h5>Table:</h5>
            <p>{order.table_number}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h5 style={{ marginBottom: "0" }}>Order:</h5>
            <div style={{ display: "flex", gap: ".5rem" }}>
              <button
                style={{
                  backgroundColor: "green",
                  padding: "0.1rem 1rem",
                  fontSize: ".5rem",
                }}
                onClick={() => handleDoneAll(order)}
              >
                Done All
              </button>
              <button
                style={{
                  backgroundColor: "red",
                  padding: "0.1rem 1rem",
                  fontSize: ".5rem",
                }}
                onClick={() => handleDelete(order)}
              >
                Delete order
              </button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {order.order.items.map((item, index) => (
                <tr key={`${order.id}-${index}`}>
                  <td>{item.item}</td>
                  <td>
                    <input
                      name={`status-${order.id}-${index}`}
                      type="checkbox"
                      role="switch"
                      checked={item.status === "done"}
                      onChange={() => handleStatusChange(order, index)}
                      style={{ alignItems: "center" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      ))}
    </div>
  );
};

export default OrderList;
