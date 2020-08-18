//Javascript dictionary for default values 
var defaultValues = {
    acHeat: 'on',
    wheel: 19,
    min_speed: 70,
    max_speed: 140,
    min_temp: -10, 
    max_temp: 40,
    temp_change: 10,
    speed_metric:'KM'
    };


//Extracting values from HTML elements to assign default values

//Speed
document.getElementById("speed").value = defaultValues.min_speed; 
//Temperature
document.getElementById("temp").value = defaultValues.max_temp;
//Wheels
document.getElementById("both-wheels").value= defaultValues.wheel;
//AC/Heat button
document.getElementById("ac-heat").value = "on";

document.getElementById("wheel19").innerHTML= '19"';
document.getElementById("wheel21").innerHTML= '21"';

//Call to updateResults function which update JSON values
updateResults("metric-100D","car1-result");
updateResults("metric-P100D","car2-result");

    
//Function to decrement the speed and temperature                
function stepIncrease(element,control){
    var increment = parseInt(document.getElementById(control).value);
    if(increment<defaultValues['max_'+ control]){
        increment+=10;
        document.getElementById(control).value= increment.toString();
        
        //Nested IF to enable the up/down button based on the value
        if(increment> defaultValues['min_'+ control]){
             var buttons = document.getElementById('incDec-'+control).children;
             for(var i=0; i< buttons.length; i++){
                var str= buttons[i].className.replace(' disabled','');
                buttons[i].className=str;
            }
        }
          if(control == 'temp'){
            //Function call to change the Ac button to heat or vice versa
            acOrHeat();
        }        
    }
    else {
         element.className+=" disabled";   
    }
    //Call to updateWheelSpeed() to change the wheel size on the animation
    updateWheelSpeed();
    
    //Call to updateResults function which update JSON values
    updateResults("metric-100D","car1-result");
    updateResults("metric-P100D","car2-result");
}

//Function to decrement the speed and temperature
function stepDecrease(element,control){
    var decrement = parseInt(document.getElementById(control).value);
    if(decrement>defaultValues['min_'+ control]){
        decrement-=10;
        document.getElementById(control).value= decrement.toString();
        
        //Nested IF to enable the up/down button based on the value
        if(decrement<defaultValues['max_'+ control]){
            var buttons = document.getElementById('incDec-'+control).children;
            for(var i=0; i< buttons.length; i++){
                var str= buttons[i].className.replace(' disabled','');
                buttons[i].className=str;
            }
        }
        if(control == 'temp'){
            //Function call to change the Ac button to heat or vice versa
            acOrHeat();
        }
   }
    else{
         element.className+=" disabled";
    }
    //Call to updateWheelSpeed() to change the wheel size on the animation
    updateWheelSpeed();
    //Call to updateResults function which update JSON values
    updateResults("metric-100D","car1-result");
    updateResults("metric-P100D","car2-result");
}


//Function to change AC to heat button and back based on temperature
function acOrHeat(){
     var status = document.getElementById('ac-heat');
     if(parseInt(document.getElementById('temp').value)<=defaultValues.temp_change){
            status.className = "button heat-on"; 
            status.value="off";
     }
     else{
        if(status.className.includes("heat")){
                status.className = "button ac-on"; 
                status.value="on";
        }
    }
    if(status.className.includes("-off")){
        status.value="off";
    }
    
    //Call to updateResults function which update JSON values
    updateResults("metric-100D","car1-result");
    updateResults("metric-P100D","car2-result");
}


//Change AC buttons upon clicking (on/off)
function changeAc(element){
    
    document.getElementById('ac-heat').value="off";
    if(element.className.includes('-on')){
        var str= element.className.replace('-on','-off');
        element.className=str;
    }
    else{
        var str= element.className.replace('-off','-on');
        element.className=str;
        if(document.getElementById('ac-heat').className.includes("ac")){
            document.getElementById('ac-heat').value="on";
        }
    } 
    
    //Call to updateResults function which update JSON values
    updateResults("metric-100D","car1-result");
    updateResults("metric-P100D","car2-result");
}


//Function to select a wheel size
function wheelSelect(element){
    
    var allWheels= document.getElementById('both-wheels').children;
    for(var i=0; i< allWheels.length; i++){
        var str= allWheels[i].className.replace(' selected','');
        allWheels[i].className=str;
    }
    element.className+=" selected";
    //Change the value of the wheel size according to clicked button
    document.getElementById("both-wheels").value= element.className.match(/\d+/g)[0];
    
    //Call to updateWheelSpeed() to change the wheel size on the animation
    updateWheelSpeed();
    //Call to updateResults function which update JSON values
    updateResults("metric-100D","car1-result");
    updateResults("metric-P100D","car2-result");
  
}

//Function to update the speed and size of the wheels
function updateWheelSpeed(){
    var speed= document.getElementById('speed').value;
    var wheel_size= document.getElementById('both-wheels').value;
    document.getElementById('rotate-front').className= "rotate-" +speed+ "-19"; 
    document.getElementById('rotate-back').className= "rotate-" +speed+ "-19";
    if(wheel_size=="21"){
        document.getElementById('rotate-front').style= "width:70px; height:70px";
        document.getElementById('rotate-back').style= "width:70px; height:70px";
    }
    else{
        document.getElementById('rotate-front').style= "width:65px; height:65px";
        document.getElementById('rotate-back').style= "width:65px; height:65px";
    }
}


//Function to extract JSON values to display the coressponding value on the screen
function updateResults(filename,id){
    //Extract JSON values
    var request = new XMLHttpRequest();
    request.open("GET", "http://localhost:8000/src/data/" +filename+".json", false);
    request.send(null);
    var responseData = JSON.parse(request.responseText);
    //console.log(responseData);

    for(var i = 0; i < responseData.length; i++){
        if(responseData[i].temp == document.getElementById('temp').value &&                        responseData[i].ac == document.getElementById('ac-heat').value && 
           responseData[i].wheelsize==document.getElementById('both-wheels').value){
            for(var j=0; j< responseData[i].hwy.length; j++){
                if(responseData[i].hwy[j].kmh==document.getElementById('speed').value){
                     document.getElementById(id).innerHTML = responseData[i].hwy[j].kilometers + "KM".sup();
                }
            }
        }
    }
}

