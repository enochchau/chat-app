"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const config = {
    PORT: process.env.PORT || 500,
};
exports.default = config;
