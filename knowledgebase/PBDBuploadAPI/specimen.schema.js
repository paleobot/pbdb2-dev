/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const specimenProperties = {
	occurrence_no: {type: "integer"},	
	taxon_no: {type: "integer"},	
	reference_no: {type: "integer"},	
	specimen_id: {
		type: "string",
		maxLength: 80
	},
	specimens_measured: {type: "number"},	
	specimen_coverage: {
		type: "string",
		enum: ['all', 'some'],
	},
	specelt_no: {type: "integer"},
	specimen_side: {
		type: "string",
		enum: ['left','right','left?','right?','upper','lower','upper left','upper right','lower left','lower right','dorsal','ventral','both']
	},
	sex: {
		type: "string",
		enum: ['female','male','both']
	},
	specimen_part: {
		type: "string",
		maxLength: 80
	},
	measurement_source: {
		type: "string",
		enum: ['text','table','picture','graph','direct']
	},
	magnification: {
		type: "string",
		maxLength: 7
	},
	is_type: {
		type: "string",
		enum: ['holotype','paratype','some paratypes']
	},
	comments: {type: "string"}
}

export const getSchema = {
	tags:["Specimen"],
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
	tags:["Specimen"],
    body: {
		type: "object",
		properties: {
			specimen: {
				type: "object",
				properties: specimenProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			specimen: {
				plant_organ: "leaf"
			}		
		}],
	},
	response: {
		204: {
			description: 'Specimen modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		  },	
	}
}

export const createSchema = {
	tags:["Specimen"],
    body: {
		type: "object",
		properties: {
			specimen: {
				type: "object",
				properties: specimenProperties,
				additionalProperties: false,
				required: [
					"occurrence_no",
					"taxon_no",
					"reference_no",
                ],
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			specimen:{
			}
		}],
	},
	response: {
		201: {
			description: "Specimen created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	specimen_no: {type: "integer"}
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