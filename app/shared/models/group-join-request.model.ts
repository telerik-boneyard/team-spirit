import { ItemModel } from './item.model';
import { User } from './';

export class GroupJoinRequest extends ItemModel {
    ApplicantId: string;
    Applicant?: User; // when expanded
    GroupId: string;
    Approved: boolean;
    Resolved: boolean;
}
