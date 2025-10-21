import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import {
  IDBDataItemsRequired,
  IDBDataItemRequired,
} from "../../../shared/domain/interfaces/db-response.interface";
import { IPaginationQuery } from "../../../shared/domain/interfaces/pagination-query.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYCAPITALIZEDTO } from "../../domain/interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZE } from "../../domain/interfaces/ENTITYKEBAB.interface";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";

export class FindENTITYCAPITALIZE {
  private readonly ENTITYLOWERRepository: IENTITYCAPITALIZERepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYLOWERRepository =
      this.context.repositories.ENTITYCAPITALIZERepository;
  }

  async findByFilters(
    filters?: Partial<IENTITYCAPITALIZE>,
    pagination?: IPaginationQuery
  ): Promise<IDBDataItemsRequired<IENTITYCAPITALIZEDTO>> {
    try {
      return await this.ENTITYLOWERRepository.find({ criteria: filters, pagination });
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findById(
    ENTITYLOWERId: string
  ): Promise<IDBDataItemRequired<IENTITYCAPITALIZEDTO>> {
    try {
      return await this.ENTITYLOWERRepository.findByUuid(ENTITYLOWERId);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}