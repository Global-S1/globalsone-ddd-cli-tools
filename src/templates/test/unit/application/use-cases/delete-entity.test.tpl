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
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

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

    mockRepository.delete.mockResolvedValue(expectedResult as any);

    const result = await useCase.execute(ENTITYId);

    expect(result.item?.affectedRows).toBe(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(ENTITYId);
  });

  it("should handle repository errors", async () => {
    const ENTITYId = "test-id-123";

    mockRepository.delete.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(ENTITYId)).rejects.toThrow("Database error");
  });

  it("should handle non-existent ENTITY", async () => {
    const ENTITYId = "non-existent-id";

    mockRepository.delete.mockResolvedValue({
      item: { affectedRows: 0 },
    } as any);

    const result = await useCase.execute(ENTITYId);

    expect(result.item?.affectedRows).toBe(0);
  });
});
