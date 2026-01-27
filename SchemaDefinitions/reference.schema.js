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
			publicationType: { 
				const: "journal article" 
			},
		},
	},
	then: {
		properties: {
			publicationTitle: {type: "string"},
			publicationVolume: {
				type: "string",
				maxLength: 10
			},
			publicationNumber: {
				type: "string",
				maxLength: 10
			},
		},
		required: [
			"publicationType", 
			"publicationTitle",
			"publicationVolume"
		]	
	},
}

const book = {
	if: {
		properties: {
			publicationType: {
				const: "book" 
			},
			bookType: {
				type: "string",
				enum: [
					"monograph",
					"serial monograph", //Does this deserve its own publicationType with a volume property?
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
			publicationCity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publicationType", 
			"publisher"
		]
	}
}

const chapter = {
	if: {
		properties: {
			publicationType: {
				const: "chapter"
			},
		},
	},
	then: {
		properties: {
			publicationTitle: {type: "string"},
			publisher: {
				type: "string",
				maxLength: 255
			},
			editors: {
				type: "string",
				maxLength: 255
			},
			publicationCity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publicationType", 
			"publicationTitle",
			"publisher",
			"editors"
		]
	},
}

const editedCollection = {
	if: {
		properties: {
			publicationType: {
				const: "edited collection"
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
			publicationCity: {
				type: "string",
				maxLength: 80
			}
		},
		required: [
			"publicationType", 
			"publisher",
			"editors"
		]	
	},
}

const referenceProperties = {
	publicationType: { 
		description: `
		Fields and requirements are added based on the value of this field. Unfortunately, proper documentation of these is not automatically generated. 
			journal article: 
				publicationTitle: {type: "string"}, required
				publicationVolume: {type: "string"}, required
				publicationNumber: {type: "string"}, required
			book:
				bookType: {
					type: "string",
					enum: ["monograph", "serial monograph","compendium","Ph.D. thesis","M.S. thesis","abstract","guidebook"]
				}
				publisher: {type: "string"}, required
				publicationCity: {type: "string}
			chapter:
				publicationTitle: {type: "string"}, required
				publisher: {type: "string"}, required
				editors: {type: "string"}, required
				publicationCity: {type: "string}
			edited collection:
				publisher: {type: "string"}, required
				editors: {type: "string"}, required
				publicationCity: {type: "string}
		`,
		type: "string",
		enum: ["journal article","book","chapter","edited collection","unpublished"]
	},
	pbdb2ID: {
		type: "string",
		description: "Unique identifier for the reference"
	},
	oldpbdbID: {
		type: "string",
		description: "Historic identifier for the reference in the old PBDB database"
	},
	title: {type: "string"},
	authors: {
		type: "array"
	}
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
	publicationYear: {
		type: "string",
		maxLength: 4
	},
	firstPage: {
		type: "string",
		maxLength: 10
	},
	lastPage: {
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
	classificationQuality: {
		type: "string",
		enum: ['authoritative','standard','compendium']
	},
	basis: {
		type: "string",
		enum: ['','stated with evidence','stated without evidence','second hand','none discussed','not entered']
	},
	projectName: {
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
				//TODO: But wait, there's more. additionalProperties only knows about properties in this direct schema. It does not know about properties in the conditional schemas. This means that if you have property_type "journal article", publicationTitle, publicationVolume, and pub number get removed before the model gets hold of them. This might be rectified in a later version of JSON Schema (https://stackoverflow.com/a/69313287). Look into that. But for now, we can't use additionalProperties and must let the model catch unknown column names.
				//additionalProperties: false,
				unevaluatedProperties: false, //new with Draft 2019-09
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			reference:{publicationYear:"2021" }	
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
				//TODO: But wait, there's more. additionalProperties only knows about properties in this direct schema. It does not know about properties in the conditional schemas. This means that if you have property_type "journal article", publicationTitle, publicationVolume, and pub number get removed before the model gets hold of them. This might be rectified in a later version of JSON Schema (https://stackoverflow.com/a/69313287). Look into that. But for now, we can't use additionalProperties and must let the model catch unknown column names.
				//additionalProperties: false,
				unevaluatedProperties: false, //new with Draft 2019-09
				required: [
					"publicationType", 
					"title", 
					"author1init",
					"author1last",
					"publicationYear",
					"firstPage",
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
				publicationType: "unpublished", 
				title: "The reference title", 
				author1init: "D", 
				author1last: "Meredith", 
				publicationYear: "2024",
				firstPage: "1", 
				publicationTitle: "A publication title ", 
				publicationVolume:"5" 
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



