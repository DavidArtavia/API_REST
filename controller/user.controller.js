import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Función de validación
const validateRegisterInputRegister = (email, password, username) => {
    const errors = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (!username) errors.push('Username is required');
    return errors;
};
const validateRegisterInputLogin = (email, password) => {
    const errors = [];
    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    return errors;
};

// Controlador para registrar un usuario en la base de datos 
// ruta: POST /api/v1/users/register
const register = async (req, res) => {
    try {

        // extrae los campos del body
        const { email, password, username } = req.body

        // verifica que los campos no esten vacios
        const validationErrors = validateRegisterInputRegister(email, password, username);
        if (validationErrors.length > 0) {
            return res.status(400).json({ ok: false, message: validationErrors.join(', ') });
        }

        // verifica que el email no exista
        const user = await UserModel.findOneByEmail(email)
        if (user) {
            return res.status(400).json({ ok: false, message: 'Email already exists' })

        }

        // encripta la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // crea el usuario
        const newUser = await UserModel.create({ email, password: hashedPassword, username })


        // crea el token -> esto puede crearse por aparte y solo invocarlo aqui
        const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // responde al cliente
        return res.status(201).json({ ok: true, message: token })

    } catch (error) {
        console.log('Error', error);

        return res.status(500).json({ ok: false, error: error.message })
    }
}

// Controlador para loguear un usuario en la base de datos
// ruta: POST /api/v1/users/login
const login = async (req, res) => {
    try {

        // extrae los campos del body
        const { email, password } = req.body

        // verifica que los campos no esten vacios
        const validationErrors = validateRegisterInputLogin(email, password);
        if (validationErrors.length > 0) {
            return res.status(400).json({ ok: false, message: validationErrors.join(', ') });
        }

        // verifica que el email exista
        const user = await UserModel.findOneByEmail(email);        
        if (!user) {
            return res.status(400).json({ ok: false, message: 'Email does not exist' })
        }

        // verifica que la contraseña sea correcta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok: false, message: 'Invalid credentials' })
        }

        // crea el token
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // responde al cliente
        return res.status(200).json({ ok: true, message: token })

    } catch (error) {
        console.log('Error', error);

        return res.status(500).json({ ok: false, error: error.message })
    }
}

export const userController = {
    register,
    login
}

