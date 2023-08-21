import { LightningElement, api} from 'lwc';

export default class UserCardItem extends LightningElement {
    @api userItemData
    joinedDate;

    get joinedDateUser() {
        // Parse the string into a Datetime instance
        let dateTimeValue = new Date(this.userItemData.Created_Date_Custom__c);

        let month = dateTimeValue.getUTCMonth() + 1;
        let day = dateTimeValue.getUTCDate();

        if(day < 10) {
            day = '0' + day;
        }

        if(month < 10) {
            month = '0' + month;
        }

        return day + "/" + month;
    }

    connectedCallback(){
        console.log('user item data', JSON.stringify(this.userItemData));
    }

    
}