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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanController = void 0;
class FanController {
    constructor(fanControlService) {
        this.fanControlService = fanControlService;
    }
    checkAndActivateFans(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fanControlService.checkAndActivateFans();
                const uvStatus = this.fanControlService.isUVLightOn();
                res.status(200).send({
                    message: 'Revisión de temperaturas completada.',
                    uvLightActive: uvStatus
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).send({
                    error: 'Error al revisar temperaturas y controlar los ventiladores.',
                    details: error instanceof Error ? error.message : 'Error desconocido'
                });
            }
        });
    }
}
exports.FanController = FanController;
//# sourceMappingURL=FanController.js.map