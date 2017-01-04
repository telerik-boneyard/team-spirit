import { ItemModel } from './item.model';

export class Event extends ItemModel {
    Name: string;
    EventDate?: string;
    EventDateChoices?: string[];
    LocationURL: string;
    LocationName: string;
    Image?: string;
    ImageUrl?: string;
}
