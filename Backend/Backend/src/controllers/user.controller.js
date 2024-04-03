const { createUser, getById, getUser, removeUser, updateUser } = require("../repositories/user.repository");
const bcrypt = require("bcrypt");
const { userValidation } = require("../validations/user.validation");

exports.create = async (req, res) => {
    try {
        const data = await userValidation.parse(req.body);
        data.password = bcrypt.hashSync(req.body.password, 10);
        const user = await createUser(data);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

exports.get = async (req, res) => {
    try {
        const users = await getUser();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

exports.getId = async (req, res) => {
    try {
        const user = await getById(Number(req.params.id));
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const user = await updateUser(Number(req.params.id), req.body);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

exports.remove = async (req, res) => {
    try {
        const user = await removeUser(Number(req.params.id));
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}