import { LightningElement,api,track } from 'lwc';
import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import getEvents from '@salesforce/apex/EventController.getEvents';


export default class eventSchedule extends LightningElement {
    
    @track returnedEvents = [] ;
    @track finalevents = [] ;

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
    console.log(this.returnedEvents.length);
    console.log('In initial');
    var str = window.location.href;
    var pos = str.indexOf(".com/");
    var last = pos + 4;
    var tDomain = str.slice(0,last);
    for(var i = 0 ; i < this.returnedEvents.length ; i++)
    {
      this.finalevents.push({
        title : this.returnedEvents[i].Subject,
        start : this.returnedEvents[i].StartDateTime,
        end : this.returnedEvents[i].EndDateTime,
        allDay : this.returnedEvents[i].IsAllDayEvent,
        url : tDomain+'/lightning/r/Event/'+this.returnedEvents[i].Id+'/view'
    });
    }
    console.log(this.finalevents.length);
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
      events: this.finalevents,

    });
  }
  getTasks(){
    getEvents()
        .then(result =>{
           console.log(JSON.parse(result));
           this.returnedEvents = JSON.parse(result) ;
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