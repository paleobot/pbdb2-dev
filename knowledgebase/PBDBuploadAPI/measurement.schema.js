/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const measurementProperties = {
	//measurement_no: {type: "integer"},	
	specimen_no: {type: "integer"},	
	position: {
		type: "string",
		enum: ['greatest','least','anterior','anteroposterior','distal','mediolateral','midshaft','posterior','proximal','transverse','basal','condylobasal','condyloincisive','orbital','quadrate','zygomatic']
	},	
	measurement_type: {
		type: "string",
		enum: ['length','width','height','circumference','diagonal','diameter','inflation','mass','d13C','d18O']
	},	
	average: {type: "number"},	
	median: {type: "number"},	
	min: {type: "number"},	
	max: {type: "number"},	
	error: {type: "number"},	
	error_unit: {
		type: "string",
		enum: ['1 s.d.','2 s.d.','95% CI']
	}	
}

export const getSchema = {
	tags:["Measurement"],
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
	tags:["Measurement"],
    body: {
		type: "object",
		properties: {
			measurement: {
				type: "object",
				properties: measurementProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			measurement: {
				average: 42.0
			}		
		}],
	},
	response: {
		204: {
			description: 'Measurement modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		  },	
	}
}

export const createSchema = {
	tags:["Measurement"],
    body: {
		type: "object",
		properties: {
			measurement: {
				type: "object",
				properties: measurementProperties,
				additionalProperties: false,
				required: [
					"specimen_no",
					"measurement_type",
                ],
				anyOf: [
					{required: ["average"]},
					{required: ["median"]},
					{required: ["min"]},
					{required: ["max"]},
				],
				dependentRequired: {
					error: ["error_unit"],
				},
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			measurement:{
			}
		}],
	},
	response: {
		201: {
			description: "Measurement created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	measurement_no: {type: "integer"}
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