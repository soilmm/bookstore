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
    const demoBooks = [
      {
        id: 1,
        title: "ملت عشق",
        author: "الیف شافاک",
        price: 350000,
        stock: 10,
        image: "",
        description: "یک رمان محبوب و خواندنی درباره عشق، عرفان و زندگی."
      },
      {
        id: 2,
        title: "شازده کوچولو",
        author: "آنتوان دو سنت اگزوپری",
        price: 180000,
        stock: 15,
        image: "",
        description: "داستانی زیبا و ماندگار برای همه سنین."
      },
      {
        id: 3,
        title: "اثر مرکب",
        author: "دارن هاردی",
        price: 290000,
        stock: 8,
        image: "",
        description: "کتابی درباره موفقیت، عادت‌های مثبت و پیشرفت تدریجی."
      },
      {
        id: 4,
        title: "تاریخ ایران",
        author: "نویسنده نمونه",
        price: 420000,
        stock: 5,
        image: "",
        description: "مروری بر تاریخ ایران و رویدادهای مهم تاریخی."
      },
      {
        id: 5,
        title: "برنامه نویسی مقدماتی",
        author: "نویسنده نمونه",
        price: 500000,
        stock: 12,
        image: "",
        description: "کتابی آموزشی برای شروع یادگیری برنامه نویسی."
      },
      {
        id: 6,
        title: "صد سال تنهایی",
        author: "گابریل گارسیا مارکز",
        price: 450000,
        stock: 7,
        image: "",
        description: "رمانی مشهور درباره چند نسل از یک خانواده."
      },
      {
        id: 7,
        title: "جنایت و مکافات",
        author: "فئودور داستایفسکی",
        price: 520000,
        stock: 6,
        image: "",
        description: "رمانی فلسفی و روان‌شناختی درباره جرم و وجدان."
      },
      {
        id: 8,
        title: "قلعه حیوانات",
        author: "جورج اورول",
        price: 230000,
        stock: 14,
        image: "",
        description: "داستانی نمادین درباره قدرت، سیاست و جامعه."
      },
      {
        id: 9,
        title: "1984",
        author: "جورج اورول",
        price: 310000,
        stock: 9,
        image: "",
        description: "رمانی مشهور درباره کنترل جامعه و آزادی فردی."
      },
      {
        id: 10,
        title: "کیمیاگر",
        author: "پائولو کوئیلو",
        price: 280000,
        stock: 11,
        image: "",
        description: "داستانی الهام‌بخش درباره رویاها و پیدا کردن مسیر زندگی."
      },
      {
        id: 11,
        title: "انسان در جستجوی معنا",
        author: "ویکتور فرانکل",
        price: 330000,
        stock: 8,
        image: "",
        description: "کتابی درباره معنا، امید و زندگی انسان."
      },
      {
        id: 12,
        title: "بیگانه",
        author: "آلبر کامو",
        price: 270000,
        stock: 10,
        image: "",
        description: "رمانی فلسفی درباره زندگی، بیگانگی و پوچی."
      },
      {
        id: 13,
        title: "دنیای سوفی",
        author: "یوستین گوردر",
        price: 490000,
        stock: 6,
        image: "",
        description: "آشنایی جذاب با تاریخ فلسفه در قالب داستان."
      },
      {
        id: 14,
        title: "چهار اثر از فلورانس",
        author: "فلورانس اسکاول شین",
        price: 250000,
        stock: 13,
        image: "",
        description: "کتابی درباره نگرش مثبت و رشد فردی."
      },
      {
        id: 15,
        title: "باشگاه پنج صبحی‌ها",
        author: "رابین شارما",
        price: 360000,
        stock: 9,
        image: "",
        description: "کتابی درباره نظم شخصی، عادت‌های صبحگاهی و موفقیت."
      },
      {
        id: 16,
        title: "ثروتمندترین مرد بابل",
        author: "جورج کلاسون",
        price: 240000,
        stock: 12,
        image: "",
        description: "اصول ساده و کاربردی مدیریت پول و ثروت."
      },
      {
        id: 17,
        title: "پدر پولدار پدر بی پول",
        author: "رابرت کیوساکی",
        price: 390000,
        stock: 8,
        image: "",
        description: "کتابی درباره سواد مالی و نگرش نسبت به پول."
      },
      {
        id: 18,
        title: "عادت‌های اتمی",
        author: "جیمز کلیر",
        price: 420000,
        stock: 15,
        image: "",
        description: "راهنمای ساخت عادت‌های خوب و حذف عادت‌های بد."
      },
      {
        id: 19,
        title: "قدرت عادت",
        author: "چارلز دوهیگ",
        price: 340000,
        stock: 7,
        image: "",
        description: "بررسی علمی نقش عادت‌ها در زندگی و موفقیت."
      },
      {
        id: 20,
        title: "باشگاه مشت‌زنی",
        author: "چاک پالانیک",
        price: 310000,
        stock: 5,
        image: "",
        description: "رمانی متفاوت درباره هویت، جامعه و زندگی مدرن."
      },
      {
        id: 21,
        title: "غرور و تعصب",
        author: "جین آستن",
        price: 300000,
        stock: 10,
        image: "",
        description: "یکی از مشهورترین رمان‌های کلاسیک جهان."
      },
      {
        id: 22,
        title: "بلندی‌های بادگیر",
        author: "امیلی برونته",
        price: 320000,
        stock: 6,
        image:"",
        description: "داستانی کلاسیک درباره عشق، انتقام و روابط انسانی."
      },
      {
        id: 23,
        title: "مردی به نام اوه",
        author: "فردریک بکمن",
        price: 410000,
        stock: 9,
        image: "",
        description: "داستانی احساسی و سرگرم‌کننده درباره زندگی و انسان‌ها."
      },
      {
        id: 24,
        title: "کتابخانه نیمه شب",
        author: "مت هیگ",
        price: 450000,
        stock: 11,
        image: "",
        description: "داستانی درباره انتخاب‌های زندگی و فرصت‌های دوباره."
      },
      {
        id: 25,
        title: "دختری در قطار",
        author: "پائولا هاوکینز",
        price: 370000,
        stock: 8,
        image: "",
        description: "رمانی معمایی و هیجان‌انگیز."
      },
      {
        id: 26,
        title: "جزء از کل",
        author: "استیو تولتز",
        price: 480000,
        stock: 5,
        image: "",
        description: "رمانی جذاب با داستانی متفاوت و طنزآمیز."
      },
      {
        id: 27,
        title: "سمفونی مردگان",
        author: "عباس معروفی",
        price: 360000,
        stock: 7,
        image: "",
        description: "رمانی مشهور از ادبیات معاصر ایران."
      },
      {
        id: 28,
        title: "چشم‌هایش",
        author: "بزرگ علوی",
        price: 290000,
        stock: 10,
        image: "",
        description: "رمانی ماندگار از ادبیات معاصر ایران."
      },
      {
        id: 29,
        title: "سووشون",
        author: "سیمین دانشور",
        price: 340000,
        stock: 9,
        image: "",
        description: "یکی از آثار مهم ادبیات داستانی ایران."
      },
      {
        id: 30,
        title: "بوف کور",
        author: "صادق هدایت",
        price: 260000,
        stock: 6,
        image: "",
        description: "اثری مشهور و تأثیرگذار در ادبیات فارسی."
      },
      {
        id: 31,
        title: "کوری",
        author: "ژوزه ساراماگو",
        price: 430000,
        stock: 8,
        image: "",
        description: "رمانی فلسفی و اجتماعی درباره انسان و جامعه."
      },
      {
        id: 32,
        title: "مزرعه حیوانات",
        author: "جورج اورول",
        price: 220000,
        stock: 13,
        image: "",
        description: "داستانی نمادین و سیاسی درباره قدرت."
      },
      {
        id: 33,
        title: "مغازه خودکشی",
        author: "ژان تولی",
        price: 280000,
        stock: 7,
        image: "",
        description: "داستانی متفاوت با فضای طنز و سیاه."
      },
      {
        id: 34,
        title: "ملت‌های گمشده",
        author: "نویسنده نمونه",
        price: 310000,
        stock: 5,
        image: "",
        description: "کتابی درباره تاریخ و فرهنگ ملت‌های مختلف."
      },
      {
        id: 35,
        title: "آشنایی با شبکه‌های کامپیوتری",
        author: "نویسنده نمونه",
        price: 550000,
        stock: 10,
        image: "",
        description: "کتابی آموزشی درباره شبکه‌های کامپیوتری."
      },
      {
        id: 36,
        title: "آموزش جاوااسکریپت",
        author: "نویسنده نمونه",
        price: 620000,
        stock: 8,
        image: "",
        description: "آموزش مفاهیم و برنامه نویسی با JavaScript."
      },
      {
        id: 37,
        title: "آموزش React",
        author: "نویسنده نمونه",
        price: 680000,
        stock: 6,
        image: "",
        description: "کتابی آموزشی برای یادگیری React و توسعه رابط کاربری."
      },
      {
        id: 38,
        title: "آموزش HTML و CSS",
        author: "نویسنده نمونه",
        price: 390000,
        stock: 12,
        image: "",
        description: "آموزش طراحی صفحات وب با HTML و CSS."
      },
      {
        id: 39,
        title: "مبانی پایگاه داده",
        author: "نویسنده نمونه",
        price: 470000,
        stock: 9,
        image: "",
        description: "آشنایی با مفاهیم پایگاه داده و SQL."
      },
      {
        id: 40,
        title: "مهندسی نرم افزار",
        author: "نویسنده نمونه",
        price: 580000,
        stock: 7,
        image: "",
        description: "آشنایی با تحلیل، طراحی و توسعه نرم افزار."
      }
    ];
  
    setBooks(demoBooks);
  
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