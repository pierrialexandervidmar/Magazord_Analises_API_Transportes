import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            message: "É obrigatório informar um token válido"
        });
    }

    try {
        const replace = token.replace("Bearer ", "");
        const decoded = jwt.verify(replace, process.env.TOKEN_KEY);
        next();
    } catch (error) {
        return res.status(401).send({ message: "Credenciais Inválidas" });
    }
};
