# Entity Generator CLI

[![npm version](https://img.shields.io/npm/v/ddd-cli-tools.svg)](https://www.npmjs.com/package/ddd-cli-tools)
[![tests](https://img.shields.io/badge/tests-107%20passing-brightgreen.svg)]()
[![GitHub stars](https://img.shields.io/github/stars/Global-S1/globalsone-ddd-cli-tools?style=social)](https://github.com/Global-S1/globalsone-ddd-cli-tools)

Generador automatizado de entidades con arquitectura DDD (Domain-Driven Design) para el microservicio.

> **Si este proyecto te resulta útil, considera darle una estrella en [GitHub](https://github.com/Global-S1/globalsone-ddd-cli-tools). Tu apoyo nos motiva a seguir mejorándolo.**

## 🚀 Características

### ✅ Implementadas

1. **Pluralización Robusta**
   - Usa la librería `pluralize` para manejar correctamente casos irregulares
   - Soporta override manual con `--pluralName`
   - Ejemplos: Person → People, Category → Categories

2. **Validación y Feedback Mejorado**
   - Validación de nombres de entidad (letras, números, guiones)
   - Validación de opciones de base de datos
   - Mensajes de error claros y específicos
   - Resumen detallado de operaciones realizadas

3. **Modo Dry-Run**
   - Previsualiza todos los archivos y directorios a crear
   - Ejecuta con `--dry-run` para ver cambios sin aplicarlos
   - Útil para verificar antes de generar

4. **Selección de Capas**
   - Genera solo las capas que necesitas
   - Opciones: `domain`, `application`, `infrastructure`, `api`
   - Por defecto genera todas las capas

5. **Motor de Plantillas Handlebars**
   - Soporte para plantillas con lógica condicional
   - Retrocompatible con plantillas de reemplazo simple
   - Fácil de extender con helpers personalizados

6. **Registro Automático en AppContext**
   - Auto-inyecta el repositorio en `AppRepositories`
   - Actualiza automáticamente interfaces y implementaciones
   - Soporta MySQL, MongoDB y PostgreSQL

7. **Arquitectura Modular y Testeable**
   - Código separado en módulos independientes
   - Fácil de mantener y extender
   - Preparado para tests unitarios

8. **Generación Automática de Tests**
   - Tests unitarios para modelos de dominio
   - Tests para todos los casos de uso (CRUD)
   - Fixtures automáticos con valores por defecto
   - Opción `--skip-tests` para desactivar
   - Integración completa con Jest

9. **Generación de Migraciones de Base de Datos**
   - Migraciones Knex para MySQL/PostgreSQL
   - Schemas de colección para MongoDB
   - Timestamped y listas para ejecutar
   - Opción `--with-migrations`
   - Incluye índices y comentarios

10. **Comando Rollback/Clean** ⭐ NUEVO
   - Revierte entidades generadas completamente
   - Tracking automático de archivos
   - Limpieza de AppContext automática
   - Modo dry-run para previsualizar
   - Lista de entidades rastreadas

## 📖 Uso

### Instalación

```bash
npm install -g ddd-cli-tools
```

### Uso Global

```bash
ddd-cli <EntityName> [options]
```

### Uso con npx

```bash
npx ddd-cli-tools <EntityName> [options]
```

### Uso en un Proyecto

#### 1. Instalar como Dependencia de Desarrollo

```bash
npm install ddd-cli-tools --save-dev
```

#### 2. Agregar Scripts a `package.json`

Puedes agregar los siguientes scripts a tu archivo `package.json` para facilitar el uso de la herramienta:

```json
"scripts": {
  "generate": "ddd-cli",
  "generate:rollback": "node node_modules/ddd-cli-tools/build/rollback.js"
}
```

#### 3. Usar los Scripts

Ahora puedes usar los scripts para generar y revertir entidades:

```bash
# Generar una entidad
npm run generate -- User --db=mysql

# Revertir una entidad
npm run generate:rollback -- user
```

### Sintaxis Básica

```bash
npm run generate -- <EntityName> [options]
```

### Opciones Disponibles

| Opción | Descripción | Valores | Default |
|--------|-------------|---------|---------|
| `--db` | Tipo de base de datos | mysql, mongo, mongodb, postgres | mysql |
| `--pluralName` | Override del nombre plural | cualquier string | auto |
| `--dry-run` | Previsualizar sin crear archivos | - | false |
| `--skip-tests` | No generar tests unitarios | - | false |
| `--with-migrations` | Generar archivos de migración | - | false |
| `--layers` | Capas a generar | domain,application,infrastructure,api | all |
| `--help` | Mostrar ayuda | - | - |

### Ejemplos

#### Ejemplo Básico
```bash
npm run generate -- User
```

#### Con Base de Datos MongoDB
```bash
npm run generate -- Product --db=mongo
```

#### Con Nombre Plural Personalizado
```bash
npm run generate -- Category --pluralName=Categories
```

#### Modo Dry-Run (Preview)
```bash
npm run generate -- Order --dry-run
```

#### Solo Capas Específicas
```bash
npm run generate -- Customer --layers=domain,application
```

#### Sin Tests
```bash
npm run generate -- Invoice --skip-tests
```

#### Con Migraciones
```bash
npm run generate -- Payment --with-migrations --db=postgres
```

#### Ejemplo Completo
```bash
npm run generate -- Post --db=mysql --pluralName=Posts --dry-run --with-migrations
```

## 📁 Estructura Generada

```
src/
├── entities/
│   └── {entity-kebab}/
│       ├── domain/
│       │   ├── interfaces/
│       │   │   ├── dto/{entity}-dto.interface.ts
│       │   │   ├── {entity}-base.interface.ts
│       │   │   └── {entity}.interface.ts
│       │   ├── model/{entity}.ts
│       │   ├── value-objects/{entity}-id.ts
│       │   └── {entity}.repository.ts
│       ├── application/
│       │   ├── use-cases/
│       │   │   ├── create-{entity}.ts
│       │   │   ├── find-{entity}.ts
│       │   │   ├── update-{entity}.ts
│       │   │   └── delete-{entity}.ts
│       │   └── {entity}.use-cases.ts
│       └── infrastructure/
│           └── repository/
│               ├── {entity}.repository.ts
│               └── {entity}.schema.ts (MySQL/PostgreSQL)
└── api/
    ├── controllers/{entity}.controller.ts
    └── routes/{entity}.routes.ts

test/ (si --skip-tests NO se usa)
├── helpers/
│   └── {entity}-fixtures.ts
└── unit/
    └── {entity-kebab}/
        ├── domain/
        │   └── model/{entity}.test.ts
        └── application/
            └── use-cases/
                ├── create-{entity}.test.ts
                ├── find-{entity}.test.ts
                ├── update-{entity}.test.ts
                └── delete-{entity}.test.ts

migrations/ (si --with-migrations se usa)
└── YYYYMMDDHHMMSS_create_{entities}_table.ts (MySQL/PostgreSQL)
    o
    {entities}-collection-schema.ts (MongoDB)
```

## 🗄️ Bases de Datos Soportadas

### MySQL (Default)
```bash
npm run generate -- User --db=mysql
```

**Conexión:** `databaseRead`, `databaseWrite`

### MongoDB
```bash
npm run generate -- Product --db=mongo
```

**Conexión:** `mongoDBRead.connection`, `mongoDBWrite.connection`

### PostgreSQL
```bash
npm run generate -- Order --db=postgres
```

**Conexión:** `postgresRead`, `postgresWrite`

**Nota:** Al usar la opción `postgres`, el generador creará automáticamente los archivos de configuración básicos en `src/entities/shared/infraestructure/database/postgres`. Debes adaptar estos archivos a tu proyecto.

## 🔧 Registro Automático

El generador automáticamente:

1. ✅ Agrega la interfaz del repositorio a `IAppRepositories`
2. ✅ Importa las dependencias necesarias
3. ✅ Declara la propiedad en `AppRepositories`
4. ✅ Inicializa el repositorio en el constructor
5. ✅ Usa la conexión correcta según la base de datos

### Archivos Modificados Automáticamente

- `src/entities/shared/domain/app-context/app-repositories/app-repositories.interface.ts`
- `src/entities/shared/infraestructure/config/app-context/app-repositories/app-repositories.ts`

## 🏗️ Arquitectura del Generador

```
cli-tools/generator/
├── core/
│   └── entity-generator.ts       # Generador principal
├── utils/
│   ├── cli-parser.ts             # Parser de argumentos CLI
│   ├── validators.ts             # Validadores
│   ├── string-transformers.ts    # Utilidades de string
│   ├── file-system.ts            # Manager de archivos
│   ├── template-processor.ts     # Procesador de plantillas
│   └── code-injector.ts          # Inyección de código
├── templates/                     # Plantillas .tpl
└── generate.ts                    # Entry point
```

## 🎯 Casos de Uso

### Desarrollo Rápido
```bash
# Generar entidad completa
npm run generate -- Invoice
```

### Solo Modelo de Dominio
```bash
# Solo capa de dominio
npm run generate -- Payment --layers=domain
```

### Preview de Cambios
```bash
# Ver qué se generaría
npm run generate -- Subscription --dry-run
```

### Plurales Irregulares
```bash
# Nombres con plural irregular
npm run generate -- Person --pluralName=People
npm run generate -- Child --pluralName=Children
```

## 📝 Validaciones

### Nombre de Entidad
- ✅ Debe comenzar con letra
- ✅ Solo letras, números, guiones y guiones bajos
- ✅ Mínimo 2 caracteres
- ❌ No puede comenzar con número
- ❌ No puede estar vacío

### Base de Datos
- ✅ mysql, mongo, mongodb, postgres
- ❌ Otros valores generan error

## ✅ Tests Automáticos

El generador crea automáticamente una suite completa de tests unitarios:

### Fixtures (`test/helpers/{entity}-fixtures.ts`)
```typescript
export const createProductFixture = (overrides?: Partial<IProduct>): IProduct => ({
  productUuid: "test-uuid-123",
  // ... valores por defecto
  ...overrides,
});
```

### Tests de Dominio
- **Model tests**: Validación de `create`, `fromPrimitives`, `toPrimitives`, `toDatabase`, `toDTO`
- Cobertura completa de métodos del modelo

### Tests de Casos de Uso
- **CreateEntity**: Pruebas de creación exitosa y manejo de errores
- **FindEntity**: Búsqueda con paginación y casos vacíos
- **UpdateEntity**: Actualización y casos de entidad inexistente
- **DeleteEntity**: Eliminación y manejo de errores

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Tests de una entidad específica
npm test -- product

# Watch mode
npm run test:watch
```

## 🗃️ Migraciones de Base de Datos

El generador puede crear automáticamente archivos de migración listos para usar:

### MySQL/PostgreSQL - Migraciones Knex

```typescript
// migrations/20241009120000_create_products_table.ts
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("products", (table) => {
    table.string("productUuid", 36).primary().notNullable();

    // Agregar campos personalizados aquí

    table.timestamp("insDatetime").defaultTo(knex.fn.now());
    table.timestamp("updDatetime").defaultTo(knex.fn.now());
    table.timestamp("delDatetime").nullable();

    // Índices
    table.index(["productUuid"], "idx_products_uuid");
    table.index(["delDatetime"], "idx_products_deleted");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("products");
}
```

### MongoDB - Schema de Colección

```typescript
// migrations/products-collection-schema.ts
export const ProductsCollectionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["productUuid", "insDatetime", "updDatetime"],
      properties: {
        _id: { bsonType: "objectId" },
        productUuid: { bsonType: "string" },
        // Campos personalizados
        insDatetime: { bsonType: "date" },
        updDatetime: { bsonType: "date" },
        delDatetime: { bsonType: ["date", "null"] },
      },
    },
  },
};
```

### Ejecutar Migraciones

```bash
# MySQL/PostgreSQL con Knex
npx knex migrate:latest

# MongoDB (manual)
# Ver instrucciones en el archivo generado
```

## 🗑️ Comando Rollback

El generador incluye un sistema completo de rollback para revertir entidades generadas:

### Características

- ✅ **Tracking automático** - Cada entidad generada se rastrea
- ✅ **Rollback completo** - Elimina todos los archivos generados
- ✅ **Limpieza de AppContext** - Remueve imports y registros automáticos
- ✅ **Modo dry-run** - Previsualiza antes de eliminar
- ✅ **Lista de entidades** - Ve qué puedes revertir

### Comandos

```bash
# Listar entidades rastreadas
node build/rollback.js -- --list

# Preview de rollback (dry-run)
node build/rollback.js -- product --dry-run

# Rollback real
node build/rollback.js -- product

# Ver ayuda
node build/rollback.js -- --help
```

### Qué se Elimina

- ✓ Archivos de dominio, aplicación, infraestructura y API
- ✓ Tests unitarios y fixtures
- ✓ Archivos de migración
- ✓ Directorios vacíos
- ✓ Registros en AppContext (interfaces e implementaciones)
- ✓ Metadata de tracking

### Ejemplo de Uso

```bash
# Generar entidad
npm run generate -- User

# Ver entidades rastreadas
npm run generate:rollback -- --list
# Output:
# 1. user
#    Name: User
#    Database: mysql
#    Files: 21
#    Directories: 12

# Preview de rollback
npm run generate:rollback -- user --dry-run

# Ejecutar rollback
npm run generate:rollback -- user
# ✅ Rollback completed!
#    - Files deleted: 21
#    - Directories deleted: 8
```

### Tracking

Las entidades generadas se rastrean automáticamente en `.generator-tracking.json` (git-ignored). Este archivo contiene:

```json
{
  "entities": [
    {
      "entityName": "User",
      "entityKebab": "user",
      "timestamp": "2024-10-09T04:20:00.000Z",
      "database": "mysql",
      "files": ["src/entities/user/..."],
      "directories": ["src/entities/user/..."]
    }
  ]
}
```

## 🔮 Próximas Mejoras

- [x] ✅ **Soporte para PostgreSQL real** (COMPLETADO)
- [x] ✅ **Generación automática de tests unitarios** (COMPLETADO)
- [x] ✅ **Generación de migraciones de base de datos** (COMPLETADO)
- [x] ✅ **Rollback/clean de entidades generadas** (COMPLETADO)
- [ ] Permitir definir campos base al generar
- [ ] Documentación auto-generada (README por entidad)
- [ ] Documentación de API (OpenAPI/Swagger)
- [ ] Integración con git (auto-commit, auto-PR)
- [ ] Soporte para más bases de datos (SQLite, Redis como entidad)

## 🐛 Solución de Problemas

### El generador no encuentra los archivos de AppContext
```bash
# Verifica que existan estos archivos:
ls src/entities/shared/domain/app-context/app-repositories/
ls src/entities/shared/infraestructure/config/app-context/app-repositories/
```

### Error de compilación TypeScript
```bash
# Recompila el proyecto
npm run build
```

### La ruta no se registra automáticamente
Las rutas se cargan dinámicamente desde `src/api/routes-config/index.ts`. No requieren registro manual.

## 🧪 Tests del CLI

El CLI incluye una suite completa de tests unitarios:

```bash
# Ejecutar tests
npm test

# Watch mode
npm run test:watch

# Con cobertura
npm run test:coverage
```

**Cobertura:** 107 tests en 5 suites
- `string-transformers` - Transformaciones de strings (PascalCase, camelCase, kebab-case)
- `validators` - Validación de nombres y opciones
- `cli-parser` - Parsing de argumentos CLI
- `file-system` - Operaciones de archivos
- `entity-tracker` - Sistema de tracking para rollback

## 🤝 Contribuir

Para agregar nuevas features al generador:

1. Modifica los módulos en `src/utils/`
2. Actualiza `entity-generator.ts` si es necesario
3. Agrega tests unitarios en `test/`
4. Ejecuta `npm test` para verificar
5. Actualiza este README

## 📄 Licencia

ISC
