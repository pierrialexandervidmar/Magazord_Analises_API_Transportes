import { createUser, getById, getUser, removeUser, updateUser } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { userValidation } from "../validations/user.validation.js";

export const create = async (req, res) => {
    try {
        const data = await userValidation.parse(req.body);
        data.password = bcrypt.hashSync(req.body.password, 10);
        const user = await createUser(data);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const get = async (req, res) => {
    try {
        const users = await getUser();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const getId = async (req, res) => {
    try {
        const user = await getById(Number(req.params.id));
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const update = async (req, res) => {
    try {
        const user = await updateUser(Number(req.params.id), req.body);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

export const remove = async (req, res) => {
    try {
        const user = await removeUser(Number(req.params.id));
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}
