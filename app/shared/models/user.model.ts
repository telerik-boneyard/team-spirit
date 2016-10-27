import { ItemModel } from './item.model';
import { constants } from '../';

export class User extends ItemModel {
    constructor(
        public Id: string,
        public Username: string,
        public DisplayName: string,
        public Email: string,
        public ProfilePicture: string
    ) {
        super();
        this.ProfilePicture = ProfilePicture || constants.emptyImage;
    }
}
