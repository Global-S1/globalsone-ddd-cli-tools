import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { modifiedCount } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZEBase } from "../../domain/interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";

export class UpdateENTITYCAPITALIZE {
  private readonly ENTITYLOWERRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYLOWERRepository =
      this.context.repositories.ENTITYCAPITALIZERepository;
  }

  async execute(
    ENTITYLOWERId: string,
    data: Partial<IENTITYCAPITALIZEBase>
  ): Promise<IDBDataItemRequired<modifiedCount>> {
    try {
      return await this.ENTITYLOWERRepository.update(ENTITYLOWERId, data);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}