//Gestionar funciones de usuario

import User from './usuarios.model.js'
import { checkPassword } from '../../utils/encrypt.js'
import { encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

//Obtener todos
export const getAll = async (req, res) => {
    try {
        //Configuraciones de paginación
        const { limit = 20, skip = 0 } = req.query
        //Consultar
        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if (users.length === 0) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Users not found'
                }
            )
        }
        return res.send(
            {
                success: true,
                message: 'Users found:',
                users
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Obtener uno
export const getUserid = async (req, res) => {
    try {
        //obtener el id del Producto a mostrar
        let { id } = req.params
        let user = await User.findById(id)

        if (!user) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User found: ',
                user
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Actualizar datos generales
export const update = async (req, res) => {
    try {
        const { id } = req.params

        const data = req.body

        const update = await User.findByIdAndUpdate(
            id,
            data,
            { new: true }
        )

        if (!update) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                success: true,
                message: 'User updated',
                user: update
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                success: false,
                message: 'General error',
                err
            }
        )
    }
}

//Eliminar User
export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params

        let user = await User.findByIdAndDelete(id)
        if (!user) return res.status(404).send(
            {
                succes: false,
                message: 'User not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'User delete',
            }
        )
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send(
            {
                succes: false,
                message: 'General error', err
            }
        )
    }
}

export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(id)
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }

        const isMatch = await checkPassword(user.password, oldPassword)
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Password is incorrect"
            })
        }

        user.password = await encrypt(newPassword)
        await user.save();

        return res.send({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error) {
        console.error("Error updating password:", error);
        return res.status(500).send({
            success: false,
            message: "General error",
            error
        })
    }
}

export const test = (req, res) => {
    console.log('Test is running')
    res.send({ message: 'Test is running' })
}

//Register
export const register = async (req, res) => {
    try {
        let data = req.body;
        const existingUser = await User.findOne({
            $or: [{ email: data.email }, { username: data.username }]
        });
        if (existingUser) {
            return res.status(400).send({ message: 'Email or Username is already taken' });
        }
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({ message: `Registered successfully, you can log in with username: ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with user registration', err });
    }
};


//Login
export const login = async (req, res) => {
    try {
        let { userLoggin, password } = req.body;

        let user = await User.findOne({
            $or: [{ email: userLoggin }, { username: userLoggin }]
        });

        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const passwordMatch = await checkPassword(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        // Generar el token
        let loggedUser = {
            uid: user._id,
            username: user.username,
            name: user.name,
            role: user.role
        };
        let token = await generateJwt(loggedUser);

        return res.send({
            message: `Welcome ${user.name}`,
            loggedUser,
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'General error with login function', err });
    }
};


