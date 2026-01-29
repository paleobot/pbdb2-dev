/*
Validation schemas in JSON Schema format. Note that fastify uses ajv (https://ajv.js.org/) for validation, which expects the schemas to be javascript objects rather than raw JSON. Consequently, property names (keys) do not require double quotes.
*/

const ecotaphProperties = {
	reference_no: {type: "integer"},	
	taxon_no: {type: "integer"},	
	composition1: {
		type: "string",
		enum: ['','aragonite','"calcite"','high Mg calcite','intermediate Mg calcite','low Mg calcite','hydroxyapatite','phosphatic','calcified cartilage','silica','agglutinated','chitin','lignin','"sclero-protein"','cutan/cutin','other','no hard parts']
	},	
	composition2: {
		type: "string",
		enum: ['','aragonite','"calcite"','high Mg calcite','intermediate Mg calcite','low Mg calcite','hydroxyapatite','phosphatic','calcified cartilage','silica','agglutinated','chitin','lignin','"sclero-protein"','cutan/cutin','other']	
	},
	entire_body: {
		type: "string",
		enum: ['','yes']
	},	
	body_part: {
		type: "string",
		maxLength: 40
	},	
	adult_length: {
		type: "string",
		enum: ['','< 0.0001','0.0001 to 0.001','0.001 to 0.01','0.01 to 0.1','0.1 to < 1.0','1.0 to < 10','10 to < 100','100 to < 1000','1000 to < 10^4','10^4 to < 10^5','10^5 to < 10^6','10^6 to < 10^7','10^7 to < 10^8','10^8 to < 10^9','10^9 to < 10^10','10^10 to < 10^11','10^11 or more']
	},	
	adult_width: {
		type: "string",
		enum: ['','< 0.0001','0.0001 to 0.001','0.001 to 0.01','0.01 to 0.1','0.1 to < 1.0','1.0 to < 10','10 to < 100','100 to < 1000','1000 to < 10^4','10^4 to < 10^5','10^5 to < 10^6','10^6 to < 10^7','10^7 to < 10^8','10^8 to < 10^9','10^9 to < 10^10','10^10 to < 10^11','10^11 or more']
	},	
	adult_height: {
		type: "string",
		enum: ['','< 0.0001','0.0001 to 0.001','0.001 to 0.01','0.01 to 0.1','0.1 to < 1.0','1.0 to < 10','10 to < 100','100 to < 1000','1000 to < 10^4','10^4 to < 10^5','10^5 to < 10^6','10^6 to < 10^7','10^7 to < 10^8','10^8 to < 10^9','10^9 to < 10^10','10^10 to < 10^11','10^11 or more']
	},	
	adult_area: {
		type: "string",
		enum: ['','< 0.0001','0.0001 to 0.001','0.001 to 0.01','0.01 to 0.1','0.1 to < 1.0','1.0 to < 10','10 to < 100','100 to < 1000','1000 to < 10^4','10^4 to < 10^5','10^5 to < 10^6','10^6 to < 10^7','10^7 to < 10^8','10^8 to < 10^9','10^9 to < 10^10','10^10 to < 10^11','10^11 or more']
	},	
	adult_volume: {
		type: "string",
		enum: ['','< 0.0001','0.0001 to 0.001','0.001 to 0.01','0.01 to 0.1','0.1 to < 1.0','1.0 to < 10','10 to < 100','100 to < 1000','1000 to < 10^4','10^4 to < 10^5','10^5 to < 10^6','10^6 to < 10^7','10^7 to < 10^8','10^8 to < 10^9','10^9 to < 10^10','10^10 to < 10^11','10^11 or more']
	},	
	old_maximum_body_mass: {
		type: "string",
		enum: ['','1 g','3 g','10 g','30 g','100 g','300 g','1 kg','3 kg','10 kg','30 kg','100 kg','300 kg','1000 kg','3000 kg','10000 kg','30000 kg','100000 kg']
	},	
	old_minimum_body_mass: {
		type: "string",
		enum: ['','1 g','3 g','10 g','30 g','100 g','300 g','1 kg','3 kg','10 kg','30 kg','100 kg','300 kg','1000 kg','3000 kg','10000 kg','30000 kg','100000 kg']
	},	
	maximum_body_mass: {type: "number"},	
	minimum_body_mass: {type: "number"},	
	body_mass_estimate: {type: "number"},	
	body_mass_type: {
		type: "string",
		enum: ['quantitative','qualitative','unknown']
	},	
	body_mass_source: {
		type: "string",
		enum: ['published','unpublished']
	},	
	body_mass_comment: {type: "string"},
	thickness: {
		type: "string",
		enum: ['','thin','intermediate','thick']
	},	
	architecture: {
		type: "string",
		enum: ['','porous','compact or dense']
	},	
	form: {
		type: "string",
		enum: ['','sheet','blade','inflated sheet','inflated blade','roller-shaped','spherical']
	},	
	reinforcement: {
		type: "string",
		enum: ['','no']
	},	
	folds: {
		type: "string",
		enum: ['','none','minor','major']
	},	
	ribbing: {
		type: "string",
		enum: ['','none','minor','major']
	},	
	spines: {
		type: "string",
		enum: ['','none','minor','major']
	},	
	internal_reinforcement: {
		type: "string",
		enum: ['','none','minor','major']
	},	
	polymorph: {
		type: "string",
		enum: ['','yes']
	},	
	ontogeny: {
		type: "array",
		items: {
			type: "string",
			enum: ['','accretion','molting','addition of parts','modification of parts','replacement of parts']
		}
	},	
	grouping: {
		type: "string",
		enum: ['','colonial','gregarious','solitary']
	},	
	clonal: {
		type: "string",
		enum: ['','yes']
	},	
	taxon_environment: {
		type: "array",
		items: {
			type: "string",
			enum: ['','lagoonal','coastal','inner shelf','outer shelf','oceanic','oligotrophic','mesotrophic','eutrophic','hypersaline','marine','brackish','freshwater','terrestrial']
		}
	},	
	locomotion: {
		type: "string",
		enum: ['','stationary','facultatively mobile','passively mobile','actively mobile','fast-moving','slow-moving']
	},	
	attached: {
		type: "string",
		enum: ['','yes']
	},	
	epibiont: {
		type: "string",
		enum: ['','yes']
	},	
	life_habit: {
		type: "string",
		enum: ['','boring','infaunal','shallow infaunal','deep infaunal','semi-infaunal','epifaunal','low-level epifaunal','intermediate-level epifaunal','upper-level epifaunal','nektobenthic','nektonic','planktonic','fossorial','semifossorial','ground dwelling','cursorial','saltatorial','scansorial','arboreal','gliding','volant','amphibious','herbaceous','arborescent','aquatic']
	},	
	depth_habitat: {
		type: "string",
		enum: ['','surface','thermocline','subthermocline','deep']
	},	
	diet1: {
		type: "string",
		enum: ['','chemoautotroph','"photoautotroph"','C3 autotroph','C4 autotroph','CAM autotroph','chemosymbiotic','photosymbiotic','herbivore','frugivore','folivore','browser','grazer','granivore','omnivore','insectivore','carnivore','microcarnivore','piscivore','durophage','parasite','suspension feeder','osmotroph','deposit feeder','detritivore','saprophage','coprophage']
	},	
	diet2: {
		type: "string",
		enum: ['','chemoautotroph','"photoautotroph"','C3 autotroph','C4 autotroph','CAM autotroph','chemosymbiotic','photosymbiotic','herbivore','frugivore','folivore','browser','grazer','granivore','omnivore','insectivore','carnivore','microcarnivore','piscivore','durophage','parasite','suspension feeder','osmotroph','deposit feeder','detritivore','saprophage','coprophage']
	},	
	vision: {
		type: "string",
		enum: ['','blind','limited','well-developed']
	},	
	reproduction: {
		type: "string",
		enum: ['','oviparous','ovoviviparous','viviparous','alternating','homosporous','heterosporous','seeds','fruits']
	},	
	asexual: {
		type: "string",
		enum: ['','yes']
	},	
	brooding: {
		type: "string",
		enum: ['','yes']
	},	
	dispersal1: {
		type: "string",
		enum: ['','direct/internal','water','wind','animal']
	},	
	dispersal2: {
		type: "string",
		enum: ['','planktonic','non-planktonic','wind-dispersed','animal-dispersed','mobile','gravity']
	},	
	comments: {type: "string"},	
}

export const getSchema = {
	tags:["Ecotaph"],
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
	tags:["Ecotaph"],
    body: {
		type: "object",
		properties: {
			ecotaph: {
				type: "object",
				properties: ecotaphProperties,
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
		},
		examples: [{
			ecotaph: {
			}		
		}],
	},
	response: {
		204: {
			description: 'Ecotaph modified',
			type: 'object',
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			}
		  },	
	}
}

export const createSchema = {
	tags:["Ecotaph"],
    body: {
		type: "object",
		properties: {
			ecotaph: {
				type: "object",
				properties: ecotaphProperties,
				additionalProperties: false,
				required: [
					"taxon_no",
					"reference_no"
                ],
			},
			allowDuplicate: {
				type: "boolean",
				default: false
			}
      	},
		examples: [{
			ecotaph:{
			}
		}],
	},
	response: {
		201: {
			description: "Ecotaph created",
			type: "object",
			properties: {
				statusCode: {type: "integer"},
				msg: {type: "string"},
			  	ecotaph_no: {type: "integer"}
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