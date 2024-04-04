import { create, get, getId, remove, update } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

export const userRoutes = app => {
    app.post("/user", create);
    app.get("/users", verifyToken, get);
    app.get("/user/:id", verifyToken, getId);
    app.put("/user/:id", verifyToken, update);
    app.delete("/user/:id", verifyToken, remove);
};
