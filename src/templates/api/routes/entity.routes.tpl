import { Router } from "express";
import { RouterBase } from "../routes-config/routes-base";
import { ENTITYCAPITALIZEController } from "../../entities/ENTITYLOWER/infrastructure/controllers/ENTITYLOWER.controller";
import { IAppContext } from "../../entities/shared/domain/app-context/app-context.interface";

class ENTITYCAPITALIZERouter extends RouterBase<ENTITYCAPITALIZEController> {
  constructor(readonly context: IAppContext) {
    super(ENTITYCAPITALIZEController, context);
  }

  routes(): void {
    this.router
      .route("/")
      .get(this.controller.listENTITYPLURALCAPITALIZE.bind(this.controller))
      .post(this.controller.createENTITYCAPITALIZE.bind(this.controller));

    this.router
      .route("/:ENTITYLOWERId")
      .get(this.controller.findENTITYCAPITALIZEById.bind(this.controller))
      .patch(this.controller.updateENTITYCAPITALIZE.bind(this.controller))
      .delete(this.controller.deleteENTITYCAPITALIZE.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new ENTITYCAPITALIZERouter(context).router;
