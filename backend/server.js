const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

// تست اتصال به دیتابیس
app.get("/", (req, res) => {
    res.json({
        message: "Bookstore API is running"
    });
});

// دریافت لیست کتاب‌ها
app.get("/api/books", async (req, res) => {
    try {
        const [books] = await pool.query(`
            SELECT 
                books.id,
                books.title,
                books.author,
                books.price,
                books.stock,
                books.description,
                books.image,
                categories.name AS category
            FROM books
            LEFT JOIN categories 
            ON books.category_id = categories.id
            ORDER BY books.id DESC
        `);

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "خطا در دریافت کتاب‌ها"
        });
    }
});

// ثبت نام
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "همه فیلدها را وارد کنید"
            });
        }

        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                message: "این ایمیل قبلاً ثبت شده است"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "ثبت نام با موفقیت انجام شد"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "خطا در ثبت نام"
        });
    }
});

// ورود
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "ایمیل یا رمز عبور اشتباه است"
            });
        }

        const user = users[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "ایمیل یا رمز عبور اشتباه است"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            message: "ورود موفقیت آمیز بود",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "خطا در ورود"
        });
    }
});
// ===============================
// احراز هویت با JWT
// ===============================

function authenticateToken(req, res, next) {
    // ===============================
// ADMIN MIDDLEWARE
// ===============================

function adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "دسترسی فقط برای مدیر مجاز است"
        });
    }

    next();
}


// ===============================
// ADMIN - دریافت همه کتاب‌ها
// ===============================

app.get(
    "/api/admin/books",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const [books] = await pool.query(`
                SELECT
                    books.id,
                    books.title,
                    books.author,
                    books.price,
                    books.stock,
                    books.description,
                    books.category_id,
                    categories.name AS category_name
                FROM books
                LEFT JOIN categories
                    ON books.category_id = categories.id
                ORDER BY books.id DESC
            `);

            res.json(books);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "خطا در دریافت کتاب‌ها"
            });
        }
    }
);


// ===============================
// ADMIN - افزودن کتاب
// ===============================

app.post(
    "/api/admin/books",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const {
                title,
                author,
                price,
                stock,
                description,
                category_id
            } = req.body;

            if (!title || price === undefined) {
                return res.status(400).json({
                    message: "عنوان و قیمت کتاب الزامی است"
                });
            }

            const [result] = await pool.query(
                `INSERT INTO books
                (title, author, price, stock, description, category_id)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    title,
                    author || null,
                    Number(price),
                    Number(stock) || 0,
                    description || null,
                    category_id || null
                ]
            );

            res.status(201).json({
                message: "کتاب با موفقیت اضافه شد",
                bookId: result.insertId
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "خطا در افزودن کتاب"
            });
        }
    }
);


// ===============================
// ADMIN - ویرایش کتاب
// ===============================

app.put(
    "/api/admin/books/:id",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const bookId = req.params.id;

            const {
                title,
                author,
                price,
                stock,
                description,
                category_id
            } = req.body;

            const [result] = await pool.query(
                `UPDATE books
                 SET
                    title = ?,
                    author = ?,
                    price = ?,
                    stock = ?,
                    description = ?,
                    category_id = ?
                 WHERE id = ?`,
                [
                    title,
                    author || null,
                    Number(price),
                    Number(stock),
                    description || null,
                    category_id || null,
                    bookId
                ]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "کتاب پیدا نشد"
                });
            }

            res.json({
                message: "کتاب با موفقیت ویرایش شد"
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message:"خطا در ویرایش کتاب"
            });
        }
    }
);
// ===============================
// ADMIN - حذف کتاب
// ===============================

app.delete(
    "/api/admin/books/:id",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const bookId = req.params.id;

            const [result] = await pool.query(
                `DELETE FROM books
                 WHERE id = ?`,
                [bookId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "کتاب پیدا نشد"
                });
            }

            res.json({
                message: "کتاب با موفقیت حذف شد"
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "خطا در حذف کتاب"
            });
        }
    }
);


// ===============================
// ADMIN - دریافت همه سفارش‌ها
// ===============================

app.get(
    "/api/admin/orders",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const [orders] = await pool.query(`
                SELECT
                    orders.id,
                    orders.total_price,
                    orders.status,
                    orders.created_at,
                    users.name AS user_name,
                    users.email AS user_email
                FROM orders
                INNER JOIN users
                    ON orders.user_id = users.id
                ORDER BY orders.created_at DESC
            `);

            res.json(orders);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "خطا در دریافت سفارش‌ها"
            });
        }
    }
);


// ===============================
// ADMIN - تغییر وضعیت سفارش
// ===============================

app.put(
    "/api/admin/orders/:id/status",
    authenticateToken,
    adminOnly,
    async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status } = req.body;

            const allowedStatuses = [
                "pending",
                "paid",
                "shipped",
                "completed",
                "cancelled"
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    message: "وضعیت سفارش نامعتبر است"
                });
            }

            const [result] = await pool.query(
                `UPDATE orders
                 SET status = ?
                 WHERE id = ?`,
                [status, orderId]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "سفارش پیدا نشد"
                });
            }

            res.json({
                message: "وضعیت سفارش تغییر کرد"
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "خطا در تغییر وضعیت سفارش"
            });
        }
    }
);
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "لطفاً ابتدا وارد حساب کاربری شوید"
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, user) => {
            if (error) {
                return res.status(403).json({
                    message: "توکن نامعتبر یا منقضی شده است"
                });
            }

            req.user = user;
            next();
        }
    );
}

// ===============================
// ثبت سفارش
// ===============================

app.post("/api/orders", authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "سبد خرید خالی است"
            });
        }

        await connection.beginTransaction();

        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const [books] = await connection.query(
                `SELECT id, title, price, stock
                 FROM books
                 WHERE id = ?
                 FOR UPDATE`,
                [item.id]
            );

            if (books.length === 0) {
                throw new Error("کتاب پیدا نشد");
            }

            const book = books[0];
            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw new Error("تعداد کتاب نامعتبر است");
            }

            if (book.stock < quantity) {
                throw new Error(
                    `موجودی کتاب «${book.title}» کافی نیست`
                );
            }

            totalPrice += Number(book.price) * quantity;

            orderItems.push({
                bookId: book.id,
                quantity: quantity,
                price: book.price
            });
        }

        // ایجاد سفارش
        const [orderResult] = await connection.query(
            `INSERT INTO orders
             (user_id, total_price, status)
             VALUES (?, ?, 'pending')`,
            [req.user.id, totalPrice]
        );

        const orderId = orderResult.insertId;

        // ثبت کتاب‌های سفارش
        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items
                 (order_id, book_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.bookId,
                    item.quantity,
                    item.price
                ]
            );

            // کاهش موجودی
            await connection.query(
                `UPDATE books
                 SET stock = stock - ?
                 WHERE id = ?`,
                [
                    item.quantity,
                    item.bookId
                ]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: "سفارش با موفقیت ثبت شد",
            orderId: orderId,
            totalPrice: totalPrice,
            status: "pending"
        });

    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            message: error.message || "خطا در ثبت سفارش"
        });

    } finally {
        connection.release();
    }
});

// ===============================
// دریافت سفارش‌های کاربر
// ===============================

app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT
                id,
                total_price,
                status,
                created_at
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
             [req.user.id]
         );
 
         res.json(orders);
 
     } catch (error) {
         console.error(error);
 
         res.status(500).json({
             message: "خطا در دریافت سفارش‌ها"
         });
     }
 });

// شروع سرور
app.listen(PORT, async () => {
    try {
        await pool.query("SELECT 1");
        console.log("MySQL Connected!");
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error("MySQL connection error:", error.message);
    }
});