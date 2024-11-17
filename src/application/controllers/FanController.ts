import { FanControlService } from '../../domain/services/FanControlService';
import { Request, Response } from 'express';

export class FanController {
    private fanControlService: FanControlService;

    constructor(fanControlService: FanControlService) {
        this.fanControlService = fanControlService;
    }

    public async checkAndActivateFans(req: Request, res: Response): Promise<void> {
        try {
            await this.fanControlService.checkAndActivateFans();
            const uvStatus = this.fanControlService.isUVLightOn();
            
            res.status(200).send({
                message: 'Revisión de temperaturas completada.',
                uvLightActive: uvStatus
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                error: 'Error al revisar temperaturas y controlar los ventiladores.',
                details: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}