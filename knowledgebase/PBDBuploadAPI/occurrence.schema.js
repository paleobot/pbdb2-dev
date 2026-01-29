/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const occurrenceProperties = {
	collection_no: {type: "integer"},	
	taxon_name: {type: "string"},
	genus_reso: {
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. gen.','sensu lato','?','"','informal'],
	},
	genus_name: {
		type: "string",
		maxLength: 255
	},
	subgenus_reso: {
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. subgen.','sensu lato','?','"','informal'],
	},
	subgenus_name: {
		type: "string",
		maxLength: 255
	},
	species_reso: {
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. sp.','sensu lato','?','"','informal'],
	},
	species_name: {
		type: "string",
		maxLength: 255
	},
	subspecies_reso: {
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. sp.','sensu lato','?','"','informal'],
	},
	subspecies_name: {
		type: "string",
		maxLength: 255
	},
	abund_value: {
		type: "string",
		maxLength: 255
	},	
	abund_unit: {
		description: "Required if abund_value is populated",
		type: "string"
	},	
	reference_no: {type: "integer"},	
	comments: {type: "string"},	
	upload: {
		type: "string",
		enum: ['','YES'],
	},
	plant_organ: {
		type: "string",
		enum: ['','unassigned','leaf','seed/fruit','axis','plant debris','marine palyn','microspore','megaspore','flower','seed repro','non-seed repro','wood','sterile axis','fertile axis','root','cuticle','multi organs'],
	},
	plant_organ2: {
		type: "string",
		enum: ['','unassigned','leaf','seed/fruit','axis','plant debris','marine palyn','microspore','megaspore','flower','seed repro','non-seed repro','wood','sterile axis','fertile axis','root','cuticle'],
	},
}

export const getSchema = {
	tags:["Occurrence"],
	hide: true,
	response: {
		501: {
			description: 'Not implemented',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"} 
			}
		  },	
	}

}

export const editSchema = {
	tags:["Occurrence"],
    body: {
		type: "object",
		properties: {
			occurrence: {
				type: "object",
				properties: occurrenceProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			},
			bypassTaxon: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			occurrence: {
				plant_organ: "leaf"
			}		
		}],
	},
	response: {
		204: {
			description: 'Occurrence modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		  },	
	}
}

export const createSchema = {
	tags:["Occurrence"],
    body: {
		type: "object",
		properties: {
			occurrence: {
				type: "object",
				properties: occurrenceProperties,
				additionalProperties: false,
				required: [
					"collection_no",
					"reference_no",
                ],
				oneOf: [{
					required: [
						"genus_name"
					]
				}, {
					required: [
						"taxon_name"
					]
				}],
				dependentRequired: {
					subgenus_name: ["genus_name"],
					species_name: ["genus_name"],
					subspecies_name: ["species_name", "genus_name"],
					abund_value: ["abund_unit"]
				}
				
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			},
			bypassTaxon: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			occurrence:{
			}
		}],
	},
	response: {
		201: {
			description: "Occurrence created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	occurrence_no: {type: "integer"}
			}
		},
		400: {
			description: "Bad request",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		}	
	}
}