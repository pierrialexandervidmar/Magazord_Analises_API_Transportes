-- CreateTable
CREATE TABLE "Sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coin" TEXT NOT NULL,
    "date_purchase" TEXT NOT NULL,
    "value_purchase" REAL NOT NULL,
    "unity_purchase" REAL NOT NULL,
    "total_money_purchase" REAL NOT NULL,
    "value_sale" REAL,
    "date_sale" TEXT,
    "unity_sale" INTEGER,
    "total_money_sale" REAL,
    "profit" REAL
);
