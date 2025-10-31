const db = require('../config/db_sequelize');

module.exports = {
    async getChests(req, res) {
        try {
            const chests = await db.Chest.findAll();
            res.render('chests/chests', { Chest: chests.map(c => c.toJSON()) });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error fetching chests");
        }
    },

    
    async postChests(req, res) {
        try{
            let body = req.body;
            body = JSON.parse(Object.keys(body)[0]);

            const { id, name, amount } = body;

            if (!id || !name || !amount) {
                return res.status(400).send("Missing fields");
            }

            const updatedChest = await db.Chest.upsert({ id, name, amount });
            res.status(201).json({ message: "Chest updated!", chest: updatedChest});
        } catch (err) {
        console.error(err);
        res.status(500).send("Error updating chest");
        }   
    }
}