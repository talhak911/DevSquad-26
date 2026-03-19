"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.rooms = void 0;
exports.rooms = [
    {
        id: "general",
        name: "General",
        description: "Talk about anything and everything",
        icon: "💬",
    },
    {
        id: "tech",
        name: "Tech Talk",
        description: "Discuss the latest in technology",
        icon: "⚡",
    },
    {
        id: "gaming",
        name: "Gaming",
        description: "All things gaming",
        icon: "🎮",
    },
    {
        id: "music",
        name: "Music",
        description: "Share your favorite tunes",
        icon: "🎵",
    },
    {
        id: "random",
        name: "Random",
        description: "Anything goes here",
        icon: "🎲",
    },
];
// roomId -> Message[]
exports.messages = new Map([
    [
        "general",
        [
            {
                id: "m1",
                roomId: "general",
                username: "Alice",
                text: "Hey everyone! Welcome to the chat 👋",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
                id: "m2",
                roomId: "general",
                username: "Bob",
                text: "Thanks! This is awesome 🔥",
                timestamp: new Date(Date.now() - 1800000).toISOString(),
            },
        ],
    ],
    [
        "tech",
        [
            {
                id: "m3",
                roomId: "tech",
                username: "Charlie",
                text: "Anyone tried the new RTK Query? It's amazing!",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
            },
        ],
    ],
    ["gaming", []],
    ["music", []],
    ["random", []],
]);
