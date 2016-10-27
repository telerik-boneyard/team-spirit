import { ItemModel } from './item.model';

export class Event extends ItemModel {
    Name: string;
    EventDate?: Date;
    EventDateChoices?: Date[];
}