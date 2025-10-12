import { IENTITYCAPITALIZE } from "../../src/entities/ENTITYKEBAB/domain/interfaces/ENTITYKEBAB.interface";
import { IENTITYCAPITALIZEDTO } from "../../src/entities/ENTITYKEBAB/domain/interfaces/dto/ENTITYKEBAB-dto.interface";
import { IENTITYCAPITALIZEBase } from "../../src/entities/ENTITYKEBAB/domain/interfaces/ENTITYKEBAB-base.interface";

export const createENTITYCAPITALIZEFixture = (
  overrides?: Partial<IENTITYCAPITALIZE>
): IENTITYCAPITALIZE => ({
  ENTITYId: "test-ENTITY-id-123",
  name: "Test ENTITY",
  ...overrides,
});

export const createENTITYCAPITALIZEDTOFixture = (
  overrides?: Partial<IENTITYCAPITALIZEDTO>
): IENTITYCAPITALIZEDTO => ({
  ENTITYId: "test-ENTITY-id-123",
  name: "Test ENTITY",
  insDatetime: new Date().toISOString(),
  updDatetime: new Date().toISOString(),
  delDatetime: "",
  ...overrides,
});

export const createCreateENTITYCAPITALIZEDTOFixture = (
  overrides?: Partial<IENTITYCAPITALIZEBase>
): IENTITYCAPITALIZEBase => ({
  name: "Test ENTITY",
  ...overrides,
});
