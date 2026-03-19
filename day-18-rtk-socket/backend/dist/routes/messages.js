"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_1 = require("../store");
const router = (0, express_1.Router)();
router.get("/:roomId", (req, res) => {
    const { roomId } = req.params;
    const roomMessages = store_1.messages.get(roomId) ?? [];
    res.json(roomMessages);
});
exports.default = router;
