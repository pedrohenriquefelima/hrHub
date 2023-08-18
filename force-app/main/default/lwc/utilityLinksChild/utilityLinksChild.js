import { LightningElement,api } from 'lwc';

export default class UtilityLinksChild extends LightningElement {
    @api linkData;
    
    handleClick() {
        console.log(linkData)
        // Handle click action, e.g., open a modal, navigate to a record, etc.
    }
}