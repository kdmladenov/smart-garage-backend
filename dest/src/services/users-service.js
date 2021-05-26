var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import errors from '../common/service-errors.js';
import rolesEnum from '../common/roles.enum.js';
import { DB_CONFIG, PRIVATE_KEY } from "../../config.js";
import { forgotPassword } from '../common/constants.js';
import mailingService from './mailing-service.js';
import randomStringGenerator from '../common/randomStringGenerator.js';
// register user
var createUser = function (usersData) { return function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, _a, city, country, postalCode, streetAddress, addressId, randomPassword, password, createdUser, subject, text;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, usersData.getByEmailPhone("email", user.email)];
            case 1:
                _a = (_b.sent());
                if (_a) return [3 /*break*/, 3];
                return [4 /*yield*/, usersData.getByEmailPhone("phone", user.phone)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                existingUser = _a;
                if (existingUser) {
                    return [2 /*return*/, {
                            error: errors.DUPLICATE_RECORD,
                            result: null,
                        }];
                }
                city = user.city, country = user.country, postalCode = user.postalCode, streetAddress = user.streetAddress;
                return [4 /*yield*/, usersData.createAddress({
                        city: city,
                        country: country,
                        postalCode: postalCode,
                        streetAddress: streetAddress,
                    })];
            case 4:
                addressId = _b.sent();
                randomPassword = randomStringGenerator(10);
                return [4 /*yield*/, bcrypt.hash(randomPassword, 10)];
            case 5:
                password = _b.sent();
                return [4 /*yield*/, usersData.create(__assign(__assign({}, user), { password: password, addressId: addressId }))];
            case 6:
                createdUser = _b.sent();
                subject = 'Login credentials';
                text = "\n    Dear " + createdUser.firstName + ",\n    Your account at \"Smart Garage\" has been created. These are your login credentials:\n      username: " + createdUser.email + "\n      password: " + randomPassword + "\n  ";
                mailingService(existingUser.email, subject, text);
                return [2 /*return*/, {
                        error: null,
                        result: createdUser,
                    }];
        }
    });
}); }; };
// delete user
var deleteUser = function (usersData) { return function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, _;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersData.getBy('user_id', userId)];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                return [4 /*yield*/, usersData.remove(userId)];
            case 2:
                _ = _a.sent();
                return [2 /*return*/, {
                        error: null,
                        result: existingUser,
                    }];
        }
    });
}); }; };
var getUser = function (usersData) { return function (userId, role) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersData.getBy("user_id", userId, role)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                return [2 /*return*/, {
                        error: null,
                        result: user,
                    }];
        }
    });
}); }; };
// update profile
var update = function (usersData) { return function (userUpdate, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var email, reenteredEmail, existingUser, user, updatedUser, _;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = userUpdate.email, reenteredEmail = userUpdate.reenteredEmail;
                if (email && email !== reenteredEmail) {
                    return [2 /*return*/, {
                            error: errors.BAD_REQUEST,
                            result: null,
                        }];
                }
                return [4 /*yield*/, usersData.getBy("user_id", userId, "employee")];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, usersData.getBy("email", email, "employee")];
            case 2:
                user = _a.sent();
                if (user && user.userId !== userId) {
                    return [2 /*return*/, {
                            error: errors.DUPLICATE_RECORD,
                            result: null,
                        }];
                }
                _a.label = 3;
            case 3:
                updatedUser = __assign(__assign(__assign({}, existingUser), userUpdate), { userId: userId });
                return [4 /*yield*/, usersData.updateData(updatedUser)];
            case 4:
                _ = _a.sent();
                return [2 /*return*/, {
                        error: null,
                        result: updatedUser,
                    }];
        }
    });
}); }; };
var getAllUsers = function (usersData) { return function (name, email, phone, model, make, visitRangeLow, visitRangeHigh, sort, order) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersData.getAll(name, email, phone, model, make, visitRangeLow, visitRangeHigh, sort, order)];
            case 1:
                result = _a.sent();
                console.log(result[0], "tt");
                return [2 /*return*/, result];
        }
    });
}); }; };
// change password
var changePassword = function (usersData) { return function (passwordData, userId, role) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, savedPassword, password, reenteredPassword, currentPassword, _a, updated, _;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, usersData.getBy('user_id', userId)];
            case 1:
                existingUser = _b.sent();
                if (!existingUser) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                return [4 /*yield*/, usersData.getPasswordBy('user_id', userId)];
            case 2:
                savedPassword = (_b.sent()).password;
                password = passwordData.password, reenteredPassword = passwordData.reenteredPassword, currentPassword = passwordData.currentPassword;
                _a = password !== reenteredPassword;
                if (_a) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(currentPassword, savedPassword)];
            case 3:
                _a = (!(_b.sent()) && role !== rolesEnum.employee);
                _b.label = 4;
            case 4:
                if (_a) {
                    return [2 /*return*/, {
                            error: errors.BAD_REQUEST,
                            result: null,
                        }];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 5:
                updated = _b.sent();
                return [4 /*yield*/, usersData.updatePassword(userId, updated)];
            case 6:
                _ = _b.sent();
                return [2 /*return*/, {
                        error: null,
                        result: { message: 'The password was successfully changed' },
                    }];
        }
    });
}); }; };
// change password
var forgottenPassword = function (usersData) { return function (email) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, savedPassword, newPrivateKey, payload, token, link, subject, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersData.getBy("email", email)];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                return [4 /*yield*/, usersData.getPasswordBy("user_id", existingUser.userId)];
            case 2:
                savedPassword = (_a.sent()).password;
                newPrivateKey = PRIVATE_KEY + savedPassword;
                payload = {
                    email: existingUser.email,
                    id: existingUser.userId,
                };
                token = jwt.sign(payload, newPrivateKey, {
                    expiresIn: forgotPassword.tokenExpiration,
                });
                link = "http://" + DB_CONFIG.host + ":" + forgotPassword.frontEndPort + "/reset-password/" + existingUser.userId + "/" + token;
                subject = "Password reset link.";
                text = "Dear " + existingUser.firstName + ",\nA request has been received to reset the password of your Smart Garage account. You can do that by clicking on the below link.\n\n  " + link + "\nIf you did not initiate the request, just ignore this email - your password will not be changed.";
                mailingService(existingUser.email, subject, text);
                //   const transporter = nodemailer.createTransport({
                //     service: forgotPassword.emailService,
                //     auth: {
                //       user: forgotPassword.emailUser,
                //       pass: forgotPassword.emailPassword,
                //     },
                //   });
                //   const options = {
                //     from: forgotPassword.emailUser,
                //     to: `${existingUser.email}`,
                //     subject: "Password reset link.",
                //     text: `Dear ${existingUser.firstName},\nA request has been received to reset the password of your Smart Garage account. You can do that by clicking on the below link.\n
                // ${link}\nIf you did not initiate the request, just ignore this email - your password will not be changed.`,
                //   };
                //   transporter.sendMail(options, (err, info) => {
                //     if (err) {
                //       return;
                //     }
                //     console.log(`Sent: + ${info.response}`);
                //   });
                return [2 /*return*/, {
                        error: null,
                        result: { message: "The password reset link has been send to " + email },
                    }];
        }
    });
}); }; };
// change password
var resetPassword = function (usersData) { return function (password, reenteredPassword, userId, token) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, savedPassword, newPrivateKey, payload, updated, _, subject, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, usersData.getBy("user_id", userId)];
            case 1:
                existingUser = _a.sent();
                if (!existingUser) {
                    return [2 /*return*/, {
                            error: errors.RECORD_NOT_FOUND,
                            result: null,
                        }];
                }
                return [4 /*yield*/, usersData.getPasswordBy("user_id", userId)];
            case 2:
                savedPassword = (_a.sent()).password;
                newPrivateKey = PRIVATE_KEY + savedPassword;
                payload = jwt.verify(token, newPrivateKey);
                if (password !== reenteredPassword || !payload) {
                    return [2 /*return*/, {
                            error: errors.BAD_REQUEST,
                            result: null,
                        }];
                }
                return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 3:
                updated = _a.sent();
                return [4 /*yield*/, usersData.updatePassword(userId, updated)];
            case 4:
                _ = _a.sent();
                subject = "Your password has been reset.";
                text = "Dear " + existingUser.firstName + ",\nYour password has been reset.\nThank you!";
                mailingService(existingUser.email, subject, text);
                // const transporter = nodemailer.createTransport({
                //   service: forgotPassword.emailService,
                //   auth: {
                //     user: forgotPassword.emailUser,
                //     pass: forgotPassword.emailPassword,
                //   },
                // });
                // const options = {
                //   from: forgotPassword.emailUser,
                //   to: `${existingUser.email}`,
                //   subject: "Your password has been reset.",
                //   text: `Dear ${existingUser.firstName},\nYour password has been reset.\nThank you!`,
                // };
                // transporter.sendMail(options, (err, info) => {
                //   if (err) {
                //     return;
                //   }
                //   console.log(`Sent: + ${info.response}`);
                // });
                return [2 /*return*/, {
                        error: null,
                        result: { message: "The password was successfully reset" },
                    }];
        }
    });
}); }; };
export default {
    createUser: createUser,
    deleteUser: deleteUser,
    getUser: getUser,
    update: update,
    getAllUsers: getAllUsers,
    changePassword: changePassword,
    forgottenPassword: forgottenPassword,
    resetPassword: resetPassword,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnMtc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2Vycy1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sR0FBRyxNQUFNLGNBQWMsQ0FBQztBQUMvQixPQUFPLE1BQU0sTUFBTSw2QkFBNkIsQ0FBQztBQUdqRCxPQUFPLFNBQVMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLGNBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLHFCQUFxQixNQUFNLG9DQUFvQyxDQUFDO0FBRXZFLGdCQUFnQjtBQUNoQixJQUFNLFVBQVUsR0FBRyxVQUFDLFNBQW9CLElBQUssT0FBQSxVQUFPLElBQWtCOzs7O29CQUM5QyxxQkFBTSxTQUFTLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUE7O2dCQUFyRCxLQUFBLENBQUMsU0FBb0QsQ0FBQyxDQUFBO3dCQUF0RCx3QkFBc0Q7Z0JBQ3JELHFCQUFNLFNBQVMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQTs7Z0JBQXJELEtBQUEsQ0FBQyxTQUFvRCxDQUFDLENBQUE7OztnQkFEckUsWUFBWSxLQUN5RDtnQkFFM0UsSUFBSSxZQUFZLEVBQUU7b0JBQ2hCLHNCQUFPOzRCQUNMLEtBQUssRUFBRSxNQUFNLENBQUMsZ0JBQWdCOzRCQUM5QixNQUFNLEVBQUUsSUFBSTt5QkFDYixFQUFDO2lCQUNIO2dCQUdDLElBQUksR0FDRixJ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