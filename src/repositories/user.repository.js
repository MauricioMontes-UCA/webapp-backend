import { User } from "../models/user.model.js";

class UserRepository {
    // La entrada data es un objeto que debe tener la estructura del
    // modelo User
    async createUser(data) {
        const user = await User.create(data)
        return user ? user.get({ plain: true }) : null;
    };

    async selectUsers() {
        const users = await User.findAll();
        const plainUsers = users.map(user => user.get({ plain: true }));
        return plainUsers;
    }

    async selectUserByEmail(email) {
        const user = await User.findOne({ where: {email} });
        return user ? user.get({ plain: true }) : null;
    }

    async selectUserById(id) {
        const user = await User.findOne({ where: {id} });
        return user ? user.get({ plain: true }) : null;
    }

    async updateUser(id, newData) {
        const databaseResponse = await User.update(newData, { where: {id} });
        return databaseResponse;
    }

    async deleteUser(id) {
        const databaseResponse = await User.destroy({ where: {id} });
        return databaseResponse;
    }
}

export const userRepository = new UserRepository()