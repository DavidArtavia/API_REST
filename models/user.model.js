import {pool} from '../database/connection.database.js'

const create = async ({ email, password, username }) => {
    const query = {
        text: `
            INSERT INTO users (email, password, username)
            VALUES ($1, $2, $3)
            RETURNING email, username, uid, created_at
        `,
        values: [email, password, username]
    }
    
    const { rows } = await pool.query(query)
    return rows[0]
}

const findOneByEmail = async (email) => {
    const query = {
        text: `
            SELECT * FROM users
            WHERE email = $1
        `,
        values: [email]
    }

    const { rows } = await pool.query(query)
    return rows[0]
}

const update = async (uid, { email, password, username }) => {
    const query = {
        text: `
            UPDATE users
            SET email = $1, password = $2, username = $3
            WHERE uid = $4
            RETURNING email, username, uid
        `,
        values: [email, password, username, uid]
    }

    const { rows } = await pool.query(query)
    return rows[0]
}

const remove = async (uid) => {
    const query = {
        text: `
            DELETE FROM users
            WHERE uid = $1
            RETURNING email, username, uid
        `,
        values: [uid]
    }

    const { rows } = await pool.query(query)
    return rows[0]
}

export const UserModel = {
    create,
    findOneByEmail,
    // getById,
    update,
    remove
}