import { Label } from 'validation/entities/Label';
import { BaseController } from 'lib/BaseClasses/BaseController';
import { querySchema } from 'lib/BaseClasses/QueryType';
import { LabelSvc, labelSvc } from './Label.service';
import { createLabelBody } from 'validation/entities';
import { updateLabelBody } from 'validation/entities';

class LabelController extends BaseController<Label, LabelSvc> {}

export const labelController = new LabelController(
  labelSvc,
  createLabelBody,
  updateLabelBody,
  undefined,
  querySchema,
);
