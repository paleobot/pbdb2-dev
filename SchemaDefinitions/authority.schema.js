/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

export const authoritySchema = {
    $schema: "https://json-schema.org/draft/2019-09/schema",
    $id: "https://pbdb2.example.com/schemas/authority.json",
    title: "Authority",
    description: "An authority payload in the PBDB database",
    type: "object",
    unevaluatedProperties: false, //new with Draft 2019-09
    properties: {
        authority: {
            type: "object",
            unevaluatedProperties: false, //new with Draft 2019-09
            required: [
                "parenthetical_citation",
            ],
            properties: {
                legacyIDs: {
                    type: "object",
                    properties: {
                        oldpbdbID: {
                            type: "string",
                            description: "Legacy ID for authorities migrated from old PBDB"
                        },
                    }
                },
                parenthetical_citation: {
                    type: "string"
                },
                authors: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties: {
                            familyName: {type: "string"},
                            givenName: {type: "string"}
                        }
                    }
                },
                year: {
                    type: "string",
                    maxLength: 4
                },
            }
        }
    }
}
