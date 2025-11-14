import { User } from "../models/user.model";

class UserRepository {
    // La entrada data es un objeto que debe tener la estructura del
    // modelo User
    async createUser(data) {
        return await User.create(data)
    };

    async findUserByEmail(email) {
        return await User.findOne({ where: {email} });
    }

    async updateUser(id, newData) {
        return await User.update(newData, { where: {id} });
    }

    async deleteUser(id) {
        return await User.destroy({ where: {id} });
    }
}

export const userRepository = new UserRepository()