# Guía de Plantillas

## 📋 Tipos de Plantillas Soportadas

El generador soporta dos tipos de plantillas:

1. **Plantillas de Reemplazo Simple** (compatibilidad hacia atrás)
2. **Plantillas Handlebars** (nuevas capacidades)

## 🔄 Plantillas de Reemplazo Simple

### Variables Disponibles

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `ENTITY` | Nombre en camelCase | `product` |
| `ENTITYCAPITALIZE` | Nombre en PascalCase | `Product` |
| `ENTITIES` | Plural en camelCase | `products` |
| `ENTITIESCAPITALIZE` | Plural en PascalCase | `Products` |
| `ENTITYKEBAB` | Nombre en kebab-case | `product` |

### Ejemplo

```typescript
// domain/model/entity.tpl
import { IENTITYCAPITALIZEBase } from "../interfaces/ENTITYKEBAB-base.interface";

export class ENTITYCAPITALIZE {
  constructor(
    public readonly ENTITYId?: string
  ) {}
}
```

**Resultado para "Product":**
```typescript
import { IProductBase } from "../interfaces/product-base.interface";

export class Product {
  constructor(
    public readonly productId?: string
  ) {}
}
```

## 🎨 Plantillas Handlebars

### Activación Automática

Una plantilla se procesa con Handlebars cuando contiene:
- `{{variable}}`
- `{{{variable}}}` (sin escape HTML)

### Variables Disponibles

Todas las variables de reemplazo simple están disponibles:

```handlebars
{{ENTITY}}
{{ENTITYCAPITALIZE}}
{{ENTITIES}}
{{ENTITIESCAPITALIZE}}
{{ENTITYKEBAB}}
```

### Helpers Personalizados

#### `eq` - Comparación
```handlebars
{{#if (eq database "mysql")}}
  // Código específico para MySQL
{{/if}}
```

#### `or` - Operador OR
```handlebars
{{#if (or useMysql usePostgres)}}
  // Código para bases relacionales
{{/if}}
```

#### `and` - Operador AND
```handlebars
{{#if (and hasAuth hasValidation)}}
  // Código con autenticación y validación
{{/if}}
```

### Ejemplo Completo

```handlebars
import { I{{ENTITYCAPITALIZE}}Repository } from "../domain/{{ENTITYKEBAB}}.repository";
{{#if (eq database "mysql")}}
import { MysqlConnection } from "../../shared/database/mysql";
{{else if (eq database "mongo")}}
import { MongoConnection } from "../../shared/database/mongo";
{{/if}}

export class {{ENTITYCAPITALIZE}}Repository implements I{{ENTITYCAPITALIZE}}Repository {
  constructor(
    {{#if (eq database "mysql")}}
    private readonly readDb: MysqlConnection,
    private readonly writeDb: MysqlConnection
    {{else if (eq database "mongo")}}
    private readonly connection: MongoConnection
    {{/if}}
  ) {}

  async findAll(): Promise<{{ENTITYCAPITALIZE}}[]> {
    {{#if (eq database "mysql")}}
    const result = await this.readDb.query("SELECT * FROM {{ENTITIES}}");
    return result.map(row => {{ENTITYCAPITALIZE}}.fromPrimitives(row));
    {{else if (eq database "mongo")}}
    const result = await this.connection.collection("{{ENTITIES}}").find({}).toArray();
    return result.map(doc => {{ENTITYCAPITALIZE}}.fromPrimitives(doc));
    {{/if}}
  }
}
```

## 🛠️ Crear Nuevas Plantillas

### Ubicación
```
cli-tools/generator/templates/
├── domain/
├── application/
├── infrastructure/
│   ├── mysql-repository/
│   └── mongo-repository/
└── api/
```

### Nomenclatura
- Nombre del archivo: `entity.tpl` o `entity-{tipo}.tpl`
- El sistema reemplaza `entity` por el nombre kebab-case de la entidad
- Extensión final: `.ts`

### Ejemplo de Creación

**1. Crear archivo de plantilla:**
```bash
touch cli-tools/generator/templates/domain/entity-validator.tpl
```

**2. Contenido de la plantilla:**
```typescript
import { {{ENTITYCAPITALIZE}} } from "./model/{{ENTITYKEBAB}}";

export class {{ENTITYCAPITALIZE}}Validator {
  static validate({{ENTITY}}: {{ENTITYCAPITALIZE}}): boolean {
    // Validación aquí
    return true;
  }
}
```

**3. Resultado generado:**
```
src/entities/product/domain/product-validator.ts
```

## 🎯 Mejores Prácticas

### 1. Usa Handlebars para Lógica Condicional
```handlebars
{{#if (eq database "mysql")}}
  // Código específico de MySQL
{{else}}
  // Código genérico
{{/if}}
```

### 2. Mantén Retrocompatibilidad
```typescript
// ✅ Funciona con ambos sistemas
import { ENTITYCAPITALIZE } from "./ENTITYKEBAB";

// ✅ También funciona
import { {{ENTITYCAPITALIZE}} } from "./{{ENTITYKEBAB}}";
```

### 3. Documentación en Plantillas
```typescript
/**
 * Repository para gestionar {{ENTITIESCAPITALIZE}}
 * Base de datos: {{database}}
 */
export class {{ENTITYCAPITALIZE}}Repository {
  // ...
}
```

### 4. Imports Condicionales
```handlebars
{{#if (eq database "mysql")}}
import { KnexConnection } from "../../shared/database/knex";
{{/if}}
{{#if (eq database "mongo")}}
import { MongoClient } from "mongodb";
{{/if}}
```

## 🔍 Variables de Contexto Futuras

En futuras versiones podrás usar:

```handlebars
{{#if options.includeTimestamps}}
  createdAt: Date;
  updatedAt: Date;
{{/if}}

{{#if options.includeSoftDelete}}
  deletedAt?: Date;
{{/if}}

{{#each fields}}
  {{this.name}}: {{this.type}};
{{/each}}
```

## 📚 Recursos

- [Documentación Handlebars](https://handlebarsjs.com/guide/)
- [Pluralize.js](https://www.npmjs.com/package/pluralize)

## 🐛 Debugging de Plantillas

### Ver Variables Disponibles
```handlebars
<!-- En desarrollo, agrega esto temporalmente -->
{{!-- Debug: {{ENTITY}} {{ENTITYCAPITALIZE}} {{ENTITYKEBAB}} --}}
```

### Probar con Dry-Run
```bash
npm run generate -- TestEntity --dry-run
# Revisa los archivos que se generarían
```

### Validar Sintaxis Handlebars
```javascript
// Prueba manual en Node.js
const Handlebars = require('handlebars');
const template = Handlebars.compile('{{ENTITYCAPITALIZE}}');
console.log(template({ ENTITYCAPITALIZE: 'Product' }));
```

## 💡 Tips

1. **Prueba primero con `--dry-run`**
2. **Usa nombres descriptivos en variables**
3. **Mantén las plantillas simples y legibles**
4. **Documenta lógica compleja en comentarios**
5. **Aprovecha los helpers personalizados**

## 🚀 Ejemplos Avanzados

### Plantilla con Validación Compleja
```handlebars
import { {{ENTITYCAPITALIZE}} } from "../model/{{ENTITYKEBAB}}";

export class {{ENTITYCAPITALIZE}}Validator {
  {{#if (eq database "mysql")}}
  private static readonly MAX_LENGTH = 255;
  {{else if (eq database "mongo")}}
  private static readonly MAX_LENGTH = 1000;
  {{/if}}

  static validate(data: Partial<{{ENTITYCAPITALIZE}}>): boolean {
    {{#if includeTimestamps}}
    if (!data.createdAt) return false;
    {{/if}}
    return true;
  }
}
```

### Plantilla con Múltiples Helpers
```handlebars
{{#if (and (eq database "mysql") includeCache)}}
import { RedisCache } from "../../shared/cache";
{{/if}}

export class {{ENTITYCAPITALIZE}}Service {
  {{#if (or (eq database "mysql") (eq database "postgres"))}}
  // Servicio para base de datos SQL
  {{else}}
  // Servicio para base de datos NoSQL
  {{/if}}
}
```
