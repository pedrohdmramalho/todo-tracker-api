import { TodoModel } from '../models/todoModel.js'
import { TodoValidator } from '../validators/todo.validator.js';

// O service valida as regras de negócio.
export const TodoService = {
    getTodos(userId, limit = 10, page = 1) {
        const offset = (page - 1) * limit;
        return TodoModel.getAll(userId, limit, offset);
    },

    /*  
        Comentário para getTodoByUserId - function. 
        Ainda não entendi a necessidade de definir limit/page nos parâmetros da função. 
        Entendi, para que seja possível definir e/ou por padrão enviamos esses valores:
        TodoService.getTodoByUserId(userId, Number(limit) || 10, Number(page) || 1);   
    */
    getTodoByUserId(userId, limit = 10, page = 1) {
        const offset = (page - 1) * limit;
        return TodoModel.getTodoByUserId(userId, limit, offset);
    },

    createTodo(userId, data) {
        const { title, description } = data;

        const errors = TodoValidator.validateCreateTodo(data);
        console.log(errors);
        if (errors.length > 0){
            throw { status: 422, message: "Validation failed", errors };
        }
        return TodoModel.create({ title, description, userId });
    },

    async updateTodo(id, userId, updates) {
        console.log("I'm here - Service - UPDATE ");
        const errors = TodoValidator.validateUpdateTodo(updates); 

        if (errors.length > 0){
            throw { status: 422, message: "Validation failed", errors };
        }

        const todo = await TodoModel.update(id, userId, updates)
    
        if (!todo) {
            throw { status: 404, message: "I'm here - SERVICE - Not found or unauthorized "} 
        }

        return todo;
    },

    // Ainda estranho de entender essa metodologia de escrita / semântica. 
    async deleteTodo(id, userId) {
        console.log("ID: ", id, "USER_ID: ", userId);
        const success = await TodoModel.delete(id, userId);
        if (!success) {
            throw { status: 404, message: "Todo not found or unauthorized" };
        }
        return success;
    }

};