import { ItemModel } from './item.model';

export class GroupJoinRequest extends ItemModel {
    ApplicantId: string;
    GroupId: string;
    Approved: boolean;
    Resolved: boolean;
}
