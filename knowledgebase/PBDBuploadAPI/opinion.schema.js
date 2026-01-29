/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const currentYear = new Date(Date.now()).getFullYear();

const opinionProperties = {
	reference_no: {type: "integer"},
	child_no: {type: "integer"},	
	//child_spelling_no: {type: "integer"},
	/*
	status_old: {
		type: "string",
		enum: ['belongs to','recombined as','subjective synonym of','objective synonym of','homonym of','replaced by','corrected as','rank changed as','nomen dubium','nomen nudum','nomen oblitum','nomen vanum','revalidated']
	},
	*/
	status: {
		type: "string",
		enum: ['belongs to','subjective synonym of','objective synonym of','invalid subgroup of','misspelling of','replaced by','nomen dubium','nomen nudum','nomen oblitum','nomen vanum']
	},	
	basis: {
		type: "string",
		enum: ['','stated with evidence','stated without evidence','implied','second hand'],
		default: 'stated with evidence'
	},	
	phylogenetic_status: {
		type: "string",
		enum: ['','monophyletic','paraphyletic','polyphyletic','unknown']
	},	
	spelling_reason: {
		type: "string",
		enum: ['original spelling','recombination','reassignment','correction','rank change','misspelling']
	},	
	diagnosis: {type: "string"},
	diagnosis_given: {
		type: "string",
		enum: ['','none','new','emended','repeated']
	},	
	parent_no: {type: "integer"},	
	//parent_spelling_no: {type: "integer"},
	ref_has_opinion: {
		type: "string",
		maxLength: 4,
		default: "YES"
	},	
	author1init: {
		type: "string",
		pattern: "^[a-z]|[A-Z]\\.? ?[a-z]|[A-Z]?\\.?$", //TODO: Pattern needs work. See Validaiton.pm, line 143, also: not using p{L} here so help page works		
		maxLength: 10
	},	
	author1last: {
		type: "string",
		maxLength: 80
	},
	author2init: {
		type: "string",
		pattern: "^[a-z]|[A-Z]\\.? ?[a-z]|[A-Z]?\\.?$", //TODO: Pattern needs work. See Validaiton.pm, line 143, also: not using p{L} here so help page works		
		maxLength: 10
	},	
	author2last: {
		type: "string",
		maxLength: 80
	},	
	otherauthors: {
		type: "string",
		maxLength: 255
	},	
	pubyr: {
		type: "integer", //This is a string in db. We will lean on auto type conversion
		minimum: 1700,
		maximum: currentYear
	},	
	pages: {
		type: "string",
		maxLength: 40
	},
	figures: {
		type: "string",
		maxLength: 100
	},	
	classification_quality: {
		type: "string",
		enum: ['','authoritative','implied','standard','second hand']
	},	
	max_interval_no: {type: "integer"},
	min_interval_no: {type: "integer"},
	first_occurrence: {
		type: "string",
		maxLength: 255
	},
	last_occurrence: {
		type: "string",
		maxLength: 255
	},	
	comments:  {type: "string"},	
	upload: {
		type: "string",
		enum: ['','YES']
	},	
}

export const getSchema = {
	tags:["Opinion"],
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
	tags:["Opinion"],
    body: {
		type: "object",
		properties: {
			opinion: {
				type: "object",
				properties: opinionProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			},
			allowMigrations: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			opinion: {
			}		
		}],
	},
	response: {
		204: {
			description: 'Opinion modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
				warnings: {
					type: "array",
					items: {
						type: "object",
						properties: {
							message: {
								type: "string"
							},
							data: {
								type: "object"
							}
						}
					}
				}
			}
		  },	
	}
}

export const createSchema = {
	tags:["Opinion"],
    body: {
		type: "object",
		properties: {
			opinion: {
				type: "object",
				properties: opinionProperties,
				additionalProperties: false,
				required: [
					"reference_no",
					"child_no",
					"parent_no",
					"status",
					"spelling_reason",
                ],
				dependentRequired: {
					otherauthors: ["author2last"],
					author2last: ["author1last"],
				},
				if: {
					properties: {
						ref_has_opinion: {
							const: 'YES'
						}
					},
				},
				then: {
				},
				else: {
					required: [
						"author1last",
						"pubyr",
					]
				},
				/*
				if: {
					properties: {
					  	status: { const: "misspelling of" }
					}
				},
				then: {
					required: [
					  "child_spelling_no",
					]
				},
				*/
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			},
			allowMigrations: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			opinion:{
			}
		}],
	},
	response: {
		201: {
			description: "Opinion created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	opinion_no: {type: "integer"},
				warnings: {
					type: "array",
					items: {
						type: "object",
						properties: {
							message: {
								type: "string"
							},
							data: {
								type: "object"
							}
						}
					}
				}
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