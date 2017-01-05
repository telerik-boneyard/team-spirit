import { ItemModel, Group } from './';

export class GroupMembership extends ItemModel {
    UserId: string;
    GroupId: string;
    Group?: Group; // when expanded
}
