import { LightningElement, wire, track } from 'lwc';
import getNewlyCreatedUsers from '@salesforce/apex/UserController.getNewlyCreatedUsers';


/**
 * to do:
 * make the search small and on the side
 * create cards with data without profile
 * 
 */
export default class NewHiresParent extends LightningElement {
    relativeDate = 'THIS_QUARTER';
    userDataResults;
    @track _options =  [
        { label: 'This Week', value: 'THIS_WEEK' },
        { label: 'This Month', value: 'THIS_MONTH' },
        { label: 'This Quarter', value: 'THIS_QUARTER' },
        { label: 'Last Week', value: 'LAST_WEEK' },
        { label: 'Last Month', value: 'LAST_MONTH' },
        { label: 'Last Quarter', value: 'LAST_QUARTER' }
    ];

    get options() {
        return this._options.map(option => ({
            ...option,
            className: 'custom-combobox-option'
        }));
    };

    @wire(getNewlyCreatedUsers, {relativeDate: "$relativeDate"})
    newlyCreatedUsersResult({data, error}){
        if(data){
            this.userDataResults = data;
            console.log('this.userDataResults');
        }else if(error){
            console.log(error);
        }
    }

    handleChangeNewHire(data){
        getNewlyCreatedUsers({relativeDate: data.target.value}).then(result => {
            this.userDataResults = result;
        }).catch((error)=>{
            console.log(JSON.stringify(error));
        });
    }
}