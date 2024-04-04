import { create, get, getId, remove, update } from "../controllers/sales.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const saleRoutes = app => {
    app.post("/sale", verifyToken, create);
    app.get("/sales", verifyToken, get);
    app.get("/sale/:id", verifyToken, getId);
    app.put("/sale/:id", verifyToken, update);
    app.delete("/sale/:id", verifyToken, remove);
};
