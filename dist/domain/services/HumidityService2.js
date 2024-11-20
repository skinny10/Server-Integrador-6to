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
exports.HumidityService2 = void 0;
const SensorDataModel_1 = __importDefault(require("../models/SensorDataModel"));
class HumidityService2 {
    saveHumidityData(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield SensorDataModel_1.default.create({
                type: 'humidity',
                value,
            });
        });
    }
}
exports.HumidityService2 = HumidityService2;
//# sourceMappingURL=HumidityService2.js.map