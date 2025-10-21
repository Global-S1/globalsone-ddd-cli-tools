# Steps to add a new entity in the backend

## Files to change
- docs/postman/ENTITY.postman_collection.json
- docs/PRs/PR_ENTITY_entity.md
- src/api/routes/ENTITY.routes.ts
- src/entities/ENTITY/application/use-cases/create-ENTITY.ts
- src/entities/ENTITY/application/use-cases/delete-ENTITY.ts
- src/entities/ENTITY/application/use-cases/find-ENTITY.ts
- src/entities/ENTITY/application/use-cases/update-ENTITY.ts
- src/entities/ENTITY/application/ENTITY.use-cases.ts
- src/entities/ENTITY/domain/interfaces/dto/ENTITY-dto.interface.ts
- src/entities/ENTITY/domain/interfaces/ENTITY-base.interface.ts
- src/entities/ENTITY/domain/interfaces/ENTITY.interface.ts
- src/entities/ENTITY/domain/model/ENTITY.ts
- src/entities/ENTITY/domain/value-objects/ENTITY-id.ts
- src/entities/ENTITY/domain/ENTITY.repository.ts
- src/entities/ENTITY/infrastructure/controllers/ENTITY.controller.ts
- src/entities/ENTITY/infrastructure/repository/ENTITY.repository.ts
- src/entities/ENTITY/infrastructure/validators/create-ENTITY-schema.validator.ts
- src/entities/ENTITY/infrastructure/validators/ENTITY.validators.ts
- src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts
- src/entities/shared/domain/app-context/app-repositories/app-repositories.ts
- src/entities/shared/infraestructure/services/lang/lang_en.json
- src/entities/shared/infraestructure/services/lang/lang_es.json
- test/helpers/ENTITY-fixtures.ts
- test/helpers/mock-context.ts
- test/unit/ENTITY/application/use-cases/create-ENTITY.test.ts
- test/unit/ENTITY/application/use-cases/delete-ENTITY.test.ts
- test/unit/ENTITY/application/use-cases/find-ENTITY.test.ts
- test/unit/ENTITY/application/use-cases/update-ENTITY.test.ts
- test/unit/ENTITY/domain/model/ENTITY.test.ts
- test/unit/user/application/use-cases/login-user.test.ts

## Directory structure for changes

```
├── docs/
│   ├── postman/
│   │   └── ENTITY.postman_collection.json
│   └── PRs/
│       └── PR_ENTITY_entity.md
├── src/
│   ├── api/
│   │   └── routes/
│       └── ENTITY.routes.ts
│   ├── entities/
│   │   └── ENTITY/
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── create-ENTITY.ts
│       │   │   ├── delete-ENTITY.ts
│       │   │   ├── find-ENTITY.ts
│       │   │   └── update-ENTITY.ts
│       │   └── ENTITY.use-cases.ts
│       ├── domain/
│       │   ├── interfaces/
│       │   │   ├── dto/
│       │   │   │   └── ENTITY-dto.interface.ts
│       │   │   ├── ENTITY-base.interface.ts
│       │   │   └── ENTITY.interface.ts
│       │   ├── model/
│       │   │   └── ENTITY.ts
│       │   └── value-objects/
│       │       └── ENTITY-id.ts
│       └── ENTITY.repository.ts
│   ├── infrastructure/
│       └── controllers/
│           └── ENTITY.controller.ts
│       └── repository/
│           └── ENTITY.repository.ts
│       └── validators/
│           └── create-ENTITY-schema.validator.ts
│           └── ENTITY.validators.ts
│   └── shared/
│       ├── domain/
│       │   └── app-context/
│       │       ├── app-repositories/
│       │       │   ├── app-repositories.interface.ts
│       │       │   └── app-repositories.ts
│       └── infrastructure/
│           └── services/
│               └── lang/
│                   ├── lang_en.json
│                   └── lang_es.json
├── test/
│   ├── helpers/
│   │   ├── ENTITY-fixtures.ts
│   │   └── mock-context.ts
│   └── unit/
│       ├── ENTITY/
│       │   ├── application/
│       │   │   ├── use-cases/
│       │   │   │   ├── create-ENTITY.test.ts
│       │   │   │   ├── delete-ENTITY.test.ts
│       │   │   │   ├── find-ENTITY.test.ts
│       │   │   │   └── update-ENTITY.test.ts
│       │   └── domain/
│       │       └── model/
│       │           └── ENTITY.test.ts
│       └── user/
│           └── application/
│               └── use-cases/
│                   └── login-user.test.ts
```

## Steps to implement
1. **Create the entity files**: 
   - Create the necessary TypeScript files in the `src/entities/ENTITY` directory as per the structure above.
   - Implement the domain model, value objects, interfaces, and repository.
2. **Implement use cases**:
   - Create the use case files in `src/entities/ENTITY/application/use-cases`.
   - Implement the logic for creating, deleting, finding, and updating the entity.
3. **Create the controller**:
   - Implement the controller in `src/entities/ENTITY/infrastructure/controllers/ENTITY.controller.ts`.
   - Define the endpoints for the entity operations.
4. **Define routes**:
   - Update `src/api/routes/ENTITY.routes.ts` to include the new entity routes.
5. **Create validators**:
   - Implement the validation schema in `src/entities/ENTITY/infrastructure/validators/create-ENTITY-schema.validator.ts`.
6. **Update shared services**:
   - Add any necessary language files in `src/entities/shared/infrastructure/services/lang/`.
7. **Write tests**:
   - Create unit tests for the use cases and domain model in `test/unit/ENTITY`.
8. **Update documentation**:
   - Modify the Postman collection in `docs/postman/ENTITY.postman_collection.json`.
   - Create a PR description in `docs/PRs/PR_ENTITY_entity.md` to document the changes made.
9. **Commit and push changes**:
   - Ensure all changes are committed with clear messages.


## Changes to be made
### docs/postman/ENTITY.postman_collection.json
```json
{
  "info": {
    "name": "ENTITY API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "ENTITY",
      "item": [
        {
          "name": "List ENTITIES",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/v1/ENTITY",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "v1",
                "ENTITY"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get ENTITY by Id",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/v1/ENTITY/{{ENTITYUuid}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "v1",
                "ENTITY",
                "{{ENTITYUuid}}"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create ENTITY",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 201\", function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "pm.test(\"Response has insertedId\", function () {",
                  "    const responseJson = pm.response.json();",
                  "    pm.expect(responseJson.data.item.insertedId).to.not.be.empty;",
                  "    pm.collectionVariables.set(\"ENTITYUuid\", responseJson.data.item.insertedId);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"studentId\": \"student-id-123\",\n  \"courseId\": \"course-id-123\",\n  \"ENTITYDate\": \"2025-10-20T10:00:00.000Z\",\n  \"paymentStatus\": \"pending\",\n  \"paymentDate\": \"2025-10-20T10:00:00.000Z\",\n  \"paymentMethod\": \"manual\",\n  \"validationToken\": \"test-token\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/v1/ENTITY",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "v1",
                "ENTITY"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update ENTITY",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"paymentStatus\": \"confirmed\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/v1/ENTITY/{{ENTITYUuid}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "v1",
                "ENTITY",
                "{{ENTITYUuid}}"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete ENTITY",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{baseUrl}}/v1/ENTITY/{{ENTITYUuid}}",
              "host": [
                "{{baseUrl}}"
              ],
              "path": [
                "v1",
                "ENTITY",
                "{{ENTITYUuid}}"
              ]
            }
          },
          "response": []
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:30010"
    },
    {
      "key": "ENTITYUuid",
      "value": ""
    }
  ]
}
```

### docs/PRs/PR_ENTITY_entity.md
```markdown
## 🚀 Descripción
Se ha implementado la entidad `ENTITY` en el backend, incluyendo su dominio, aplicación, infraestructura, pruebas y documentación. Además, se han corregido varios tests que fallaban en la rama de `develop`.

- **Tipo de cambio**: Nueva funcionalidad
- **Servicio**: ENTITY
- **PR's relacionados**: N/A

## 📋 Cambios principales
- [x] Nuevos endpoints / modificaciones en endpoints existentes
- [x] Cambios en modelos o esquemas de base de datos
- [x] Actualización en validaciones o lógica de negocio
- [ ] Queries de ejecución necesarios
- [ ] Migraciones de base de datos
- [ ] Cambios en variables de entorno
- [ ] Otros (especificar)

## ✅ Checklist de calidad
- [ ] **QA**: N/A
- [x] **Tests unitarios**: agregados/actualizados
- [ ] **Tests de integración**: pasaron correctamente
- [x] **Build exitoso**: `npm run build` sin errores
- [x] **Tests pasando**: `npm test` (100% passing)
- [x] **Linting**: `npm run lint` sin errores
- [x] **Documentación**: endpoints actualizados (Swagger/Postman/README)
- [ ] **Verificación de sincronía**: revisada la ejecución en el entorno
- [ ] **Evidencia de despliegue**: ejecutado en stage/ambiente de pruebas

## 🧪 Cómo probar

### Setup:
\```bash
# 1. Clonar la rama
git checkout [nombre-rama]

# 2. Instalar dependencias
npm install

# 3. Iniciar servicios
docker-compose up -d

# 4. Ejecutar aplicación
npm run dev
\```

### Pruebas:
\```bash
# Ejecutar los tests
npm test
\```

## 📸 Screenshots/Logs

### Evidencia de Tests:
\```
Test Suites: 32 passed, 32 total
Tests:       116 passed, 116 total
Snapshots:   0 total
Time:        2.618 s
Ran all test suites.
\```

## 🏷️ Labels sugeridos
- `enhancement`
- `backend`
```

### src/api/routes/ENTITY.routes.ts
```typescript
import { Router } from "express";
import { RouterBase } from "../routes-config/routes-base";
import { ENTITYController } from "../../entities/ENTITY/infrastructure/controllers/ENTITY.controller";
import { IAppContext } from "../../entities/shared/domain/app-context/app-context.interface";

class ENTITYRouter extends RouterBase<ENTITYController> {
  constructor(readonly context: IAppContext) {
    super(ENTITYController, context);
  }

  routes(): void {
    this.router
      .route("/")
      .get(this.controller.listENTITYs.bind(this.controller))
      .post(this.controller.createENTITY.bind(this.controller));

    this.router
      .route("/:ENTITYId")
      .get(this.controller.findENTITYById.bind(this.controller))
      .patch(this.controller.updateENTITY.bind(this.controller))
      .delete(this.controller.deleteENTITY.bind(this.controller));
  }
}

export const router = (context: IAppContext): Router =>
  new ENTITYRouter(context).router;
```

### src/entities/ENTITY/application/use-cases/create-ENTITY.ts
```typescript
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { insertedId } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYRepository } from "../../domain/ENTITY.repository";
import { ENTITY } from "../../domain/model/ENTITY";
import { IENTITY } from "../../domain/interfaces/ENTITY.interface";

export class CreateENTITY {
  private readonly ENTITYRepository: IENTITYRepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async execute(
    data: IENTITY
  ): Promise<IDBDataItemRequired<insertedId>> {
    try {
      const ENTITY = ENTITY.create(data);

      return await this.ENTITYRepository.create(ENTITY.toPrimitives());
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
```

### src/entities/ENTITY/application/use-cases/delete-ENTITY.ts
```typescript
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { modifiedCount } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYRepository } from "../../domain/ENTITY.repository";

export class DeleteENTITY {
  private readonly ENTITYRepository: IENTITYRepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async execute(
    ENTITYId: string
  ): Promise<IDBDataItemRequired<modifiedCount>> {
    try {
      return await this.ENTITYRepository.deleteByUuid(ENTITYId);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}

```

### src/entities/ENTITY/application/use-cases/find-ENTITY.ts
```typescript
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import {
  IDBDataItemsRequired,
  IDBDataItemRequired,
} from "../../../shared/domain/interfaces/db-response.interface";
import { IPaginationQuery } from "../../../shared/domain/interfaces/pagination-query.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYDTO } from "../../domain/interfaces/dto/ENTITY-dto.interface";
import { IENTITY } from "../../domain/interfaces/ENTITY.interface";
import { IENTITYRepository } from "../../domain/ENTITY.repository";

export class FindENTITY {
  private readonly ENTITYRepository: IENTITYRepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async findByFilters(
    filters?: Partial<IENTITY>,
    pagination?: IPaginationQuery
  ): Promise<IDBDataItemsRequired<IENTITYDTO>> {
    try {
      return await this.ENTITYRepository.find({ criteria: filters, pagination });
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async findById(
    ENTITYId: string
  ): Promise<IDBDataItemRequired<IENTITYDTO>> {
    try {
      return await this.ENTITYRepository.findByUuid(ENTITYId);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}

```

### src/entities/ENTITY/application/use-cases/update-ENTITY.ts
```typescript
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import { IDBDataItemRequired } from "../../../shared/domain/interfaces/db-response.interface";
import { modifiedCount } from "../../../shared/domain/interfaces/repository-base.interface";
import { errorHandler } from "../../../shared/domain/error/error-handler";
import { IENTITYBase } from "../../domain/interfaces/ENTITY-base.interface";
import { IENTITYRepository } from "../../domain/ENTITY.repository";

export class UpdateENTITY {
  private readonly ENTITYRepository: IENTITYRepository;

  constructor(private readonly context: IAppContext) {
    this.ENTITYRepository =
      this.context.repositories.ENTITYRepository;
  }

  async execute(
    ENTITYId: string,
    data: Partial<IENTITYBase>
  ): Promise<IDBDataItemRequired<modifiedCount>> {
    try {
      return await this.ENTITYRepository.update(ENTITYId, data);
    } catch (error) {
      throw errorHandler(error);
    }
  }
}
```

### src/entities/ENTITY/application/ENTITY.use-cases.ts
```typescript
import { IAppContext } from "../../shared/domain/app-context/app-context.interface";
import { IPaginationQuery } from "../../shared/domain/interfaces/pagination-query.interface";
import { IENTITYBase } from "../domain/interfaces/ENTITY-base.interface";
import { IENTITY } from "../domain/interfaces/ENTITY.interface";
import { CreateENTITY } from "./use-cases/create-ENTITY";
import { DeleteENTITY } from "./use-cases/delete-ENTITY";
import { FindENTITY } from "./use-cases/find-ENTITY";
import { UpdateENTITY } from "./use-cases/update-ENTITY";

export class ENTITYUseCases {
  private readonly findENTITYUseCase: FindENTITY;
  private readonly createENTITYUseCase: CreateENTITY;
  private readonly updateENTITYUseCase: UpdateENTITY;
  private readonly deleteENTITYUseCase: DeleteENTITY;

  constructor(readonly appContext: IAppContext) {
    this.findENTITYUseCase = new FindENTITY(appContext);
    this.createENTITYUseCase = new CreateENTITY(appContext);
    this.updateENTITYUseCase = new UpdateENTITY(appContext);
    this.deleteENTITYUseCase = new DeleteENTITY(appContext);
  }

  findENTITY(
    filters?: Partial<IENTITY>,
    pagination?: IPaginationQuery
  ) {
    return this.findENTITYUseCase.findByFilters(filters, pagination);
  }

  findENTITYById(ENTITYId: string) {
    return this.findENTITYUseCase.findById(ENTITYId);
  }

  createENTITY(data: IENTITY) {
    return this.createENTITYUseCase.execute(data);
  }

  updateENTITY(
    ENTITYId: string,
    data: Partial<IENTITYBase>
  ) {
    return this.updateENTITYUseCase.execute(ENTITYId, data);
  }

  deleteENTITY(ENTITYId: string) {
    return this.deleteENTITYUseCase.execute(ENTITYId);
  }
}
```

### src/entities/ENTITY/domain/interfaces/dto/ENTITY-dto.interface.ts
```typescript
import { IDatetime } from "../../../../shared/domain/interfaces/datetime.interface";
import { IENTITY } from "../ENTITY.interface";

export interface IENTITYDTO extends IENTITY, IDatetime {}
```

### src/entities/ENTITY/domain/interfaces/ENTITY-base.interface.ts
```typescript
import { EntityId } from "../../../shared/domain/interfaces/entityId.type";

export interface IENTITYBase {
    ...ENTITYBaseFields
}
```

### src/entities/ENTITY/domain/interfaces/ENTITY.interface.ts
```typescript
import { EntityId } from "../../../shared/domain/interfaces/entityId.type";
import { IENTITYBase } from "./ENTITY-base.interface";

export interface IENTITY extends IENTITYBase {
  ENTITYId: EntityId;
}
```

### src/entities/ENTITY/domain/model/ENTITY.ts
```typescript
import { IENTITY } from "../interfaces/ENTITY.interface";
import { IENTITYDTO } from "../interfaces/dto/ENTITY-dto.interface";
import { EntityId } from "../../../shared/domain/interfaces/entityId.type";

export class ENTITY {
  public readonly ENTITYDate: Date;
  
  private constructor(
    public ENTITYId: EntityId = null,
    ENTITYDate: string | Date,
    // Other ENTITY fields
  ) {
    this.ENTITYDate = new Date(ENTITYDate);
  }

  static create(data: IENTITY): ENTITY {
    return new ENTITY(
      data.ENTITYId,
      // Entity fields
    );
  }

  static fromPrimitives(data: IENTITY): ENTITY {
    return new ENTITY(
      data.ENTITYId,
      // Entity fields
    );
  }

  toPrimitives(): IENTITY {
    return {
      ENTITYId: this.ENTITYId,
      // ENTITY fields
    };
  }

  toDatabase(): Partial<IENTITY> {
    return {
        // ENTITY fields to be stored in the database
    };
  }

  toDTO(data: IENTITYDTO): IENTITYDTO {
    return {
      ENTITYId: this.ENTITYId,
      // Entity fields to be included in the DTO
    };
  }
}
```

### src/entities/ENTITY/domain/value-objects/ENTITY-id.ts
```typescript
import { Identifier } from "../../../shared/domain/value-objects/Identifier";

export class ENTITYId extends Identifier {}
```

### src/entities/ENTITY/domain/ENTITY.repository.ts
```typescript
import { CommonOperations } from "../../shared/domain/interfaces/repository-base.interface";
import { IENTITYBase } from "./interfaces/ENTITY-base.interface";
import { IENTITYDTO } from "./interfaces/dto/ENTITY-dto.interface";
import { IENTITY } from "./interfaces/ENTITY.interface";

export interface IENTITYRepository
  extends CommonOperations<
    IENTITY,
    IENTITYBase,
    IENTITYDTO
  > {}
  ```

### src/entities/ENTITY/infrastructure/controllers/ENTITY.controller.ts
```typescript
import { ENTITYUseCases } from "../../application/ENTITY.use-cases";
import { IENTITYBase } from "../../domain/interfaces/ENTITY-base.interface";
import { IAppContext } from "../../../shared/domain/app-context/app-context.interface";
import {
  Controller,
  IControllerData,
} from "../../../shared/infraestructure/interceptors/controller.decorator";
import { Validator } from "../../../shared/infraestructure/interceptors/validator.decorator";
import { createENTITYShcemaV } from "../validators/ENTITY.validators";
import { IENTITY } from "../../domain/interfaces/ENTITY.interface";

@Controller
export class ENTITYController {
  private readonly ENTITYUseCases: ENTITYUseCases;

  constructor(readonly context: IAppContext) {
    this.ENTITYUseCases = new ENTITYUseCases(context);
  }

  async listENTITYs({ pagination }: IControllerData) {
    try {
      const filters = {};

      const response = await this.ENTITYUseCases.findENTITY(
        filters,
        pagination
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async findENTITYById({ params }: IControllerData) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response =
        await this.ENTITYUseCases.findENTITYById(id);

      return response;
    } catch (error) {
      return error;
    }
  }

  @Validator("ENTITY.request", createENTITYShcemaV)
  async createENTITY({ body }: IControllerData<IENTITY>) {
    try {
      const response = await this.ENTITYUseCases.createENTITY(
        body
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async updateENTITY({
    params,
    body,
  }: IControllerData<IENTITYBase>) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response = await this.ENTITYUseCases.updateENTITY(
        id,
        body
      );

      return response;
    } catch (error) {
      return error;
    }
  }

  async deleteENTITY({ params }: IControllerData) {
    try {
      const id = String(params?.ENTITYId ?? "");

      const response = await this.ENTITYUseCases.deleteENTITY(
        id
      );

      return response;
    } catch (error) {
      return error;
    }
  }
}
```

### src/entities/ENTITY/infrastructure/repository/ENTITY.repository.ts
```typescript
import { CommonRepository } from "../../../shared/infraestructure/database/sql/common.repository";
import { IDatabase } from "../../../shared/infraestructure/database/sql/mysql";
import { IENTITYRepository } from "../../domain/ENTITY.repository";
import { IENTITYBase } from "../../domain/interfaces/ENTITY-base.interface";
import { IENTITYDTO } from "../../domain/interfaces/dto/ENTITY-dto.interface";
import { IENTITY } from "../../domain/interfaces/ENTITY.interface";
import { ENTITY } from "../../domain/model/ENTITY";
import { ENTITYSchema } from "./ENTITY.schema";

export class ENTITYRepository
  extends CommonRepository<
    IENTITY,
    IENTITYBase,
    IENTITYDTO
  >
  implements IENTITYRepository
{
  constructor(readonly dbRead: IDatabase, readonly dbWrite: IDatabase) {
    super({
      dbRead,
      dbWrite,
      tableName: "ENTITY",
      entityName: "ENTITY",
      primaryKey: "ENTITYId",
      tableSchema: ENTITYSchema,
      dto: ENTITY,
    });
  }
}
```

### src/entities/ENTITY/infrastructure/validators/create-ENTITY-schema.validator.ts
```typescript
import { CommonSchema } from "../../../shared/infraestructure/database/sql/common.schema";
import { ISchema } from "../../../shared/infraestructure/database/sql/table-builder/interfaces/schema.interface";
import { IENTITYDTO } from "../../domain/interfaces/dto/ENTITY-dto.interface";

export const ENTITYSchema: ISchema<IENTITYDTO>[] = [
  {
    columnName: "ENTITYId",
    type: "uuid",
    typeOptions: {
      length: 36,
      primaryKey: true,
    },
    typeProperties: {
      comment: "ENTITY UUID",
      unique: true,
      nullable: false,
    },
  },
  /// Add other ENTITY fields here
  ...CommonSchema,
];
```

### src/entities/ENTITY/infrastructure/validators/ENTITY.validators.ts
```typescript
import ajv from "../../../shared/infraestructure/config/ajv";
import { IValidatorMessage } from "../../../shared/infraestructure/validators/interfaces/validator-messages.interface";
import { CreateENTITYSchemaValidator } from "./create-ENTITY-schema.validator";

export const createENTITYShcemaV = (
  validationMessages: IValidatorMessage
) => ajv.compile(CreateENTITYSchemaValidator(validationMessages));
```

### src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts
```typescript
// ... other repositories imports
import { IENTITYRepository } from "../../../../ENTITY/domain/ENTITY.repository";

export interface IAppRepositories {
  //... other repositories
  ENTITYRepository: IENTITYRepository;
}
```

### src/entities/shared/domain/app-context/app-repositories/app-repositories.ts
```typescript
// ... other repositories imports
import { IENTITYRepository } from "../../../../../ENTITY/domain/ENTITY.repository";
import { ENTITYRepository } from "../../../../../ENTITY/infrastructure/repository/ENTITY.repository";

export class AppRepositories implements IAppRepositories {
  // ... other repositories
  ENTITYRepository: IENTITYRepository;

  constructor() {
    // ... other repositories initialization
    this.ENTITYRepository = new ENTITYRepository(
      databaseRead,
      databaseWrite
    )
  }
}
```

### src/entities/shared/infraestructure/services/lang/lang_en.json
```json
{
  "ENTITY": {
    "request": {
      "createENTITY": {
        "errorMessage": {
            // ... other error messages
        },
        "required": {
            // ... other required fields
        }
      }
    }
}
```

### src/entities/shared/infraestructure/services/lang/lang_es.json
```json
{
  "ENTITY": {
    "request": {
      "createENTITY": {
        "errorMessage": {
            // ... other error messages
        },
        "required": {
            // ... other required fields
        }
      }
    }
}
```

### test/helpers/ENTITY-fixtures.ts
```typescript
import { IENTITY } from "../../src/entities/ENTITY/domain/interfaces/ENTITY.interface";
import { IENTITYDTO } from "../../src/entities/ENTITY/domain/interfaces/dto/ENTITY-dto.interface";

export const createENTITYFixture = (data?: Partial<IENTITY>): IENTITY => {
  return {
    ENTITYId: "ENTITY-id-123",
    studentId: "student-id-123",
    courseId: "course-id-123",
    ENTITYDate: new Date().toISOString(),
    paymentStatus: "pending",
    paymentDate: new Date().toISOString(),
    paymentMethod: "manual",
    validationToken: "test-token",
    ...data,
  };
};

export const createENTITYDTOFixture = (data?: Partial<IENTITYDTO>): IENTITYDTO => {
    return {
        ENTITYId: "ENTITY-id-123",
        // Other ENTITY fields dummy data
        ...data,
    };
};
```

### test/helpers/mock-context.ts
```typescript
      // Mock context for testing
      ENTITYRepository: {},
    } as IAppRepositories,
    services: {} as IAppServices,
    externalServices: {} as IAppExternalServices,
```

### test/unit/ENTITY/application/use-cases/create-ENTITY.test.ts
```typescript
import { CreateENTITY } from "../../../../../src/entities/ENTITY/application/use-cases/create-ENTITY";
import { IENTITYRepository } from "../../../../../src/entities/ENTITY/domain/ENTITY.repository";
import { createENTITYDTOFixture } from "../../../../helpers/ENTITY-fixtures";
import { createMockContext } from "../../../../helpers/mock-context";

describe("CreateENTITY Use Case", () => {
  let useCase: CreateENTITY;
  let mockRepository: jest.Mocked<IENTITYRepository>;

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

    useCase = new CreateENTITY(context);
  });

  it("should create a ENTITY successfully", async () => {
    const createDTO = createENTITYDTOFixture();
    const expectedResult = {
      item: { insertedId: "test-id-123" },
    };

    mockRepository.create.mockResolvedValue(expectedResult as any);

    const result = await useCase.execute(createDTO);

    expect(result.item?.insertedId).toBeDefined();
  });

  it("should handle repository errors", async () => {
    const createDTO = createENTITYDTOFixture();

    mockRepository.create.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(createDTO)).rejects.toThrow("Database error");
  });

  it("should validate ENTITY data before creation", async () => {
    const createDTO = createENTITYDTOFixture();

    const expectedResult = {
      item: { insertedId: "some-id" },
    };

    mockRepository.create.mockResolvedValue(expectedResult as any);

    await useCase.execute(createDTO);

    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });
});
```

### test/unit/ENTITY/application/use-cases/delete-ENTITY.test.ts
```typescript
import { DeleteENTITY } from "../../../../../src/entities/ENTITY/application/use-cases/delete-ENTITY";
import { IENTITYRepository } from "../../../../../src/entities/ENTITY/domain/ENTITY.repository";
import { createMockContext } from "../../../../helpers/mock-context";

describe("DeleteENTITY Use Case", () => {
  let useCase: DeleteENTITY;
  let mockRepository: jest.Mocked<IENTITYRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteByUuid: jest.fn(),
    } as any;

    const context = createMockContext({
      repositories: {
        ENTITYRepository: mockRepository,
      } as any,
    });

    useCase = new DeleteENTITY(context);
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
```

### test/unit/ENTITY/application/use-cases/find-ENTITY.test.ts
```typescript
import { FindENTITY } from "../../../../../src/entities/ENTITY/application/use-cases/find-ENTITY";
import { IENTITYRepository } from "../../../../../src/entities/ENTITY/domain/ENTITY.repository";
import { createENTITYFixture } from "../../../../helpers/ENTITY-fixtures";
import { createMockContext } from "../../../../helpers/mock-context";


describe("FindENTITY Use Case", () => {
  let useCase: FindENTITY;
  let mockRepository: jest.Mocked<IENTITYRepository>;

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

    useCase = new FindENTITY(context);
  });

  it("should find all ENTITYs successfully", async () => {
    const mockENTITYs = [
      createENTITYFixture(),
      createENTITYFixture({ ENTITYId: "another-id" }),
    ];

    mockRepository.find.mockResolvedValue({
      items: mockENTITYs,
      pagination: { totalItems: 2 },
    } as any);

    const result = await useCase.findByFilters({}, {
      page: 1, size: 10,
      sortBy: ""
    });

    expect(result.items).toHaveLength(2);
    expect(result.pagination?.totalItems).toBe(2);
    expect(mockRepository.find).toHaveBeenCalledWith({
      criteria: {},
      pagination: { page: 1, size: 10, sortBy: "" },
    });
  });

  it("should return empty array when no ENTITYs found", async () => {
    mockRepository.find.mockResolvedValue({
      items: [],
      pagination: { totalItems: 0 },
    } as any);

    const result = await useCase.findByFilters({}, {
      page: 1, size: 10,
      sortBy: ""
    });

    expect(result.items).toHaveLength(0);
    expect(result.pagination?.totalItems).toBe(0);
  });

  it("should handle repository errors", async () => {
    mockRepository.find.mockRejectedValue(new Error("Database error"));

    await expect(useCase.findByFilters(undefined, {
      page: 1, size: 10,
      sortBy: ""
    })).rejects.toThrow(
      "Database error"
    );
  });
});
```

### test/unit/ENTITY/application/use-cases/update-ENTITY.test.ts
```typescript
import { UpdateENTITY } from "../../../../../src/entities/ENTITY/application/use-cases/update-ENTITY";
import { IENTITYRepository } from "../../../../../src/entities/ENTITY/domain/ENTITY.repository";
import { createENTITYDTOFixture } from "../../../../helpers/ENTITY-fixtures";
import { createMockContext } from "../../../../helpers/mock-context";


describe("UpdateENTITY Use Case", () => {
  let useCase: UpdateENTITY;
  let mockRepository: jest.Mocked<IENTITYRepository>;

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

    useCase = new UpdateENTITY(context);
  });

  it("should update a ENTITY successfully", async () => {
    const ENTITYId = "test-id-123";
    const updateDTO = createENTITYDTOFixture();
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
    const updateDTO = createENTITYDTOFixture();

    mockRepository.update.mockRejectedValue(new Error("Database error"));

    await expect(useCase.execute(ENTITYId, updateDTO)).rejects.toThrow(
      "Database error"
    );
  });

  it("should handle non-existent ENTITY", async () => {
    const ENTITYId = "non-existent-id";
    const updateDTO = createENTITYDTOFixture();

    mockRepository.update.mockResolvedValue({
      item: { affectedRows: 0 },
    } as any);

    const result = await useCase.execute(ENTITYId, updateDTO);

    expect(result.item?.affectedRows).toBe(0);
  });
});
```

### test/unit/ENTITY/infrastructure/controllers/ENTITY.controller.test.ts
```typescript
import { ENTITY } from "../../../../../src/entities/ENTITY/domain/model/ENTITY";
import { createENTITYFixture, createENTITYDTOFixture } from "../../../../helpers/ENTITY-fixtures";


describe("ENTITY Domain Model", () => {
  describe("create", () => {
    it("should create a new ENTITY instance", () => {
      const createDTO = createENTITYFixture();
      const ENTITY = ENTITY.create(createDTO);

      expect(ENTITY).toBeInstanceOf(ENTITY);
      expect(ENTITY.studentId).toBe(createDTO.studentId);
      expect(ENTITY.courseId).toBe(createDTO.courseId);
    });

    it("should create a ENTITY with custom values", () => {
      const customData = createENTITYFixture({
        paymentStatus: "confirmed",
      });

      const ENTITY = ENTITY.create(customData);

      expect(ENTITY).toBeDefined();
      expect(ENTITY.paymentStatus).toBe(customData.paymentStatus);
    });
  });

  describe("fromPrimitives", () => {
    it("should create a ENTITY from primitives with ID", () => {
      const primitiveData = createENTITYFixture();
      const ENTITY = ENTITY.fromPrimitives(primitiveData);

      expect(ENTITY.ENTITYId).toBeDefined();
      expect(ENTITY.ENTITYId).toBe("ENTITY-id-123");
      expect(ENTITY.studentId).toBe(primitiveData.studentId);
      expect(ENTITY.courseId).toBe(primitiveData.courseId);
    });
  });

  describe("toPrimitives", () => {
    it("should convert ENTITY to primitives", () => {
      const primitiveData = createENTITYFixture();
      const ENTITY = ENTITY.fromPrimitives(primitiveData);
      const result = ENTITY.toPrimitives();

      expect(result.ENTITYId).toBe("ENTITY-id-123");
      expect(result.studentId).toBe(primitiveData.studentId);
      expect(result.courseId).toBe(primitiveData.courseId);
    });
  });

  describe("toDatabase", () => {
    it("should convert ENTITY to database format", () => {
      const createDTO = createENTITYFixture();
      const ENTITY = ENTITY.create(createDTO);
      const result = ENTITY.toDatabase();

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty("ENTITYId");
      expect(result.studentId).toBe(createDTO.studentId);
      expect(result.courseId).toBe(createDTO.courseId);
    });
  });

  describe("toDTO", () => {
    it("should convert ENTITY to DTO with datetime fields", () => {
      const primitiveData = createENTITYFixture();
      const dtoData = createENTITYDTOFixture();
      const ENTITY = ENTITY.fromPrimitives(primitiveData);
      const result = ENTITY.toDTO(dtoData);

      expect(result.ENTITYId).toBe("ENTITY-id-123");
      expect(result.studentId).toBe(primitiveData.studentId);
      expect(result.courseId).toBe(primitiveData.courseId);
      expect(result.insDatetime).toBeDefined();
      expect(result.updDatetime).toBeDefined();
    });
  });
});
```

### test/unit/user/application/use-cases/login-user.test.ts
```typescript
 create: jest.fn(),
    // Mock other methods as needed

    const mockENTITYRepository = {
        create: jest.fn(),
    } as any;


    mockCacheService = {
      save: jest.fn(),
        // Mock other cache methods as needed
        ENTITYRepository: mockENTITYRepository,
      },
      services: {
        cacheService: mockCacheService,
        // Mock other services as needed
      },
```
