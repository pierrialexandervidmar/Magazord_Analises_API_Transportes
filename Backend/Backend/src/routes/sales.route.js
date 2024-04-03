const { create, get, getId, remove, update } = require("../controllers/sales.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

exports.saleRoutes = app => {
    app.post("/sale", verifyToken, create);
    app.get("/sales", verifyToken, get);
    app.get("/sale/:id", verifyToken, getId);
    app.put("/sale/:id", verifyToken, update);
    app.delete("/sale/:id", verifyToken, remove);
};