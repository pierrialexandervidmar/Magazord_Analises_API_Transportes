import { userRoutes } from "./user.route.js";
import { authRoutes } from "./auth.route.js";
import { pedidosRoute } from './pedidos.route.js';

export default function setupRoutes(app) {
    userRoutes(app);
    authRoutes(app);
    pedidosRoute(app);
}
