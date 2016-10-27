import { Item as BsItem } from '../../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';

export class ItemModel implements BsItem {
    CreatedAt: Date;
    CreatedBy: string;
    Id: string;
    Meta: {
        Permissions: {
            CanDelete: boolean;
            CanRead: boolean;
            CanUpdate: boolean;
        };
    };
    ModifiedAt: Date;
    ModifiedBy: string;
    Owner: string;
    Role: string;
}