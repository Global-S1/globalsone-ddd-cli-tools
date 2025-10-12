import { ENTITYCAPITALIZE } from "../../../../../../src/entities/ENTITYKEBAB/domain/model/ENTITYKEBAB";
import {
  createENTITYCAPITALIZEFixture,
  createCreateENTITYCAPITALIZEDTOFixture,
  createENTITYCAPITALIZEDTOFixture,
} from "../../../../../helpers/ENTITYKEBAB-fixtures";

describe("ENTITYCAPITALIZE Domain Model", () => {
  describe("create", () => {
    it("should create a new ENTITY instance", () => {
      const createDTO = createCreateENTITYCAPITALIZEDTOFixture();
      const ENTITY = ENTITYCAPITALIZE.create(createDTO);

      expect(ENTITY).toBeInstanceOf(ENTITYCAPITALIZE);
      expect(ENTITY.ENTITYId).toBeUndefined();
      expect(ENTITY.name).toBe(createDTO.name);
    });

    it("should create a ENTITY with custom values", () => {
      const customData = createCreateENTITYCAPITALIZEDTOFixture({
        name: "Custom Name",
      });

      const ENTITY = ENTITYCAPITALIZE.create(customData);

      expect(ENTITY).toBeDefined();
      expect(ENTITY.name).toBe("Custom Name");
    });
  });

  describe("fromPrimitives", () => {
    it("should create a ENTITY from primitives with ID", () => {
      const primitiveData = createENTITYCAPITALIZEFixture();
      const ENTITY = ENTITYCAPITALIZE.fromPrimitives(primitiveData);

      expect(ENTITY.ENTITYId).toBeDefined();
      expect(ENTITY.ENTITYId?.value).toBe(primitiveData.ENTITYId);
      expect(ENTITY.name).toBe(primitiveData.name);
    });
  });

  describe("toPrimitives", () => {
    it("should convert ENTITY to primitives", () => {
      const primitiveData = createENTITYCAPITALIZEFixture();
      const ENTITY = ENTITYCAPITALIZE.fromPrimitives(primitiveData);
      const result = ENTITY.toPrimitives();

      expect(result.ENTITYId).toBe(primitiveData.ENTITYId);
      expect(result.name).toBe(primitiveData.name);
    });
  });

  describe("toDatabase", () => {
    it("should convert ENTITY to database format", () => {
      const createDTO = createCreateENTITYCAPITALIZEDTOFixture();
      const ENTITY = ENTITYCAPITALIZE.create(createDTO);
      const result = ENTITY.toDatabase();

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty("ENTITYId");
      expect(result.name).toBe(createDTO.name);
    });
  });

  describe("toDTO", () => {
    it("should convert ENTITY to DTO with datetime fields", () => {
      const primitiveData = createENTITYCAPITALIZEFixture();
      const dtoData = createENTITYCAPITALIZEDTOFixture();
      const ENTITY = ENTITYCAPITALIZE.fromPrimitives(primitiveData);
      const result = ENTITY.toDTO(dtoData);

      expect(result.ENTITYId).toBe(primitiveData.ENTITYId);
      expect(result.name).toBe(primitiveData.name);
      expect(result.insDatetime).toBeDefined();
      expect(result.updDatetime).toBeDefined();
    });
  });
});
