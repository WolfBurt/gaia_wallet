/**
 * creation complete
 */
import { Widget } from '../../../../../pi/widget/widget';
export class CreateComplete extends Widget {
    public ok: () => void;
    constructor() {
        super();
    }
    public backPrePage() {
        this.ok && this.ok();
    }

}
