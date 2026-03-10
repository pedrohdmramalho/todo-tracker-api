import express from "express";
import { todoRoutes } from "./src/routes/todoRoutes.js";
import pool from "./src/config/database.js";

const app = express();
app.use(express.json());

// Middleware fake para autenticação.
app.use((req, res, next) => {
    req.user = { id: 1 } // simulação de usuário
    next(); 
});

app.use(todoRoutes);

// Isso foi incrível - pretende entender o diagrama disso - 27/02 às 10:09PM
app.listen(3000, async () => {
    console.log("API running in 3000 port")

    try {
        const res = await pool.query("SELECT NOW()");
        console.log("Banco conectado!");
        console.log(res.rows);
        
    } catch (error) {
        console.error("Conexão falhou", error);
    }
});

