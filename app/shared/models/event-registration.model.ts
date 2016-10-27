import { User, Event } from './index';
import { ItemModel } from './item.model';

export class EventRegistration extends ItemModel {
    Choices: number[];
    EventId: string;
    UserId: string;
    
    // after expand
    User: User;
    Event: Event;
}
