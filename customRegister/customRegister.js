import { LightningElement , track} from 'lwc';
import ifEmailExist from '@salesforce/apex/CustomRegistrationController.ifEmailExist';
import ifPartnerAccountExist from '@salesforce/apex/CustomRegistrationController.ifPartnerAccountExist';
import registerUser from '@salesforce/apex/CustomRegistrationController.registerUser';

export default class CustomRegister extends LightningElement {

    @track firstName = null;
    @track lastName = null;
    @track email = null;
    @track partnerNumber=null;
    @track userName = null;
    @track password = '1234';
    @track confirmPassword = null;
    @track errorCheck;
    @track erroerMessage;
    showUserName;
    @track showTermsAndConditions;
    @track showTermsAndConditionsLoading = false;
    @track infoTooltipDisplayData = {};
    @track requiredTooltipDisplayData = {};
    @track errorTooltipDisplayData = {};
    @track emailError;
    @track partnerNumberError;
    @track passwordError;
    connectedCallback(){

       // this.showUserName = false;
        //this.infoTooltipDisplayData.username = "tooltiptext usernameTooltiptext";
        //this.infoTooltipDisplayData.password = "tooltiptext";

        this.requiredTooltipDisplayData.firstName = 'errorText errorTextHide';
        this.requiredTooltipDisplayData.lastName = 'errorText errorTextHide';
        this.requiredTooltipDisplayData.email = 'errorText errorTextHide';
        this.requiredTooltipDisplayData.username = 'errorText errorTextHide';        
        this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
        //this.requiredTooltipDisplayData.password = 'tooltiptext tooltipHide';
        //this.requiredTooltipDisplayData.confirmPassword = 'tooltiptext tooltipHide';

        this.errorTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
        this.errorTooltipDisplayData.email = 'errorText errorTextHide';
        this.requiredTooltipDisplayData.errorMessage = 'errorText errorTextHide';
        //this.errorTooltipDisplayData.password = 'tooltiptext tooltipHide';
    }
    handleLastNameChange(event) {

        this.lastName= event.target.value;

    }
    handleFirstNameChange(event) {

        this.firstName= event.target.value;

    }
    handleEmailChange(event) {

        this.email= event.target.value;
        this.userName = this.email;

    }
    handlePartnerNumberChange(event) {

        this.partnerNumber= event.target.value;

    }
    /*
    for some reasons generic function doesn't work
    genericOnChange(event){
        this[event.target.name] = event.target.value;
    }*/
    
    onEmailInvalid(event){

        if (!event.target.validity.valid) {
            event.target.setCustomValidity('Enter a valid email address')
        }
        
    }

    onEmailInput(event){

        event.target.setCustomValidity('')
    }

    onEmailClick(event){

        let parent = event.target.parentElement.parentElement.parentElement;
        console.log('parent-', parent);
        parent.classList.remove('tooltipEmail');
    }

    onEmailBlur(event){

        let parent = event.target.parentElement.parentElement.parentElement;
        console.log('parent-', parent);
        parent.classList.add('tooltipEmail');
    }
    handleRegister(){

        this.errorCheck = false;
        this.errorMessage = null;
        this.errorTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
        this.errorTooltipDisplayData.email = 'errorText errorTextHide';
        
       
        //form input validation
        if(!this.firstName){
            this.requiredTooltipDisplayData.firstName = 'errorText errorTextShow';
            this.requiredTooltipDisplayData.lastName = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.email = 'errorText errorTextHide';

        } 
        else  if(!this.lastName){

            this.requiredTooltipDisplayData.lastName = 'errorText errorTextShow';
            this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.email = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.firstName = 'errorText errorTextHide';

        } 
        else if(!this.email ){
            this.requiredTooltipDisplayData.lastName = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.email = 'errorText errorTextShow';
            this.requiredTooltipDisplayData.firstName = 'errorText errorTextHide';

        } 
        else if(!this.partnerNumber &&this.email && this.lastName ){
            this.requiredTooltipDisplayData.lastName = 'errorText errorTextHide'
            this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextShow';
            this.requiredTooltipDisplayData.email = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.firstName = 'errorText errorTextHide';

        } 
        else{
            this.requiredTooltipDisplayData.lastName = 'errorText errorTextHide'
            this.requiredTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.email = 'errorText errorTextHide';
            this.requiredTooltipDisplayData.firstName = 'errorText errorTextHide';
        }
        //form input validation end

       //email validation
        if( this.firstName && this.lastName && this.email && this.partnerNumber){
            //email validation
            let emailCheck = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email);
            if( emailCheck == null || emailCheck === undefined || emailCheck === false ){
            this.emailError =  'Invalid email address';
            this.errorTooltipDisplayData.email = 'errorText errorTextShow';
            
            return;
        }
        //if email already exist
        if(ifEmailExist({ username: this.email })
            .then((result) => {
                console.log(result+' ifEmailExist');
                if( result === true){
                    this.emailError = 'User with this email is already registered.';
                    this.errorTooltipDisplayData.email = 'errorText errorTextShow';
                    this.errorTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
                    this.errorCheck = true;
                }
                else{
                    if(ifPartnerAccountExist({ partnerNumber: this.partnerNumber })
                        .then((result1) => {
                            console.log(result+' ifPartnerAccountExist');
                            if(result1 !== true){
                                this.partnerNumberError = 'The company with such partner number does not exist.';
                                this.errorTooltipDisplayData.email = 'errorText errorTextHide';
                                this.errorTooltipDisplayData.partnerNumber = 'errorText errorTextShow';
                                this.errorCheck = true;
                            }
                            else{
                                console.log('code after successful error check');
                                this.errorTooltipDisplayData.email = 'errorText errorTextHide';
                                this.errorTooltipDisplayData.partnerNumber = 'errorText errorTextHide';
                                registerUser({ firstName: this.firstName, lastName: this.lastName, username: this.userName, email: this.email, siteNickname: this.firstName,
                                    partnerNumber: this.partnerNumber })
                                        .then((result2) => {                 
                                            if(result2!=null){            
                                                        
                                                window.location.href = 'https://studentcom84-dev-ed.my.site.com/SmuziAndVeslo/s/login/CheckPasswordResetEmail';
                            
                                            }
                                            else {
                                               
                                                this.emailError = 'Something got wrong. System administrator is contacted.';
                                                this.errorTooltipDisplayData.email = 'errorText errorTextShow';
                                            }
                                        })
                                        .catch((error) => {
                                            this.error = error;
                                            console.log('error-',error);
                                            if(error && error.body && error.body.message){
                                                this.errorCheck = true;
                                                this.errorMessage = error.body.message;
                                                this.requiredTooltipDisplayData.errorMessage = 'errorText errorTextShow';
                                            
                                            }                            
                                        });
                                }
                        }));
                     }
                }));

        }
        


    }

    
}
