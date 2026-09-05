import { useEffect, useState } from "react";
import "./App.css";
import AdminPanel from "./AdminPanel.jsx";
function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  // ورود
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // ثبت نام
  const [showRegister, setShowRegister] = useState(false);
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // دریافت کتاب‌ها
  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error(error));

    // بررسی کاربر ذخیره شده
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ورود
  const login = async () => {
    if (!email || !password) {
      alert("ایمیل و رمز عبور را وارد کنید");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "ورود ناموفق بود");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      setEmail("");
      setPassword("");

      setShowLogin(false);

      alert("ورود با موفقیت انجام شد");

    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // ثبت نام
  const register = async () => {
    if (!name || !registerEmail || !registerPassword) {
      alert("همه فیلدها را وارد کنید");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "ثبت نام ناموفق بود");
        return;
      }

      alert("ثبت نام با موفقیت انجام شد");

      setName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setShowRegister(false);
      setShowLogin(true);

    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // خروج
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    alert("از حساب کاربری خارج شدید");
  };
  // دریافت سفارش‌های کاربر
  const getOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("برای مشاهده سفارش‌ها ابتدا وارد حساب کاربری شوید");
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "خطا در دریافت سفارش‌ها");
        return;
      }

      setOrders(data);
      setShowOrders(true);

    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };
  // اضافه کردن کتاب به سبد
  const addToCart = (book) => {
    setCart((currentCart) => {
      const existingBook = currentCart.find(
        (item) => item.id === book.id
      );

      if (existingBook) {
        return currentCart.map((item) =>
          item.id === book.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...book,
          quantity: 1,
        },
      ];
    });

    alert("کتاب به سبد خرید اضافه شد");
  };

  // افزایش تعداد
  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // کاهش تعداد
  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // حذف از سبد
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // محاسبه مبلغ کل
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price) * item.quantity,
      0
    );
  };

  // ثبت سفارش
  const checkout = async () => {
    if (cart.length === 0) {
      alert("سبد خرید خالی است");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("برای ثبت سفارش ابتدا وارد حساب کاربری شوید");
      setShowCart(false);
      setShowLogin(true);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: cart.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "ثبت سفارش ناموفق بود");
        return;
      }

      alert(
        `سفارش با موفقیت ثبت شد\nشماره سفارش: ${data.orderId}\nمبلغ: ${Number(
          data.totalPrice
        ).toLocaleString()} تومان`
      );

      setCart([]);
      setShowCart(false);

      // دوباره دریافت کتاب‌ها برای بروزرسانی موجودی
      const booksResponse = await fetch(
        "http://localhost:5000/api/books"
      );

      const booksData = await booksResponse.json();

      setBooks(booksData);

    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // تعداد کل کتاب‌های داخل سبد
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  return (
  
      <div className="app">
    
        {showAdmin ? (
          <>
            <button
              onClick={() => setShowAdmin(false)}
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 5000,
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ← بازگشت به فروشگاه
            </button>
    
            <AdminPanel />
          </>
        ) : (
          <>

      {/* هدر */}
      <header className="header">

        <div className="logo">
          📚 کتاب‌فروشی
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="جستجوی کتاب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="header-actions">
{/* سفارش‌های من */}
{user && (
  <>
    <button
      className="orders-button"
      onClick={getOrders}
    >
      📦 سفارش‌های من
    </button>

    {user.role === "admin" && (
      <button
        className="orders-button"
        onClick={() => setShowAdmin(true)}
      >
        👨‍💼 پنل مدیریت
      </button>
    )}
  </>
)}
          {/* سبد خرید */}
          <button
            className="cart-button"
            onClick={() => setShowCart(true)}
          >
            🛒 سبد خرید
            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </button>

          {/* کاربر */}
          {user ? (
            <div className="user-section">

              <span className="user-name">
                👤 {user.name}
              </span>

              <button
                className="logout-button"
                onClick={logout}
              >
                خروج
              </button>

            </div>
          ) : (
            <button
              className="login-button"
              onClick={() => setShowLogin(true)}
            >
              ورود
            </button>
          )}

        </div>

      </header>

      {/* پنجره ورود */}
      {showLogin && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() => setShowLogin(false)}
            >
              ✕
            </button>

            <h2>ورود به حساب کاربری</h2>

            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="رمز عبور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="submit-button"
              onClick={login}
            >
              ورود
            </button>

            <p>
              حساب کاربری ندارید؟
              <button
                className="switch-button"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                ثبت نام
              </button>
            </p>

          </div>

        </div>
      )}

      {/* پنجره ثبت نام */}
      {showRegister && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>

            <h2>ثبت نام</h2>

            <input
              type="text"
              placeholder="نام و نام خانوادگی"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="ایمیل"
              value={registerEmail}
              onChange={(e) =>
                setRegisterEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="رمز عبور"
              value={registerPassword}
              onChange={(e) =>
                setRegisterPassword(e.target.value)
              }
            />

            <button
              className="submit-button"
              onClick={register}
            >
              ثبت نام
            </button>

            <p>
              قبلاً ثبت نام کرده‌اید؟
              <button
                className="switch-button"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                ورود
              </button>
            </p>

          </div>

        </div>
      )}
{/* لیست کتاب‌ها */}
<main className="books-container">

<h1>کتاب‌ها</h1>

<div className="books-grid">

  {books
    .filter((book) =>
      book.title
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .map((book) => (

      <div
        className="book-card"
        key={book.id}
      >

        {book.image && (
          <img
            src={book.image}
            alt={book.title}
            className="book-image"
          />
        )}

        <h3>{book.title}</h3>

        <p className="author">
          نویسنده: {book.author}
        </p>

        <p className="price">
          {Number(book.price).toLocaleString()} تومان
        </p>

        <p>
          موجودی: {book.stock}
        </p>

        <div className="book-buttons">

          <button
            onClick={() => setSelectedBook(book)}
          >
            جزئیات
          </button>

          <button
            onClick={() => addToCart(book)}
            disabled={book.stock <= 0}
          >
            {book.stock > 0
              ? "افزودن به سبد"
              : "ناموجود"}
          </button>

        </div>

      </div>

    ))}

</div>

</main>

{/* جزئیات کتاب */}
{selectedBook && (
<div className="modal-overlay">

  <div className="modal book-details">

    <button
      className="close-button"
      onClick={() => setSelectedBook(null)}
    >
      ✕
    </button>

    <h2>{selectedBook.title}</h2>

    <p>
      <strong>نویسنده:</strong>{" "}
      {selectedBook.author}
    </p>

    <p>
      <strong>قیمت:</strong>{" "}
      {Number(
        selectedBook.price
      ).toLocaleString()} تومان
    </p>

    <p>
      <strong>موجودی:</strong>{" "}
      {selectedBook.stock}
    </p>

    <p>
      <strong>توضیحات:</strong>
    </p>

    <p>
      {selectedBook.description ||
        "توضیحی برای این کتاب ثبت نشده است."}
    </p>

    <button
      className="submit-button"
      onClick={() => {
        addToCart(selectedBook);
        setSelectedBook(null);
      }}
      disabled={selectedBook.stock <= 0}
    >
      {selectedBook.stock > 0
        ? "افزودن به سبد خرید"
        : "ناموجود"}
    </button>

  </div>

</div>
)}
{/* سفارش‌های من */}
{showOrders && (
        <div className="modal-overlay">

          <div className="modal orders-modal">

            <button
              className="close-button"
              onClick={() => setShowOrders(false)}
            >
              ✕
            </button>

            <h2>📦 سفارش‌های من</h2>

            {orders.length === 0 ? (

              <p className="empty-orders">
                هنوز سفارشی ثبت نکرده‌اید.
              </p>

            ) : (

              <div className="orders-list">

                {orders.map((order) => (

                  <div
                    className="order-card"
                    key={order.id}
                  >

                    <div className="order-header">

                      <h3>
                        سفارش شماره #{order.id}
                      </h3>

                      <span className={`order-status ${order.status}`}>
                        {order.status === "pending"
                          ? "در انتظار پرداخت"
                          : order.status === "paid"
                          ? "پرداخت شده"
                          : order.status === "shipped"
                          ? "ارسال شده"
                          : order.status === "completed"
                          ? "تکمیل شده"
                          : order.status === "cancelled"
                          ? "لغو شده"
                          : order.status}
                      </span>

                    </div>

                    <p>
                      مبلغ سفارش:{" "}
                      <strong>
                        {Number(
                          order.total_price
                        ).toLocaleString()} تومان
                      </strong>
                    </p>

                    <p>
                      تاریخ سفارش:{" "}
                      {new Date(
                        order.created_at
                      ).toLocaleDateString("fa-IR")}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      )}
{/* سبد خرید */}
{showCart && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflowY: "auto",
              borderRadius: "15px",
              padding: "25px",
              direction: "rtl",
              color: "#222",
            }}
          >
            <button
              onClick={() => setShowCart(false)}
              style={{
                float: "left",
                fontSize: "20px",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2>🛒 سبد خرید</h2>

            {cart.length === 0 ? (
              <p>سبد خرید شما خالی است.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {Number(item.price).toLocaleString()} تومان
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>

                      <span style={{ margin: "0 15px" }}>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        -
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                    >
                      حذف
                    </button>
                  </div>
                ))}

                <h3>
                  مبلغ کل:{" "}
                  {getTotalPrice().toLocaleString()} تومان
                </h3>

                <button
                  onClick={checkout}
                  style={{
                    width: "100%",
                    padding: "15px",
                    marginTop: "15px",
                    cursor: "pointer",
                  }}
                >
                  ثبت سفارش
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* فوتر */}
      <footer className="footer">

        <p>
          © 2026 فروشگاه کتاب - تمامی حقوق محفوظ است
        </p>

      </footer>
</>
        )}
    </div>
  );
}

export default App;