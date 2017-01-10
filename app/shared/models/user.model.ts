import { ItemModel } from './item.model';
import { constants } from '../';

export class User extends ItemModel {
    constructor(
        public Id: string,
        public Username: string,
        public DisplayName: string,
        public Email: string,
        public ImageUrl: string,
        public Phone: string
    ) {
        super();
        this.ImageUrl = ImageUrl || constants.emptyImage;
    }
}
