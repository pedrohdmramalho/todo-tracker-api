import { validate } from "uuid";
import { TodoModel } from "../models/todoModel.js";
import { TodoService } from "../services/todoService.js";
import { TodoValidator } from "../validators/todo.validator.js";

// Controller decide GET/POST/PUT/DELETE e chama o service. 
export const TodoController = {

    // Se desenvolve na minha cabeça, mesmo assim ainda é meio estranho de ler o código. 
    getTodos(req, res) {
        try {
            const { page, limit } = req.query; // Paginação
            const userId = req.user.id; // Validar o usuário para lhe retornar só o que lhe pertence. 
            const todos = TodoService.getTodos(userId, Number(limit) || 10, Number(page) || 1);
            res.json(todos);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    getTodoByUserId(req, res) {
        try {
            const { page, limit } = req.query;
            const userId = req.user.id; // Vem do middleware
            const todos = TodoService.getTodoByUserId(userId, Number(limit) || 10, Number(page) || 1);
            res.json(todos);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    async FindAllByUser(req, res) {
        try {
            //const {page, limit} = req.body;
            const userId = req.user.id;

            const todos = await TodoModel.findAllByUser(userId);
            res.json(todos);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message });
        }
    },

    async createTodo(req, res) {
        try {
            const { title, description } = req.body;

            const todo = await TodoModel.create({
                title,
                description,
                userId: req.user.id
            });

            return res.status(201).json(todo);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error " });
        }
    },

    // Precisamos refatorar a impressão de erros nesse trecho de código. 
    /*
    createTodo(req, res) {
        try {
            const userId = req.user.id;
            const todo = TodoService.createTodo(userId, req.body);
            res.status(201).json(todo);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors || undefined });
        }
    },
    */

    // 04/03/2026 às 07h28 - Funciona, mas não há controle de updates. 
    // Necessário injetar o validateUpdateTodo. ✅
    // Necessário validar quando não existe tarefa e/ou não é proprietário. ✅
    // 09/03 às 07h05 - As partes de validação devem estar em Service e não aqui.
    // Necessário refatorar e enviar para Service. ✅
    // 10/03 às 07:20 - Muito melhor para leitura agora. 
    async updateTodo(req, res) {
        try {
            console.log("I'm here Controller - UPDATE");
            const userId = req.user.id;
            const todo = await TodoService.updateTodo(Number(req.params.id),userId,req.body);
            res.json(todo);
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors || undefined });
        }
    },

    // Está claro também, com exceção dos <parâmetros> existentes em req/res
    /*
    updateTodo(req, res) {
        try {
            const userId = req.user.id;
            const todo = TodoService.updateTodo(Number(req.params.id), userId, req.body);
            res.json(todo);                                                                                             
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors || undefined });
        }   
    },
    */

    async deleteTodo(req, res) {
        console.log("I'm here - Controller");
        try {
            const userId = req.user.id;
            const todoId = Number(req.params.id);
            await TodoService.deleteTodo(todoId, userId);
            res.sendStatus(204);
        } catch (error) {
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}