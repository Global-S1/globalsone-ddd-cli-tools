import { FindENTITYCAPITALIZE } from "../../../../../../src/entities/ENTITYKEBAB/application/use-cases/find-ENTITYKEBAB";
import { IENTITYCAPITALIZERepository } from "../../../../../../src/entities/ENTITYKEBAB/domain/ENTITYKEBAB.repository";
import { createMockContext } from "../../../../../helpers/mock-context";
import { createENTITYCAPITALIZEFixture } from "../../../../../helpers/ENTITYKEBAB-fixtures";

describe("FindENTITYCAPITALIZE Use Case", () => {
  let useCase: FindENTITYCAPITALIZE;
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

    useCase = new FindENTITYCAPITALIZE(context);
  });

  it("should find all ENTITIES successfully", async () => {
    const mockENTITIES = [
      createENTITYCAPITALIZEFixture(),
      createENTITYCAPITALIZEFixture({ ENTITYId: "another-id" }),
    ];

    mockRepository.find.mockResolvedValue({
      items: mockENTITIES,
      total: 2,
    } as any);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(mockRepository.find).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it("should return empty array when no ENTITIES found", async () => {
    mockRepository.find.mockResolvedValue({
      items: [],
      total: 0,
    } as any);

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should handle repository errors", async () => {
    mockRepository.find.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow(
      "Database error"
    );
  });
});
