import { Television } from "@src/entities/Television";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { TelevisionSvc, televisionSvc } from "./Television.service";
import { createTelevisionBody } from "./types/CreateTelevisionBody";
import { updateTelevisionBodySchema } from "./types/UpdateTelevisionBody";

class TelevisionController extends BaseController<Television, TelevisionSvc> {}

export const televisionController = new TelevisionController(televisionSvc, createTelevisionBody, updateTelevisionBodySchema, undefined, querySchema)
