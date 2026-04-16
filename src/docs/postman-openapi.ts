import type { OpenAPIObject, OperationObject, PathItemObject, ResponsesObject } from 'openapi3-ts/oas31';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as const;

type HttpMethod = (typeof HTTP_METHODS)[number];

function pickPreferredResponse(responses?: ResponsesObject): ResponsesObject | undefined {
  if (!responses) {
    return responses;
  }

  const responseEntries = Object.entries(responses).filter(([statusCode]) => !statusCode.startsWith('x-'));

  if (responseEntries.length === 0) {
    return responses;
  }

  const successEntry = responseEntries
    .filter(([statusCode]) => /^\d+$/.test(statusCode) && Number(statusCode) >= 200 && Number(statusCode) < 300)
    .sort(([leftStatusCode], [rightStatusCode]) => Number(leftStatusCode) - Number(rightStatusCode))[0];

  const preferredEntry = successEntry ?? responseEntries.find(([statusCode]) => statusCode === 'default') ?? responseEntries[0];

  return preferredEntry
    ? {
        [preferredEntry[0]]: preferredEntry[1],
      }
    : responses;
}

function transformOperation(operation?: OperationObject): OperationObject | undefined {
  if (!operation) {
    return operation;
  }

  return {
    ...operation,
    responses: pickPreferredResponse(operation.responses),
  };
}

function transformPathItem(pathItem: PathItemObject): PathItemObject {
  const transformedPathItem: PathItemObject = { ...pathItem };

  for (const method of HTTP_METHODS) {
    transformedPathItem[method as HttpMethod] = transformOperation(pathItem[method as HttpMethod]);
  }

  return transformedPathItem;
}

export function createPostmanOpenApiSpec(document: OpenAPIObject): OpenAPIObject {
  const clonedDocument = JSON.parse(JSON.stringify(document)) as OpenAPIObject;

  if (!clonedDocument.paths) {
    return clonedDocument;
  }

  const transformedPaths = Object.fromEntries(
    Object.entries(clonedDocument.paths).map(([path, pathItem]) => [path, transformPathItem(pathItem)])
  );

  return {
    ...clonedDocument,
    paths: transformedPaths,
  };
}
