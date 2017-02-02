import { ItemModel } from './item.model';

export class Event extends ItemModel {
    Name: string;
    EventDate?: string;
    EventDateChoices?: string[];
    Description: string;
    LocationURL: string;
    LocationName: string;
    Image?: string;
    ImageUrl?: string;
    OpenForRegistration: boolean;
    RegistrationCompleted: boolean;
    OrganizerId: string;
    GroupId: string;
}
