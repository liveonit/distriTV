import { Institution } from '@src/entities/Institution';
import { BaseController } from '@lib/BaseClasses/BaseController';
import { querySchema } from '@lib/BaseClasses/QueryType';
import { institutionSvc, InstitutionSvc } from './Institution.service';
import { createInstitutionBody } from 'validation/src';
import { updateInstitutionBodySchema } from 'validation/src';

class InstitutionController extends BaseController<Institution, InstitutionSvc> { }

export const institutionController = new InstitutionController(
  institutionSvc,
  createInstitutionBody,
  updateInstitutionBodySchema,
  undefined,
  querySchema,
);
