// Criamos um todo com os seguintes elementos: 
/*
    - id (auto-incrementavel)
    - userId (automático, vem do middleware)
    - title - (inserido pelo usuário)
    - description - (inserido pelo usuário)
    - createdAt ; updatedAt (automático)
*/

export const TodoValidator = {

    // Não podemos permitir a inserção de mais argumentos do que é permitido
    /*
        Algo como allowedParams = {} - que identifica só objetos válidos e os insere no banco. 
        return TodoModel.create({ title, description, userId }); - Aqui explicitamente ele faz isso. 
    */
    validateCreateTodo(createParams) {

        const errors = [];

        // TITTLE
        if (typeof createParams.title !== "string") {
            errors.push({ field: "title", message: "Title must be a string" });
        } else if (createParams.title.trim().length === 0) {
            errors.push({ field: "title", message: "Title can't be empty" })
        }

        // DESCRIPTION
        if (typeof createParams.description !== "string") {
            errors.push({ field: "description", message: "Description must be a string" });
        } else if (createParams.description.trim().length === 0) {
            errors.push({ field: "description", message: "Description can't be empty" })
        }
        return errors;
    },

    validateUpdateTodo(updatesParams) {

        const errors = [];
        const permittedFields = ["title", "description"];
        const receivedFields = Object.keys(updatesParams);
        const invalidFields = receivedFields.filter(field => !permittedFields.includes(field)); // Isso aqui é sensacional. 25/02 07h06

        if (invalidFields.length > 0) {
            errors.push({ field: invalidFields, message: "Invalid fields for update" });
        }

        if ("title" in updatesParams) {
            // TITTLE
            if (typeof updatesParams.title !== "string") {
                errors.push({ field: "title", message: "Title must be a string" });
            }
        }

        if ("description" in updatesParams) {
            // DESCRIPTION
            if (typeof updatesParams.description !== "string") {
                errors.push({ field: "description", message: "Description must be a string" });
            }
        }

        // 10/03 às 07:23 - Necessário re-leitura do Objects(built-in)
        if (Object.keys(updatesParams).length === 0) {
            errors.push({ message: "Body cannot be empty" });
        }

        // Ordem  ideal para validação de updates: Body Vazio, Campos inválidos, Validação de tipo, Validação semântica. 

        return errors;
    }
}