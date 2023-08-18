import { LightningElement, track } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import fontawesome from '@salesforce/resourceUrl/fontawesome';
import top10MemoryGames from '@salesforce/apex/memoryGameController.getTop10MemoryGame';
import MEMORY_GAME_RECORD from '@salesforce/schema/Memory_Game__c';
import USER_ID from '@salesforce/user/Id';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class MemoryGameMain extends LightningElement {

    isLibLoaded = false;
    numberOfCardsOpen = 0;
    cardsOpened = [];
    moves = 0;
    matchedCards = [];
    totalTime = '00:00';
    timerRef;
    showCongratulations = false;

    @track boardData;
    cards= [
        {id:1, listClass:"card", type:'diamond', icon:'fa fa-diamond'},
        {id:2, listClass:"card", type:'plane', icon:'fa fa-paper-plane-o'},
        {id:3, listClass:"card", type:'anchor', icon:'fa fa-anchor'},
        {id:4, listClass:"card", type:'bolt', icon:'fa fa-bolt'},
        {id:5, listClass:"card", type:'cube', icon:'fa fa-cube'},
        {id:6, listClass:"card", type:'anchor', icon:'fa fa-anchor'},
        {id:7, listClass:"card", type:'leaf', icon:'fa fa-leaf'},
        {id:8, listClass:"card", type:'bicycle', icon:'fa fa-bicycle'},
        {id:9, listClass:"card", type:'diamond', icon:'fa fa-diamond'},
        {id:10, listClass:"card", type:'bomb', icon:'fa fa-bomb'},
        {id:11, listClass:"card", type:'leaf', icon:'fa fa-leaf'},
        {id:12, listClass:"card", type:'bomb', icon:'fa fa-bomb'},
        {id:13, listClass:"card", type:'bolt', icon:'fa fa-bolt'},
        {id:14, listClass:"card", type:'bicycle', icon:'fa fa-bicycle'},
        {id:15, listClass:"card", type:'plane', icon:'fa fa-paper-plane-o'},
        {id:16, listClass:"card", type:'cube', icon:'fa fa-cube'},
      ]

    get gameRating(){
        let stars = this.moves  < 12 ? [1,2,3]:this.moves >= 13 ? [1,2]:[1];
        return this.matchedCards.length === 16? stars : [];
    }

    connectedCallback() {
        console.log('connectedCallback');
        this.getTop10Data();
        console.log(JSON.stringify(this.userData));
    }

    //render card in the UL
    //create a ul list and the li should be the iteration
    //inside li load icon
    //the ul should use a grid-container
    renderedCallback(){
        console.log('renderedCallback');
        if(!this.isLibLoaded){
            //loadStyle is a promise that will be returned in the renderedCallback lifecycle
            loadStyle(this,fontawesome+'/fontawesome/css/font-awesome.min.css').then(()=>{
                console.log("loaded successfully");
            }).catch(error => {
                console.log(error);
            })
            this.isLibLoaded = true;
        }
    }

    getTop10Data(){
        console.log('retrieving data');
        top10MemoryGames().then(data =>{
            this.boardData = data;
            console.log(JSON.stringify(data));
            
        }).catch(error => {
            console.log(error);
        })
    }

    showIconHandler(event){
        let currentCard = event.target;
        //when the card flips - it should be open, shown and not allowed to click on it again.
        currentCard.classList.add("open","show","disabled");
        this.numberOfCardsOpen++;
        this.cardsOpened = this.cardsOpened.concat(event.target);
        const len = this.cardsOpened.length;

        if(len === 2){
            this.moves = this.moves + 1;
            //triggers the timer on first move
            if(this.moves === 1) {
                this.timer();
            }
            //if both opened cards match
            //only two items can be open together
            if(this.cardsOpened[0].type === this.cardsOpened[1].type){
                //add them to the matched card array
                this.matchedCards = this.matchedCards.concat(this.cardsOpened[0],this.cardsOpened[1]);
                this.matched()
            }else {
                this.unmatched()
            }
        }
    }


    matched(){
        this.cardsOpened[0].classList.add("match","disabled");
        this.cardsOpened[1].classList.add("match","disabled");
        this.cardsOpened[0].classList.remove("show","open");
        this.cardsOpened[1].classList.remove("show","open");
        this.cardsOpened = [];
        
        if(this.matchedCards.length === 16){
            const gameObj = {
                Duration: this.totalTime,
                Moves: this.moves}
            this.createBoardRecord(gameObj);
            window.clearInterval(this.timerRef);
            this.showCongratulations = true;
            
            
           
        }
    }

    unmatched(){
        this.cardsOpened[0].classList.add("unmatched");
        this.cardsOpened[1].classList.add("unmatched");
        //when cards are unmatched the user should not have the ability to select any other card until the timeout is completed
        this.action('DISABLE')
        setTimeout(()=>{
            this.cardsOpened[0].classList.remove("show","open","unmatched");
            this.cardsOpened[1].classList.remove("show","open","unmatched");
            this.action('ENABLE')
            this.cardsOpened = [];
        },1100);
    }

    action(action){
        let cards = this.template.querySelectorAll('.card');
        //converting node array into a proper array
        Array.from(cards).forEach(item => {
            if(action === 'ENABLE'){
                let isMatch = item.classList.contains('match');
                if(!isMatch){
                    item.classList.remove('disabled');
                }
            }

            if(action === 'DISABLE'){
                item.classList.add('disabled');
            }
        })
    }

    timer(){
        let startTime = new Date();
        //after every second timer should increment
        //the timer runs every second
        //because the timer will stop at some point, it will be stored in a property
        this.timerRef = setInterval(()=>{
            let diff = new Date().getTime() - startTime.getTime();
            //converting to seconds
            let d = Math.floor(diff/1000);
            let m = Math.floor(d % 3600 / 60);
            let s = Math.floor(d % 3600 % 60);
            const mDisplay = m > 0 ? m+(m===1? "minute, ":" minutes, "):"";
            const sDisplay = s > 0 ? s+(s===1? "second":" seconds"):"";

            this.totalTime = mDisplay + sDisplay
        },1000);
    }

    shuffle(){
        this.showCongratulations = false;
        this.cardsOpened = [];
        this.moves = 0;
        this.matchedCards = [];
        this.totalTime = '00:00';
        window.clearInterval(this.timerRef);
        let elem = this.template.querySelectorAll('.card')
        Array.from(elem).forEach(item=>{
            item.classList.remove("show", "open", "match", "disabled")
        })
        /***shuffling and swaping logic */
        let array = [...this.cards]
        let counter = array.length
        while(counter>0){
            //the index number should not go above 16...15...14...and so on
            let index = Math.floor(Math.random()*counter)
            counter--

            //grab the element in X position and swap with another one
            let temp = array[counter]
            array[counter] = array[index]
            array[index] = temp
        }
        //updating the actual cards array with the shuffled array;
        this.cards = [...array]
    }

    createBoardRecord(obj){
        const recordInput = {apiName: MEMORY_GAME_RECORD.objectApiName, fields: {Duration__c: obj.Duration,Player__c: USER_ID, Moves__c: obj.Moves}};
        console.log('Creating Records: ' + JSON.stringify(recordInput));
        createRecord(recordInput).then(result => {
            let brandNewRecord = {
                CreatedDate: result.fields.CreatedDate.value,
                Duration__c: result.fields.Duration__c.value,
                Name: result.fields.Name.value,
                Player__c: result.fields.Player__c.value,
                Moves__c: result.fields.Moves__c.value,
                Id: result.id,
                Player__r:{FirstName:result.fields.Player__r.value.fields.Name.value, LastName: result.fields.Player__r.value.fields.Name.value ? result.fields.Player__r.value.fields.Name.value : '',Id: result.fields.Player__r.value.fields.Id.value}
            }
            //this gets added, but when the page is refreshed it still remain the same
            this.boardData = [...this.boardData, brandNewRecord];
        }).catch(error => {
            this.showToast('Error', `Ops! An error ocurred! Pass this message to your SF admin:${JSON.stringify(error.body.message)}`,'error');
        });
    }

    showToast(title, message, variant){
        this.dispatchEvent(new ShowToastEvent({title,message,variant}))
    }
}