import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { insertedId } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";
import { ENTITYCAPITALIZE } from "../../domain/model/ENTITYKEBAB";
import { IENTITYCAPITALIZE } from "../../domain/interfaces/ENTITYKEBAB.interface";

export class CreateENTITYCAPITALIZE {
  private readonly ENTITYLOWERRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYLOWERRepository =
      this.context.repositories.ENTITYCAPITALIZERepository;
  }

  async execute(
    data: IENTITYCAPITALIZE
  ): Promise<IDBDataItemRequired<insertedId>> {
    try {
      const ENTITYLOWER = ENTITYCAPITALIZE.create(data);

      return await this.ENTITYLOWERRepository.create(ENTITYLOWER.toPrimitives());
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
