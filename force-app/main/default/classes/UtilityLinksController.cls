public with sharing class UtilityLinksController {
    @AuraEnabled(cacheable=true)
    public static List<Utility_Link__c> fetchActiveUtilityLinks() {
        return [SELECT URL_Address__c, User_Facing_Label__c, Name,ImageAddress__c FROM Utility_Link__c WHERE Active__c = TRUE];
    }
}