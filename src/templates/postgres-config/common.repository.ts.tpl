import { CommonRepository } from "../../../shared/infraestructure/database/sql/common.repository";
import { IDatabase } from "../../../shared/infraestructure/database/postgres/postgres";
import { IENTITYCAPITALIZERepository } from "../../domain/ENTITYKEBAB.repository";
import { IENTITYCAPITALIZEBase } from "../../domain/interfaces/ENTITYKEBAB-base.interface";
import { IENTITYCAPITALIZEDTO } from "../../domain/interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZE } from "../../domain/interfaces/ENTITYKEBAB.interface";
import { ENTITYCAPITALIZE } from "../../domain/model/ENTITYKEBAB";

export class ENTITYCAPITALIZERepository
  extends CommonRepository<
    IENTITYCAPITALIZE,
    IENTITYCAPITALIZEBase,
    IENTITYCAPITALIZEDTO
  >
  implements IENTITYCAPITALIZERepository
{
  constructor(readonly dbRead: IDatabase, readonly dbWrite: IDatabase) {
    super({
      dbRead,
      dbWrite,
      tableName: "ENTITY",
      entityName: "ENTITY",
      primaryKey: "ENTITYUuid",
      dto: ENTITYCAPITALIZE,
    });
  }
}
