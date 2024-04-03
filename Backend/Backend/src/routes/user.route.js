const { create, get, getId, remove, update } = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

exports.userRoutes = app => {
    app.post("/user", create);
    app.get("/users", verifyToken, get);
    app.get("/user/:id", verifyToken, getId);
    app.put("/user/:id", verifyToken, update);
    app.delete("/user/:id", verifyToken, remove);
};