import { ItemModel } from './item.model';

export class Group extends ItemModel {
    Name: string;
    Image: string;
    ImageUrl: string;
    RequiresApproval: boolean;
    IsPublic: boolean;
    Description: string;
}
