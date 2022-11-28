import { LightningElement, track } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import getOppo from '@salesforce/apex/oppoCloseDate.getOppo';

/**
 * @description Full Calendar JS - Lightning Web Components
 */
export default class OpportunityCalendar extends LightningElement {

  @track returnedOppo = [] ;
  @track finalOppo = [] ;


  renderedCallback() {
    Promise.all([
      loadScript(this, FullCalendarJS + '/jquery.min.js'),
      loadScript(this, FullCalendarJS + '/moment.min.js'),
      loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
      loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
    ])
    .then(() => {
      this.getTasks();
    })
    .catch(error => {
      console.error({
        message: 'Error occured on FullCalendarJS',
        error
      });
    })
  }
  initialiseFullCalendarJs() {
    console.log('In initial');
    console.log(this.returnedOppo.length);
    console.log('In initial');
    var str = window.location.href;
    var pos = str.indexOf(".com/");
    var last = pos + 4;
    var tDomain = str.slice(0,last);
    for(var i = 0 ; i < this.returnedOppo.length ; i++)
    {
      this.finalOppo.push({
        start : this.returnedOppo[i].CloseDate,
        title : this.returnedOppo[i].Name,
        url : tDomain+'/lightning/r/Opportunity/'+this.returnedOppo[i].Id+'/view'
    });
    }
    console.log(this.finalOppo.length);
    console.log('Final Task Length Above');
    const ele = this.template.querySelector('div.fullcalendarjs');
    $(ele).fullCalendar({
      header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,basicWeek,basicDay'
      },
    
      defaultDate: new Date(),
      navLinks: true, 
      editable: true,
      eventLimit: true, 
      events : this.finalOppo
    });
  }
  getTasks(){
    getOppo()
        .then(result =>{
           console.log(JSON.parse(result));
           this.returnedOppo = JSON.parse(result) ;
            console.log('Object Returned');
            this.initialiseFullCalendarJs();
            this.error = undefined;
        })
        .catch(error => {
            console.log(error);
            console.log('error');
            this.error = error;
            this.outputResult = undefined;
        });
  }
}