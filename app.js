const express = require('express');
const morgan = require('morgan');
const { Shoutout } = require("./db/models/Shoutout.js");
const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Эндпоинт GET /main - должен возвращать приветственное сообщение
app.get("/main", (req, res) => {
    res.send("Добро пожаловать на главную страницу!");
});

// Эндпоинт GET /search - возвращает результаты поиска с помощью query
app.get("/search", async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).send("Необходим параметр поиска");
        }
        
        // Простой поиск
        const allShoutouts = await Shoutout.findAll();
        const results = allShoutouts.filter(shoutout => 
            shoutout.cheerName.toLowerCase().includes(q.toLowerCase())
        );
        
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send("Ошибка сервера");
    }
});

// Эндпоинт GET /shoutouts - возвращает все кричалки
app.get("/shoutouts", async (req, res) => {
    try {
        const shoutouts = await Shoutout.findAll();
        res.json(shoutouts);
    } catch (error) {
        console.error('Get all error:', error);
        res.status(500).send("Ошибка сервера");
    }
});

// Эндпоинт GET /shoutouts/:id - возвращает кричалку по id
app.get("/shoutouts/:id", async (req, res) => {
    try {
        const shoutout = await Shoutout.findByPk(req.params.id);
        if (!shoutout) {
            return res.status(404).send("Кричалка не найдена");
        }
        res.json(shoutout);
    } catch (error) {
        console.error('Get by id error:', error);
        res.status(500).send("Ошибка сервера");
    }
});

// Эндпоинт POST /shoutouts - создаёт новую кричалку
app.post("/shoutouts", async (req, res) => {
    try {
        const { cheerName, signText } = req.body;
        
        if (!cheerName || !signText) {
            return res.status(400).send("Необходимы cheerName и signText");
        }
        
        const newShoutout = await Shoutout.create({
            cheerName,
            signText
        });
        
        res.status(201).json(newShoutout);
    } catch (error) {
        console.error('Create error:', error);
        res.status(500).send("Ошибка создания кричалки");
    }
});

// Эндпоинт PUT /shoutouts/:id - обновляет существующую кричалку
app.put("/shoutouts/:id", async (req, res) => {
    try {
        const { cheerName, signText } = req.body;
        const shoutout = await Shoutout.findByPk(req.params.id);
        
        if (!shoutout) {
            return res.status(404).send("Кричалка не найдена");
        }
        
        await shoutout.update({
            cheerName: cheerName || shoutout.cheerName,
            signText: signText || shoutout.signText
        });
        
        res.json(shoutout);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).send("Ошибка обновления");
    }
});

// Эндпоинт DELETE /shoutouts/:id - удаляет существующую кричалку
app.delete("/shoutouts/:id", async (req, res) => {
    try {
        const shoutout = await Shoutout.findByPk(req.params.id);
        if (!shoutout) {
            return res.status(404).send("Кричалка не найдена");
        }
        await shoutout.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).send("Ошибка удаления");
    }
});

// Обработка 404 ошибки
app.use((req, res) => {
    res.status(404).send("Страница не найдена! 404");
});

module.exports = app;