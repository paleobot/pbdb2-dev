/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

export const patchSchema = {
    body: {
		examples: [{
			reference:{pubyr:"2021" }	
		}],
	},
	response: {
		204: {
			description: 'Reference modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		},	
	}
}



const journalArticle = 	{
	if: {
		properties: {
			publication_type: { 
				const: "journal article" 
			},
		},
	},
	then: {
		properties: {
			pubtitle: {type: "string"},
			pubvol: {
				type: "string",
				maxLength: 10
			},
			pubno: {
				type: "string",
				maxLength: 10
			},
		},
		required: [
			"publication_type", 
			"pubtitle",
			"pubvol"
		]	
	},
}

const book = {
	if: {
		properties: {
			publication_type: {
				type: "string",
				enum: [
					"book",
					"serial monograph",
					"compendium",
					"Ph.D. thesis",
					"M.S. thesis",
					"guidebook"
				]
			},
		},
	},
	then: {
		properties: {
			publisher: {
				type: "string",
				maxLength: 255
			},
			pubcity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publication_type", 
			"publisher"
		]
	}
}

const chapter = {
	if: {
		properties: {
			publication_type: {
				const: "book chapter"
			},
		},
	},
	then: {
		properties: {
			pubtitle: {type: "string"},
			publisher: {
				type: "string",
				maxLength: 255
			},
			editors: {
				type: "string",
				maxLength: 255
			},
			pubcity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publication_type", 
			"pubtitle",
			"publisher",
			"editors"
		]
	},
}

const editedCollection = {
	if: {
		properties: {
			publication_type: {
				const: "book/book chapter"
			}
		}
	},
	then: {
		properties: {
			publisher: {
				type: "string",
				maxLength: 255
			},
			editors: {
				type: "string",
				maxLength: 255
			},
			pubcity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publication_type", 
			"publisher",
			"editors"
		]	
	},
}

const referenceProperties = {
	publication_type: { 
		description: `
		Fields and requirements are added based on the value of this field. Unfortunately, proper documentation of these is not automatically generated. 
			journal article: 
				pubtitle: {type: "string"}, required
				pubvol: {type: "string"}, required
				pubno: {type: "string"}, required
			book, 
			serial monograph, 
			compendium, 
			Ph.D. thesis, 
			M.S. thesis, 
			guidebook:
				publisher: {type: "string"}, required
				pubcity: {type: "string}
			book chapter:
				pubtitle: {type: "string"}, required
				publisher: {type: "string"}, required
				editors: {type: "string"}, required
				pubcity: {type: "string}
			book/book chapter:
				publisher: {type: "string"}, required
				editors: {type: "string"}, required
				pubcity: {type: "string}
		`,
		type: "string",
		enum: ["journal article","book","book chapter","book/book chapter","serial monograph","compendium","Ph.D. thesis","M.S. thesis","abstract","guidebook","news article","unpublished"]
	},
	reftitle: {type: "string"},
	author1init: {
		type: "string",
		maxLength: 10
	},
	author1last: {
		type: "string",
		maxLength: 255
	},
	author2init: {
		type: "string",
		maxLength: 10
	},
	author2last: {
		type: "string",
		maxLength: 255
	},
	otherauthors: {
		type: "string",
		maxLength: 255
	},
	pubyr: {
		type: "string",
		maxLength: 4
	},
	firstpage: {
		type: "string",
		maxLength: 10
	},
	lastpage: {
		type: "string",
		maxLength: 10
	},
	doi: {
		type: "string",
		maxLength: 80
	},
	language: {
		type: "string",
		enum: ['Chinese','English','French','German','Italian','Japanese','Portugese','Russian','Spanish','other','unknown'],
		default: "English"
	},
	comments: {type: "string"},
	upload: {
		type: "string",
		enum: ['','YES']
	},
	classification_quality: {
		type: "string",
		enum: ['authoritative','standard','compendium']
	},
	basis: {
		type: "string",
		enum: ['','stated with evidence','stated without evidence','second hand','none discussed','not entered']
	},
	project_name: {
		type: "array",
		items: {
			type: "string",
			enum: ['decapod','ETE','5%','1%','PACED','PGAP','fossil record']
		}
	}
}

export const getSchema = {
	tags:["Reference"],
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
	tags:["Reference"],
	hide: true,
    body: {
		type: 'object',
		properties: {
			reference: {
				type: "object",
				properties: referenceProperties,
				//TODO: Would like to catch these here and generate validation error. Unfortunately, fastify also sets removeAdditional by default, which quietly removes them instead. To change this, would have to move away from fastify-cli (https://github.com/fastify/fastify-cli?tab=readme-ov-file#migrating-out-of-fastify-cli-start)
				//TODO: But wait, there's more. additionalProperties only knows about properties in this direct schema. It does not know about properties in the conditional schemas. This means that if you have property_type "journal article", pubtitle, pubvol, and pub number get removed before the model gets hold of them. This might be rectified in a later version of JSON Schema (https://stackoverflow.com/a/69313287). Look into that. But for now, we can't use additionalProperties and must let the model catch unknown column names.
				//additionalProperties: false,
				unevaluatedProperties: false, //new with Draft 2019-09
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			reference:{pubyr:"2021" }	
		}],
	},
	response: {
		204: {
			description: 'Reference modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		},	
		400: {
			description: "Bad request",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
				links: {type: "array"}
			}
		}	
	}
}

export const createSchema = {
	tags:["Reference"],
	hide: true,
    body: {
		type: 'object',
		properties: {
			reference: {
				type: "object",
				properties: referenceProperties,
				//TODO: Would like to catch these here and generate validation error. Unfortunately, fastify also sets removeAdditional by default, which quietly removes them instead. To change this, would have to move away from fastify-cli (https://github.com/fastify/fastify-cli?tab=readme-ov-file#migrating-out-of-fastify-cli-start)
				//TODO: But wait, there's more. additionalProperties only knows about properties in this direct schema. It does not know about properties in the conditional schemas. This means that if you have property_type "journal article", pubtitle, pubvol, and pub number get removed before the model gets hold of them. This might be rectified in a later version of JSON Schema (https://stackoverflow.com/a/69313287). Look into that. But for now, we can't use additionalProperties and must let the model catch unknown column names.
				//additionalProperties: false,
				unevaluatedProperties: false, //new with Draft 2019-09
				required: [
					"publication_type", 
					"reftitle", 
					"author1init",
					"author1last",
					"pubyr",
					"firstpage",
				],
				allOf: [
					journalArticle,
					book,
					chapter,
					editedCollection,
				],
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			reference: {
				publication_type: "unpublished", 
				reftitle: "The reference title", 
				author1init: "D", 
				author1last: "Meredith", 
				pubyr: "2024",
				firstpage: "1", 
				pubtitle: "A publication title ", 
				pubvol:"5" 
			}
		}],
	},
	response: {
		201: {
			description: "Reference created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	collection_no: {type: "integer"}
			}
		},
		400: {
			description: "Bad request",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
				links: {type: "array"}
			}
		}	
	}
}


export const getPropertiesForPubType = (pubType, fastify) => {
	fastify.log.trace("getPropertiesForPubType")
	fastify.log.trace(pubType)
	let allProps = Object.keys(schema.body.properties.reference.properties)
	let reqProps = schema.body.properties.reference.required
	fastify.log.trace(allProps)
	fastify.log.trace(reqProps)

	switch (pubType) {
		case "journal article": 
			allProps = allProps.concat(Object.keys(journalArticle.then.properties))
			reqProps = reqProps.concat(journalArticle.then.required)
			break;
		case "book":
		case "serial monograph":
		case "compendium":
		case "Ph.D. thesis":
		case "M.S. thesis":
		case "guidebook":
			allProps = allProps.concat(Object.keys(book.then.properties))
			reqProps = reqProps.concat(book.then.required)
			break;
		case "book chapter":
			allProps = allProps.concat(Object.keys(chapter.then.properties))
			reqProps = reqProps.concat(chapter.then.required)
			break;
		case "book/book chapter":
			allProps = allProps.concat(Object.keys(editedCollection.then.properties))
			reqProps = reqProps.concat(editedCollection.then.required)
			break;
	}

	return {
		allowedProps: new Set(allProps),
		requiredProps: reqProps
	}
}



