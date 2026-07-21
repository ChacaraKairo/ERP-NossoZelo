import { Controller, Get } from "@nestjs/common";
import { RequirePermission } from "../common/decorators/require-permission.decorator";
import { AlertasService } from "../services/alertas.service";

@Controller("alertas")
export class AlertasController {
  constructor(private readonly alertas: AlertasService) {}

  @Get()
  @RequirePermission("dashboard:read")
  list() {
    return this.alertas.list();
  }
}
