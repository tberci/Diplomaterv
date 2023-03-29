// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url : 'ws://192.168.0.112:9090' });

// When the Rosbridge server connects, fill the span with id “status" with “successful"
ros.on('connection', () => {
   document.getElementById("status").innerHTML = "successful";
 });

 // When the Rosbridge server experiences an error, fill the “status" span with the returned error
 ros.on('error', (error) => {
   document.getElementById("status").innerHTML = `errored out (${error})`;
 });

 // When the Rosbridge server shuts down, fill the “status" span with “closed"
 ros.on('close', () => {
   document.getElementById("status").innerHTML = "closed";
 });


 let entity;
let states = document.getElementById("state");
let messages = document.getElementById("messages");
let box = document.getElementById("box").style.height;

let topic;
let canvasH ;
let canvasW;
let rosMsg  = 0;

const entity_states = ["happy", "angry", "confused"];      //kutya állapotai teszt.


let cmd_vel_listener = new ROSLIB.Topic({
      ros : ros,
      name : "/cmd_vel",
      messageType : "geometry_msgs/Twist"
    
}); 

let StateListener = new ROSLIB.Topic({
  ros : ros,
  name : "/state",
  messageType : "std_msgs/String"

});

let cmd_vel2_listener = new ROSLIB.Topic({
  ros : ros,
  name : "/cmd_vel2",
  messageType : "geometry_msgs/Twist"

}); 

let entity_creator_topic = new ROSLIB.Topic({
  ros : ros,
  name : "/new_agent",
  messageType : "std_msgs/String"

}); 

        
 const entities = [];
 let ok = false;      //változó a név adás előtti kirajzoláshoz.
 let pause = false;


function subscribe(topic){
  topic.subscribe(function(message) {
    console.log(message.data);
  });

}

const obj = JSON.parse('{"ros":"ros", "name":"/speed", "messageType" : "std_msgs/String"}');

let entity_name ;

entity_creator_topic.subscribe(function(message) {
    pause = true;
      
    entity = new Entity();

    entity_name = document.getElementById("nameInput").value;
    entity.setName(message.data);

    ok = true; 

    entity.spawn();
    

  

    //topic = document.getElementById("topicInput").value;
    entities.push(entity);   //minden új agent az agents tömbbe kerül.
    console.log("A new agent has been created!" );
    console.log(entities.length);

    messages.innerHTML = "active agents : " + entities.length;

    subscribe(StateListener);

    let rand_string  = Math.floor(Math.random() * entity_states.length);

    let agent_states_msg = new ROSLIB.Message({
      data : entity_states[rand_string]

    });

    let agent_names = new ROSLIB.Message({
      data : entity_name

    });

    
   // publish(StateListener,agent_states_msg);
    
    //publish(node_creator_topic, agent_names);
  
  

  console.log(message.data);
});

$("#stop").click(function(){  //startra kattintva új agent példány jön létre.
  pause = true;
        
});

$("#continue").click(function(){ 
  pause = false;
             
});

$("#cmd_vel").click(function(){ 
  
  entity.Movement_subscribe(cmd_vel_listener);
  
  entity.unsubscribe_from_topic(cmd_vel2_listener);
});

$("#cmd_vel2").click(function(){  
  

  entity.Movement_subscribe(cmd_vel2_listener);
  
  entity.unsubscribe_from_topic(cmd_vel_listener);  
});


function setup() {
  let canvas =  createCanvas(windowWidth/1.3, windowHeight/1.7);
  frameRate(60);
  canvas.parent("canvas");   //máskülönben minden más html elem felette lenne pozicionálva.
  canvasH = height;
  canvasW = width;
  console.log("height " + canvasH);
  console.log("width " + canvasW);
  states.style.height = canvasH +"px";
  
  
  
 }

function draw() {
  background(0);    //canvas törlés
 
      if(ok){
   
      for(let i = 0; i< entities.length; i++){
        entities[i].velx = rosMsg
        if(pause){

          entities[i].stop();
          entities[i].show();
        }else{
          entities[i].move();
          entities[i].show();
          entities[i].collide();
        }
          
          
    }
  }

 
}

 