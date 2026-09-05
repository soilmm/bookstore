import { useEffect, useState } from "react";

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const token = localStorage.getItem("token");

  // ===============================
  // دریافت کتاب‌ها
  // ===============================

  const getBooks = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/books",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "خطا در دریافت کتاب‌ها");
        return;
      }

      setBooks(data);
    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // ===============================
  // دریافت سفارش‌ها
  // ===============================

  const getOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/orders",
        {
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
    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // ===============================
  // اجرای اولیه
  // ===============================

  useEffect(() => {
    getBooks();
    getOrders();
  }, []);

  // ===============================
  // پاک کردن فرم
  // ===============================

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
    setStock("");
    setDescription("");
    setCategoryId("");
    setEditingBook(null);
  };

  // ===============================
  // باز کردن فرم ویرایش
  // ===============================

  const editBook = (book) => {
    setEditingBook(book);

    setTitle(book.title || "");
    setAuthor(book.author || "");
    setPrice(book.price || "");
    setStock(book.stock || "");
    setDescription(book.description || "");
    setCategoryId(book.category_id || "");

    setShowBookForm(true);
  };

  // ===============================
  // ذخیره کتاب
  // ===============================

  const saveBook = async () => {
    if (!title || !price) {
      alert("عنوان و قیمت کتاب را وارد کنید");
      return;
    }

    const bookData = {
      title,
      author,
      price: Number(price),
      stock: Number(stock) || 0,
      description,
      category_id: categoryId
        ? Number(categoryId)
        : null,
    };

    try {
      let response;

      if (editingBook) {
        response = await fetch(
          `http://localhost:5000/api/admin/books/${editingBook.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/admin/books",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bookData),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "عملیات ناموفق بود");
        return;
      }

      alert(
        editingBook
          ? "کتاب با موفقیت ویرایش شد"
          : "کتاب با موفقیت اضافه شد"
          );

      clearForm();
      setShowBookForm(false);

      getBooks();
    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // ===============================
  // حذف کتاب
  // ===============================

  const deleteBook = async (id) => {
    const confirmed = window.confirm(
      "آیا از حذف این کتاب مطمئن هستید؟"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "حذف کتاب ناموفق بود");
        return;
      }

      alert("کتاب با موفقیت حذف شد");

      getBooks();
    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };

  // ===============================
  // تغییر وضعیت سفارش
  // ===============================

  const changeOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "تغییر وضعیت ناموفق بود");
        return;
      }

      alert("وضعیت سفارش تغییر کرد");

      getOrders();
    } catch (error) {
      console.error(error);
      alert("ارتباط با سرور برقرار نشد");
    }
  };
  // ===============================
  // ظاهر پنل مدیریت
  // ===============================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
        direction: "rtl",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* عنوان */}
        <div
          style={{
            background: "#2563eb",
            color: "white",
            padding: "25px",
            borderRadius: "18px",
            marginBottom: "25px",
          }}
        >
          <h1 style={{ margin: 0 }}>
            👨‍💼 پنل مدیریت فروشگاه
          </h1>

          <p style={{ marginBottom: 0 }}>
            مدیریت کتاب‌ها و سفارش‌های فروشگاه
          </p>
        </div>

        {/* دکمه افزودن کتاب */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => {
              clearForm();
              setShowBookForm(true);
            }}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "13px 22px",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            ➕ افزودن کتاب جدید
          </button>
        </div>

        {/* فرم افزودن / ویرایش */}
        {showBookForm && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "25px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <h2>
              {editingBook
                ? "✏️ ویرایش کتاب"
                : "➕ افزودن کتاب"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "15px",
              }}
            >
              <input
                type="text"
                placeholder="عنوان کتاب"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="نویسنده"
                value={author}
                onChange={(e) =>
                  setAuthor(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="قیمت"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="موجودی"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="شناسه دسته‌بندی"
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
              />
            </div>

            <textarea
              placeholder="توضیحات کتاب"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              style={{
                width: "100%",
                minHeight: "100px",
                marginTop: "15px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontFamily: "inherit",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={saveBook}
                style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 25px",
                    cursor: "pointer",
                  }}
                >
                  💾 ذخیره
                </button>
  
                <button
                  onClick={() => {
                    clearForm();
                    setShowBookForm(false);
                  }}
                  style={{
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 25px",
                    cursor: "pointer",
                  }}
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
  
          {/* ===============================
              لیست کتاب‌ها
          =============================== */}
  
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              marginBottom: "30px",
              overflowX: "auto",
            }}
          >
            <h2>📚 مدیریت کتاب‌ها</h2>
  
            {books.length === 0 ? (
              <p>کتابی وجود ندارد.</p>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f1f5f9",
                    }}
                  >
                    <th style={{ padding: "12px" }}>
                      شناسه
                    </th>
  
                    <th style={{ padding: "12px" }}>
                      عنوان
                    </th>
  
                    <th style={{ padding: "12px" }}>
                      نویسنده
                    </th>
  
                    <th style={{ padding: "12px" }}>
                      قیمت
                    </th>
  
                    <th style={{ padding: "12px" }}>
                      موجودی
                    </th>
  
                    <th style={{ padding: "12px" }}>
                      عملیات
                    </th>
                  </tr>
                </thead>
  
                <tbody>
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      style={{
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        {book.id}
                      </td>
  
                      <td style={{ padding: "12px" }}>
                        {book.title}
                      </td>
  
                      <td style={{ padding: "12px" }}>
                        {book.author || "-"}
                      </td>
  
                      <td style={{ padding: "12px" }}>
                        {Number(
                          book.price
                        ).toLocaleString()}{" "}
                        تومان
                      </td>
  
                      <td style={{ padding: "12px" }}>
                        {book.stock}
                      </td>
  
                      <td
                        style={{
                          padding: "12px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() =>
                            editBook(book)
                          }
                          style={{
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                          }}
                        >
                          ✏️ ویرایش
                        </button>
  
                        <button onClick={() =>
                          deleteBook(book.id)
                        }
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️ حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ===============================
            سفارش‌ها
        =============================== */}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            overflowX: "auto",
          }}
        >
          <h2>📦 مدیریت سفارش‌ها</h2>

          {orders.length === 0 ? (
            <p>هنوز سفارشی ثبت نشده است.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f1f5f9",
                  }}
                >
                  <th style={{ padding: "12px" }}>
                    سفارش
                  </th>

                  <th style={{ padding: "12px" }}>
                    مشتری
                  </th>

                  <th style={{ padding: "12px" }}>
                    ایمیل
                  </th>

                  <th style={{ padding: "12px" }}>
                    مبلغ
                  </th>

                  <th style={{ padding: "12px" }}>
                    وضعیت
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      #{order.id}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {order.user_name}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {order.user_email}
                    </td>

                    <td style={{ padding: "12px" }}>
                      {Number(
                        order.total_price
                      ).toLocaleString()}{" "}
                      تومان
                    </td>

                    <td style={{ padding: "12px" }}>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeOrderStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border:
                            "1px solid #ddd",
                        }}
                      >
                        <option value="pending">
                          در انتظار پرداخت
                        </option>

                        <option value="paid">
                          پرداخت شده
                        </option>

                        <option value="shipped">
                          ارسال شده
                        </option>

                        <option value="completed">
                          تکمیل شده
                        </option>

                        <option value="cancelled">
                          لغو شده
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;