import { CreateENTITYCAPITALIZE } from "../../../../../../src/entities/ENTITYKEBAB/application/use-cases/create-ENTITYKEBAB";
import { IENTITYCAPITALIZE } from "../../../../../../src/entities/ENTITYKEBAB/domain/ENTITYKEBAB.repository";
import { createMockContext } from "../../../../../helpers/mock-context";
import { createCreateENTITYCAPITALIZEDTOFixture } from "../../../../../helpers/ENTITYKEBAB-fixtures";

describe("CreateENTITYCAPITALIZE Use Case", () => {
  let useCase: CreateENTITYCAPITALIZE;
  let mockRepository: jest.Mocked<IENTITYCAPITALIZERepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    const context = createMockContext({
      repositories: {
        ENTITYRepository: mockRepository,
      } as any,
    });

    useCase = new CreateENTITYCAPITALIZE(context);
  });

  it("should create a ENTITY successfully", async () => {
    const createDTO = createCreateENTITYCAPITALIZEDTOFixture();
    const expectedResult = {
      item: { insertedId: "test-id-123" },
    };

    mockRepository.create.mockResolvedValue(expectedResult as any);

    const result = await useCase.execute(createDTO);

    expect(result.item?.insertedId).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(createDTO)
    );
  });

  it("should handle repository errors", async () => {
    const createDTO = createCreateENTITYCAPITALIZEDTOFixture();

    mockRepository.create.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(createDTO)).rejects.toThrow("Database error");
  });

  it("should validate ENTITY data before creation", async () => {
    const createDTO = createCreateENTITYCAPITALIZEDTOFixture();

    const expectedResult = {
      item: { insertedId: "some-id" },
    };

    mockRepository.create.mockResolvedValue(expectedResult as any);

    await useCase.execute(createDTO);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });
});
