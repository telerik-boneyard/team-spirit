import { ItemModel, Group, User } from './';

export class GroupMembership extends ItemModel {
    UserId: string;
    GroupId: string;
    Group?: Group; // when expanded
    User?: User; // when expanded
}
