import { Institution } from "@src/entities/Institution";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { institutionSvc } from "./Institution.service";
import { createInstitutionBody } from "./types/CreateInstitutionBody";
import { updateInstitutionBodySchema } from "./types/UpdateInstitutionBody";

class InstitutionController extends BaseController<Institution> {}

export const institutionController = new InstitutionController(institutionSvc, createInstitutionBody, updateInstitutionBodySchema, undefined, querySchema)
