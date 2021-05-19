"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const service_errors_js_1 = __importDefault(require("../common/service-errors.js"));
// register user
const createUser = (usersData) => (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.password !== user.reenteredPassword) {
        return {
            error: service_errors_js_1.default.BAD_REQUEST,
            result: null,
        };
    }
    const existingUser = yield usersData.getBy(user.email);
    if (existingUser) {
        return {
            error: service_errors_js_1.default.DUPLICATE_RECORD,
            result: null,
        };
    }
    const password = yield bcrypt_1.default.hash(user.password, 10);
    return {
        error: null,
        result: yield usersData.create(Object.assign(Object.assign({}, user), { password })),
    };
});
// delete user
const deleteUser = (usersData) => (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield usersData.getBy('user_id', userId);
    if (!existingUser) {
        return {
            error: service_errors_js_1.default.RECORD_NOT_FOUND,
            result: null,
        };
    }
    const _ = yield usersData.remove(userId);
    return {
        error: null,
        result: existingUser,
    };
});
exports.default = {
    createUser,
    deleteUser,
};
