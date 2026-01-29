/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const reidentificationProperties = {
	occurrence_no: {type: "integer"},
	collection_no: {type: "integer"},	
	//taxon_no: {type: "integer"},	
	taxon_name: {type: "string"},	
	most_recent: {
		type: "string",
		enum: ['YES','NO']
	},	
	genus_reso: {
		//description: "Required if taxon_no is for a genus",
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. gen.','sensu lato','?','"','informal'],
	},
	genus_name: {
		type: "string",
		maxLength: 255
	},
	subgenus_reso: {
		//description: "Required if taxon_no is for a subgenus",
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. subgen.','sensu lato','?','"','informal'],
	},
	subgenus_name: {
		type: "string",
		maxLength: 255
	},
	species_reso: {
		//description: "Required if taxon_no is for a species",
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. sp.','sensu lato','?','"','informal'],
	},
	species_name: {
		type: "string",
		maxLength: 255
	},
	subspecies_reso: {
		//description: "Required if taxon_no is for a subspecies",
		type: "string",
		enum: ['','aff.','cf.','ex gr.','n. sp.','sensu lato','?','"','informal'],
	},
	subspecies_name: {
		type: "string",
		maxLength: 255
	},
	reference_no: {type: "integer"},	
	comments: {type: "string"},	
	plant_organ: {
		type: "string",
		enum: ['','unassigned','leaf','seed/fruit','axis','plant debris','marine palyn','microspore','megaspore','flower','seed repro','non-seed repro','wood','sterile axis','fertile axis','root','cuticle','multi organs'],
	},
}

export const getSchema = {
	tags:["Reidentification"],
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
	tags:["Reidentification"],
    body: {
		type: "object",
		properties: {
			reidentification: {
				type: "object",
				properties: reidentificationProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			reidentification: {
				plant_organ: "leaf"
			}		
		}],
	},
	response: {
		204: {
			description: 'Reidentification modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		  },	
	}
}

export const createSchema = {
	tags:["Reidentification"],
    body: {
		type: "object",
		properties: {
			reidentification: {
				type: "object",
				properties: reidentificationProperties,
				additionalProperties: false,
				required: [
					"occurrence_no",
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
			}
      	},
		examples: [{
			reidentification:{
			}
		}],
	},
	response: {
		201: {
			description: "Reidentification created",
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