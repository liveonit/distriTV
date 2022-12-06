import { Label } from "@src/entities/Label";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { labelSvc } from "./Label.service";
import { createLabelBody } from "./types/CreateLabelBody";
import { updateLabelBodySchema } from "./types/UpdateLabelBody";

class LabelController extends BaseController<Label> {}

export const labelController = new LabelController(labelSvc, createLabelBody, updateLabelBodySchema, undefined, querySchema)
