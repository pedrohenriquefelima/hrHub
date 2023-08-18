public with sharing class memoryGameController {
    @AuraEnabled(cacheable=true)
    public static List<Memory_Game__c> getTop10MemoryGame(){
        List<Memory_Game__c> memoryGames = [SELECT CreatedDate,Duration__c,Name,Player__r.FirstName,Player__r.LastName,Moves__c FROM Memory_Game__c ORDER BY Duration__c ASC LIMIT 10 ];
        return memoryGames;
    }
}