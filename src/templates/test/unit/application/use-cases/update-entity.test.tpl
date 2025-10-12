import { UpdateENTITYCAPITALIZE } from "../../../../../../src/entities/ENTITYKEBAB/application/use-cases/update-ENTITYKEBAB";
import { IENTITYCAPITALIZERepository } from "../../../../../../src/entities/ENTITYKEBAB/domain/ENTITYKEBAB.repository";
import { createMockContext } from "../../../../../helpers/mock-context";
import { createCreateENTITYCAPITALIZEDTOFixture } from "../../../../../helpers/ENTITYKEBAB-fixtures";

describe("UpdateENTITYCAPITALIZE Use Case", () => {
  let useCase: UpdateENTITYCAPITALIZE;
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

    useCase = new UpdateENTITYCAPITALIZE(context);
  });

  it("should update a ENTITY successfully", async () => {
    const ENTITYId = "test-id-123";
    const updateDTO = createCreateENTITYCAPITALIZEDTOFixture();
    const expectedResult = {
      item: { affectedRows: 1 },
    };

    mockRepository.update.mockResolvedValue(expectedResult as any);

    const result = await useCase.execute(ENTITYId, updateDTO);

    expect(result.item?.affectedRows).toBe(1);
    expect(mockRepository.update).toHaveBeenCalledWith(
      ENTITYId,
      expect.objectContaining(updateDTO)
    );
  });

  it("should handle repository errors", async () => {
    const ENTITYId = "test-id-123";
    const updateDTO = createCreateENTITYCAPITALIZEDTOFixture();

    mockRepository.update.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(ENTITYId, updateDTO)).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle non-existent ENTITY", async () => {
    const ENTITYId = "non-existent-id";
    const updateDTO = createCreateENTITYCAPITALIZEDTOFixture();

    mockRepository.update.mockResolvedValue({
      item: { affectedRows: 0 },
    } as any);

    const result = await useCase.execute(ENTITYId, updateDTO);

    expect(result.item?.affectedRows).toBe(0);
  });
});
