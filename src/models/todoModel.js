//const todos = [];

import pool from "../config/database.js"

// Model não faz validação, apenas manipula dados em memória.
export const TodoModel = {

    async create({ title, description, userId }) {

        const result = await pool.query(
            `
            INSERT INTO todos (title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [title, description, userId]

        );
        return result.rows[0];
    },


    async findAllByUser(userId) {
        const result = await pool.query(
            `
            SELECT * FROM todos
            WHERE user_id = $1
            ORDER BY createdat ASC;
            `,
            [userId]
        );
        return result.rows;
    },

    async update(id, userId, updates) {
        console.log("I'm here Model - UPDATE ");
        
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in updates) {
            fields.push(`${key} = $${index}`);
            values.push(updates[key]);
            index++;
        }

        fields.push(`updatedat = NOW()`);

        const query = `
            UPDATE todos
            SET ${fields.join(", ")}
            WHERE id = $${index}
            AND user_id = $${index + 1} 
            RETURNING *
        `

        values.push(id, userId);
        const result = await pool.query(query, values);

        return result.rows[0] || null;
    },

    async delete(id, userId) {
        console.log("I'm here - Model: ");
        const result = await pool.query(
            `
            DELETE 
            FROM todos
            WHERE id = $1 and user_id = $2
            `,
            [id, userId]
        );
        return result.rowCount;
    },
    
    getAll(userId, limit, offset) {
        return todos
            .filter(todo => todo.userId === userId)
            .slice(offset, offset + limit); // paginação.
    },

    // 21/02 - 07h07 - Ainda não entendi direito:
    /*
        .slice(offset, offset + limit); // Paginação. 
    */
    getTodoByUserId(userId, limit, offset) {
        return todos
            .filter(todo => todo.userId === userId)
            .slice(offset, offset + limit);
    },

    getById(id) {
        return todos
            .find(todo => todo.id === id);
    },

    // Quero entender como funciona essa interação de passar Objeto.
    // Parâmetros posicionais / Destructuring de Objeto
    /*
    create({ title, description, userId }) {
        const newTodo = {
            id: todos.length + 1,
            userId: userId,
            title,
            description,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        todos.push(newTodo);
        return newTodo;
    },
    */

    /*
    update(id, userId, updates) {
        const todo = todos.find(todo => todo.id === id && todo.userId === userId);
        if (!todo) {
            return null;
        }
        Object.assign(todo, updates, { updatedAt: new Date() });
        return todo;
    },
    */

    /*
    delete(id, userId) {
        const index = todos.findIndex(todo => todo.id === id && todo.userId === userId);
        if (index === -1) return false;
        todos.splice(index, 1);
        return true;
    }
    */
}