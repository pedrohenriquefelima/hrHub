import { LightningElement,wire,track } from 'lwc';
import fetchUtilityLinks from '@salesforce/apex/UtilityLinksController.fetchActiveUtilityLinks';

export default class UtilityLinksParent extends LightningElement {
    utilityLinksData;
    showMore = false;
    buttonLabel = 'SHOW MORE';

    //store all data
    structuredData;
    
    @wire(fetchUtilityLinks)
    wiredUtilityLinks({ data, error }) {
        if (data) {
            console.log('data');
            this.structuredData = this.structureResponse(data);
            if(!this.showMore){
                if (this.structuredData.length > 0) {
                    const firstRow = [];
                    firstRow.push(this.structuredData[0]);
                    this.utilityLinksData = firstRow;
                    // console.log('JSON string');
                    // console.log(JSON.stringify(this.utilityLinksData));
                }
            }
        } else if (error) {
            console.log(error);
        }
    }

    structureResponse(data){
        let nestedLoop = [];
        for (let i = 0; i < data.length; i += 6) {
            const innerLoop = [];
            for (let j = i; j < i + 6 && j < data.length; j++) {
                innerLoop.push(data[j]);
            }
            nestedLoop.push(innerLoop);
        }

        nestedLoop = nestedLoop.map(array => {
            let newObj = {
                id: Math.floor(Math.random() * 200),
                data: array
            }
            return newObj;
        });
        return nestedLoop;
    }

    showMoreItemHandler(){
        this.showMore = !this.showMore;
        console.log(this.showMore);
        let sizeOfBox;
        let element;
        if(this.showMore){
            console.log(this.showMore);
            this.buttonLabel = 'SHOW LESS';
            this.utilityLinksData = this.structuredData;
            sizeOfBox = 80 * this.utilityLinksData.length;

            element = this.template.querySelector('.parent-container')
            element.classList.add('extend-card');
            element.style.height = `${sizeOfBox}px`;
        }else {
            this.buttonLabel = 'SHOW MORE';
            const firstRow = [];
            firstRow.push(this.structuredData[0]);
            this.utilityLinksData = firstRow;
            sizeOfBox = 80 * this.utilityLinksData.length;
            element = this.template.querySelector('.parent-container')
            if(element.classList.contains('extend-card')) {
                element.classList.remove('extend-card');
                element.style.height = `${sizeOfBox}px`;
            } 
        }
    }
}