/**
 * Parsed JSON Schema for Collection data in PBOT
 * 
 * Note: Some enum values (timescale, lithology, environment, intervals, preservationModes)
 * are dynamically loaded from external APIs or the database and are represented as strings.
 */

const collectionSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://pbdb2.example.com/schemas/collection.json",
    title: "Collection",
    description: "A collection entry in the PBOT database",
    type: "object",
    required: [
        "name",
        "collectionType",
        "timescale",
        "maxinterval",
        "lat",
        "lon",
        "gpsCoordinateUncertainty",
        "country",
        "protectedSite",
        "lithology",
        "preservationModes",
        "references"
    ],
    properties: {
        pbotID: {
            type: "string",
            description: "Legacy ID for collections migrated from PBot"
        },
        name: {
            type: "string",
            description: "Name of the collection"
        },
        collectionType: {
            type: "string",
            enum: [
                "archaeologic",
                "biostratigraphic",
                "paleoecologic",
                "taphonomic",
                "taxonomic",
                "general faunal/floral"
            ],
            description: "Type of collection"
        },
        timescale: {
            type: "string",
            description: "Timescale identifier (fetched from Macrostrat API)"
        },
        maxinterval: {
            type: "string",
            description: "Maximum interval name (fetched from Macrostrat API based on timescale)"
        },
        mininterval: {
            type: "string",
            description: "Minimum interval name (fetched from Macrostrat API based on timescale)"
        },
        location: {
            type: "object",
            required: ["latitude", "longitude"],
            properties: {
                latitude: {
                    type: "number",
                    minimum: -90,
                    maximum: 90,
                    description: "Latitude coordinate"
                },
                longitude: {
                    type: "number",
                    minimum: -180,
                    maximum: 180,
                    description: "Longitude coordinate"
                }
            },
            description: "Geographic location of the collection"
        },
        gpsCoordinateUncertainty: {
            type: "integer",
            minimum: 1,
            description: "GPS coordinate uncertainty in meters"
        },
        geographicResolution: {
            type: "string",
            enum: [
                "hand sample",
                "small collection (<10x10m)",
                "outcrop (<1x1km)",
                "local area (<100x100km)",
                "basin"
            ],
            description: "Scale of geographic resolution"
        },
        geographicComments: {
            type: "string",
            description: "Notes on geographic information"
        },
        country: {
            type: "string",
            description: "Country code (ISO 3166-1 alpha-2)"
        },
        state: {
            type: "string",
            description: "State/province code"
        },
        protectedSite: {
            type: "boolean",
            description: "Whether the site is protected"
        },
        directDate: {
            type: "number",
            description: "Direct date value"
        },
        directDateError: {
            type: "number",
            description: "Direct date error margin"
        },
        directDateType: {
            type: "string",
            enum: ["Ma", "Ka", "YBP"],
            description: "Direct date type/units"
        },
        numericAgeMin: {
            type: "number",
            description: "Minimum numeric age"
        },
        numericAgeMinError: {
            type: "number",
            description: "Minimum numeric age error margin"
        },
        numericAgeMinType: {
            type: "string",
            enum: ["Ma", "Ka", "YBP"],
            description: "Minimum numeric age type/units"
        },
        numericAgeMax: {
            type: "number",
            description: "Maximum numeric age"
        },
        numericAgeMaxError: {
            type: "number",
            description: "Maximum numeric age error margin"
        },
        numericAgeMaxType: {
            type: "string",
            enum: ["Ma", "Ka", "YBP"],
            description: "Maximum numeric age type/units"
        },
        ageComments: {
            type: "string",
            description: "Notes on age"
        },
        lithology: {
            type: "string",
            description: "Primary lithology (fetched from Macrostrat API)"
        },
        additionalLithology: {
            type: "string",
            description: "Additional description of lithology"
        },
        stratigraphicGroup: {
            type: "string",
            description: "Stratigraphic group name"
        },
        stratigraphicFormation: {
            type: "string",
            description: "Stratigraphic formation name"
        },
        stratigraphicMember: {
            type: "string",
            description: "Stratigraphic member name"
        },
        stratigraphicBed: {
            type: "string",
            description: "Stratigraphic bed name"
        },
        stratigraphicComments: {
            type: "string",
            description: "Notes on stratigraphy"
        },
        environment: {
            type: "string",
            description: "Environment (fetched from Macrostrat API)"
        },
        environmentComments: {
            type: "string",
            description: "Notes on environment"
        },
        preservationModes: {
            type: "array",
            items: {
                type: "string",
                description: "Preservation mode ID (fetched from database)"
            },
            minItems: 1,
            description: "List of preservation mode IDs"
        },
        collectors: {
            type: "string",
            description: "Names of collectors"
        },
        collectionMethods: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "bulk",
                    "sieve",
                    "core",
                    "quarrying",
                    "surface (float)",
                    "surface (in situ)",
                    "salvage",
                    "anthill"
                ]
            },
            description: "Methods used for collection"
        },
        collectingComments: {
            type: "string",
            description: "Notes on collection methods"
        },
        sizeClasses: {
            type: "array",
            items: {
                type: "string",
                enum: [
                    "> 10 mm",
                    "1 - 10 mm",
                    "< 1 mm"
                ]
            },
            description: "Size classes of specimens in collection"
        },
        pbdbid: {
            type: "string",
            description: "Legacy Paleobiology Database identifier"
        },
        references: {
            type: "array",
            items: {
                type: "object",
                required: ["order"],
                properties: {
                    referenceID: {
                        type: "string",
                        description: "Reference unique identifier"
                    },
                    order: {
                        type: "string",
                        description: "Order of the reference"
                    }
                }
            },
            minItems: 1,
            description: "List of references for this collection"
        },
        public: {
            type: "boolean",
            description: "Whether the collection is publicly visible",
            default: true
        },
        groups: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Groups this collection belongs to"
        },
        cascade: {
            type: "boolean",
            description: "Whether to cascade delete related entities",
            default: false
        }
    },
    allOf: [
        {
            if: {
                properties: {
                    public: {
                        const: false
                    }
                },
                required: ["public"]
            },
            then: {
                properties: {
                    groups: {
                        minItems: 1
                    }
                }
            }
        }
    ]
};

export default collectionSchema;
