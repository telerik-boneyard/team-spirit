import { constants } from '../';

export class User {
    constructor(
        public Username: string,
        public DisplayName: string,
        public Email: string,
        public ProfilePicture: string
    ) {
        this.ProfilePicture = ProfilePicture || constants.emptyImage;
    }
}