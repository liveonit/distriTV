import { Label } from "@src/entities/Label";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { LabelSvc, labelSvc } from "./Label.service";
import { createLabelBody } from "./types/CreateLabelBody";
import { updateLabelBody } from "./types/UpdateLabelBody";

class LabelController extends BaseController<Label, LabelSvc> {}

export const labelController = new LabelController(labelSvc, createLabelBody, updateLabelBody, undefined, querySchema)
