"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    user: ['getMovies', 'getProfile', 'manageSubscription'],
    admin: ['getUsers', 'manageUsers', 'getMovies', 'manageMovies', 'managePlans', 'getProfile', 'manageSubscription'],
};
exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
