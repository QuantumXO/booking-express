import fs from 'fs';
import path from 'path';
import { swaggerSpec } from './swagger';
import { createPostmanOpenApiSpec } from './postman-openapi';

const outputDir = path.resolve(process.cwd(), 'openapi');
const outputFile = path.join(outputDir, 'openapi.json');
const postmanOutputFile = path.join(outputDir, 'postman-openapi.json');
const postmanOpenApiSpec = createPostmanOpenApiSpec(swaggerSpec);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2), 'utf-8');
fs.writeFileSync(postmanOutputFile, JSON.stringify(postmanOpenApiSpec, null, 2), 'utf-8');

console.log(`OpenAPI specs generated: ${outputFile}, ${postmanOutputFile}`);
