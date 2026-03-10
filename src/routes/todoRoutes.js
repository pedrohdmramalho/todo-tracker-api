import { Router } from "express";
import { TodoController } from "../controllers/todoController.js";

// carece Login/Register

export const todoRoutes = Router();

//todoRoutes.get("/todos", TodoController.getTodos);
//todoRoutes.post("/todos", TodoController.createTodo); 
//todoRoutes.patch("/todos/:id", TodoController.updateTodo);

// Routing with database 
todoRoutes.get("/todos", TodoController.FindAllByUser);
todoRoutes.post("/todos", TodoController.createTodo); 
todoRoutes.patch("/todos/:id", TodoController.updateTodo);
todoRoutes.delete("/todos/:id", TodoController.deleteTodo); 
   