import { useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

const Order = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [itemInput, setItemInput] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [isNameInvalid, setIsNameInvalid] = useState(false);
  const [isOrderInvalid, setIsOrderInvalid] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAnimation, setDialogAnimation] = useState("");

  const addOrderItem = (e) => {
    e.preventDefault();
    if (!itemInput.trim()) return;

    setOrderItems([
      ...orderItems,
      { item: itemInput.trim(), status: "pending" },
    ]);
    setItemInput("");
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setIsNameInvalid(true);
      //scroll up
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (orderItems.length === 0) {
      setIsOrderInvalid(true);
      return;
    }

    try {
      const orderData = { items: orderItems };
      await pb.collection("orders").create({
        name,
        table_number: number,
        order: orderData,
      });
      setName("");
      setNumber("");
      setOrderItems([]);
      setIsDialogOpen(true);
      setDialogAnimation("modal-is-opening");
      setTimeout(() => {
        closeDialog();
      }, 2000);
    } catch {
      alert("Failed to create order");
    }
  };

  const closeDialog = () => {
    setDialogAnimation("modal-is-closing");
    setTimeout(() => {
      setIsDialogOpen(false);
      setDialogAnimation("");
    }, 300);
  };

  return (
    <>
      <dialog open={isDialogOpen} className={dialogAnimation}>
        <article style={{ backgroundColor: "#333" }}>
          <p>Order created successfully!</p>
        </article>
      </dialog>
      <article style={{ backgroundColor: "#333" }}>
        <h4>Order Page</h4>
        <a href={import.meta.env.VITE_MENU_IMAGE_URL} target="_blank">
          Lihat menu disini
        </a>
        <form style={{ textAlign: "left" }}>
          <label htmlFor="name">Nama</label>
          <input
            required
            type="text"
            name="name"
            placeholder="Nama Pemesan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <small
            style={{
              display: isNameInvalid ? "block" : "none",
              color: "#ce7e7b",
            }}
          >
            Masukkan nama!
          </small>
          <label htmlFor="number">Nomor Meja</label>
          <input
            type="number"
            name="number"
            placeholder="Nomor Meja"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <label htmlFor="menu">Menu</label>
          <fieldset role="group" style={{ display: "flex" }}>
            <input
              style={{ flex: 1 }}
              type="text"
              name="menu"
              placeholder="{nama} - {jumlah}"
              value={itemInput}
              onChange={(e) => setItemInput(e.target.value)}
            />
            <button
              style={{ flex: 0, backgroundColor: "green" }}
              onClick={addOrderItem}
            >
              Tambah
            </button>
          </fieldset>
          <small
            style={{
              marginBottom: isOrderInvalid ? "0em" : "1em",
              color: "#7b8495",
            }}
          >
            cth: Pahe 2 (Dada) - 2
          </small>
          <small
            style={{
              display: isOrderInvalid ? "block" : "none",
              color: "#ce7e7b",
              marginBottom: "1em",
            }}
          >
            Tambahkan item ke order!
          </small>
          {orderItems.length > 0 && (
            <div>
              {orderItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5em",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      padding: "0em 1.2em 0em 0.6em",
                      wordWrap: "break-word",
                    }}
                  >
                    {item.item}
                  </span>
                  <button
                    style={{
                      flex: 0,
                      backgroundColor: "red",
                      marginBottom: "0em",
                      minWidth: "fit-content",
                      minHeight: "fit-content",
                    }}
                    type="button"
                    onClick={() => removeOrderItem(index)}
                  >
                    X
                  </button>
                </li>
              ))}
            </div>
          )}
          <button type="submit" onClick={handleSubmit}>
            Order
          </button>
        </form>
      </article>
    </>
  );
};

export default Order;
