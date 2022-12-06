import { Content } from "@src/entities/Content";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { contentSvc } from "./Content.service";
import { createContentBody } from "./types/CreateContentBody";
import { updateContentBodySchema } from "./types/UpdateContentBody";

class ContentController extends BaseController<Content> {}

export const contentController = new ContentController(contentSvc, createContentBody, updateContentBodySchema, undefined, querySchema)
