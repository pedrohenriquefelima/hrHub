public with sharing class UserController {

    @AuraEnabled(cacheable=true)
    public static List<User> getNewlyCreatedUsers(String relativeDate) {
        List<User> newlyCreatedUsers = new List<User>();
        if(relativeDate == 'THIS_WEEK'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = THIS_WEEK AND IsActive = TRUE];
        }else if(relativeDate =='THIS_MONTH'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = THIS_MONTH AND IsActive = TRUE];
        }else if(relativeDate == 'THIS_QUARTER'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = THIS_QUARTER AND IsActive = TRUE];
        }else if(relativeDate == 'LAST_WEEK'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = LAST_WEEK AND IsActive = TRUE];
        }else if(relativeDate == 'LAST_MONTH'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = LAST_MONTH AND IsActive = TRUE];
        }else if(relativeDate == 'LAST_QUARTER'){
            newlyCreatedUsers =  [SELECT FirstName, LastName, Created_Date_Custom__c,Title,UserRole.Name,SmallPhotoUrl, FullPhotoUrl FROM User WHERE Created_Date_Custom__c = LAST_QUARTER AND IsActive = TRUE];
        }
        return newlyCreatedUsers;
    }
}