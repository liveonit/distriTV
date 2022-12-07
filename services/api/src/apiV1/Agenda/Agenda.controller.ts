import { Agenda } from "@src/entities/Agenda";
import BaseController from "@src/utils/BaseClasses/BaseController";
import { querySchema } from "@src/utils/BaseClasses/QueryType";
import { AgendaSvc, agendaSvc } from "./Agenda.service";
import { createAgendaBody } from "./types/CreateAgendaBody";
import { updateAgendaBodySchema } from "./types/UpdateAgendaBody";

class AgendaController extends BaseController<Agenda, AgendaSvc> {}

export const agendaController = new AgendaController(agendaSvc, createAgendaBody, updateAgendaBodySchema, undefined, querySchema)
