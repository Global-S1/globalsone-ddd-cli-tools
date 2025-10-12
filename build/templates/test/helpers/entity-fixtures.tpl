import { IENTITYCAPITALIZE } from "../../src/entities/ENTITYKEBAB/domain/interfaces/ENTITYKEBAB.interface";
import { IENTITYCAPITALIZEDTO } from "../../src/entities/ENTITYKEBAB/domain/interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZEBase } from "../../src/entities/ENTITYKEBAB/domain/interfaces/ENTITYKEBAB-base.interface";

export const createENTITYCAPITALIZEFixture = (
  overrides?: Partial<IENTITYCAPITALIZE>
): IENTITYCAPITALIZE => ({
  ENTITYId: "test-ENTITY-id-123",
  ...overrides,
});

export const createENTITYCAPITALIZEDTOFixture = (
  overrides?: Partial<IENTITYCAPITALIZEDTO>
): IENTITYCAPITALIZEDTO => ({
  ENTITYId: "test-ENTITY-id-123",
  insDatetime: "2024-01-01T00:00:00.000Z",
  updDatetime: "2024-01-01T00:00:00.000Z",
  delDatetime: "",
  ...overrides,
});

export const createCreateENTITYCAPITALIZEDTOFixture = (
  overrides?: Partial<IENTITYCAPITALIZEBase>
): IENTITYCAPITALIZEBase => ({
  ...overrides,
});
