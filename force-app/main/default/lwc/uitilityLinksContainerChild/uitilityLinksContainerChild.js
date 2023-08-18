import { LightningElement,api } from 'lwc';

export default class UitilityLinksContainerChild extends LightningElement {
    @api receivedData;
    connectedCallback(){
        console.log('received data');
        console.log(JSON.stringify(this.receivedData));
    }
}