import { LightningElement, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import Name from '@salesforce/schema/User.Name';
import ProfileName from '@salesforce/schema/User.Profile.Name';
import Title from '@salesforce/schema/User.Title';
import Department from '@salesforce/schema/User.Department';

export default class GetUserDetails extends LightningElement {
   userId = Id;
   userName;
   userProfileName;
   userTitle;
   userDepartment;
    
    @wire(getRecord, { recordId: Id, fields: [Name, ProfileName, Title, Department] })
    userDetails({ error, data }) {
        if (error) {
            this.error = error;
        } else if (data) {
            if (data.fields.Name.value != null) {
                this.userName = data.fields.Name.value;
            }
            if (data.fields.Profile.value != null) {
                this.userProfileName = data.fields.Profile.value.fields.Name.value;
            }
            if (data.fields.Title.value != null) {
                this.userTitle = data.fields.Title.value;
            }
            if (data.fields.Department.value != null) {
                this.userDepartment = data.fields.Department.value;
            }
        }
    }
}