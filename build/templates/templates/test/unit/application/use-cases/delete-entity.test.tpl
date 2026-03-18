import { DeleteENTITYCAPITALIZE } from "../../../../../src/entities/ENTITYKEBAB/application/use-cases/delete-ENTITYKEBAB";
import { IENTITYCAPITALIZERepository } from "../../../../../src/entities/ENTITYKEBAB/domain/ENTITYKEBAB.repository";
import { createMockContext } from "../../../../helpers/mock-context";

describe("DeleteENTITYCAPITALIZE Use Case", () => {
  let useCase: DeleteENTITYCAPITALIZE;
  let mockRepository: jest.Mocked<IENTITYCAPITALIZERepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findByUuid: jest.fn(),
      update: jest.fn(),
      deleteByUuid: jest.fn(),
    } as any;

    const context = createMockContext({
      repositories: {
        ENTITYRepository: mockRepository,
      },
    });

    useCase = new DeleteENTITYCAPITALIZE(context);
  });

  it("should delete a ENTITY successfully", async () => {
    const ENTITYId = "test-id-123";
    const expectedResult = {
      item: { affectedRows: 1 },
    };

    mockRepository.deleteByUuid.mockResolvedValue(expectedResult as any);

    const result = await useCase.execute(ENTITYId);

    expect(result.item?.affectedRows).toBe(1);
    expect(mockRepository.deleteByUuid).toHaveBeenCalledWith(ENTITYId);
  });

  it("should handle repository errors", async () => {
    const ENTITYId = "test-id-123";

    mockRepository.deleteByUuid.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(ENTITYId)).rejects.toThrow("Database error");
  });

  it("should handle non-existent ENTITY", async () => {
    const ENTITYId = "non-existent-id";

    mockRepository.deleteByUuid.mockResolvedValue({
      item: { affectedRows: 0 },
    } as any);

    const result = await useCase.execute(ENTITYId);

    expect(result.item?.affectedRows).toBe(0);
  });
});
