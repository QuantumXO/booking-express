import fs from 'fs';
import path from 'path';
import { swaggerSpec } from './swagger';

const outputDir = path.resolve(process.cwd(), 'openapi');
const outputFile = path.join(outputDir, 'openapi.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2), 'utf-8');

console.log(`OpenAPI spec generated: ${outputFile}`);
