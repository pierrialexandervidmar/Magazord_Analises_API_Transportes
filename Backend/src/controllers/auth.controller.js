import { getUser } from '../repositories/auth.respository.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { authValidation } from "../validations/auth.validation.js";

export const login = async (req, res) => {
    try {
        const data = await authValidation.parse(req.body);
        const user = await getUser(data.email);

        if (!user) throw { message: "Usuário não Existe" }

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.TOKEN_KEY, 
            {
                expiresIn: 86400 // expires in 24 hours
            });

            return res.status(200).send({
                token: token
            })

        } else {
            return res.status(401).send({ message: "Usuário e/ou senha incorretos"});
        }
    } catch (error) {
        res.status(400).send(error);
    }   
}
