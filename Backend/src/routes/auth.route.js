import { login } from '../controllers/auth.controller.js';

export const authRoutes = app => {
    app.post("/login", login);
}
