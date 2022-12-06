import { Label } from '@src/entities/Label';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

class LabelSvc extends BaseService<Label> {}

export const labelSvc = new LabelSvc(Label);
