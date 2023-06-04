// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url : 'ws://192.168.1.75:9090' });
//192.168.0.112
//192.168.1.72
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
let agent_velocity = document.getElementById("agent_vel");
let agent_name = document.getElementById("agent_name");
let topic_name;
let topic;
let canvasH ;
let canvasW;
let lin_x  = 0;
let ang_z = 0;
const topics = [];
const entities = [];
const entity_states = ["happy", "angry", "confused"];      //kutya állapotai teszt.


/*function position_sub(entities){
let position_listener
for(let i = 0; i< entities.length; i++){
  topic_name = "agent"+(i+1)+"/position"
  
   position_listener = new ROSLIB.Topic({
    ros : ros,
    name : topic_name,
    messageType : "geometry_msgs/Twist"
  
    }); 
  }

return position_listener
}
*/




function pos_sub(topic){

  let position_listener = new ROSLIB.Topic({
    ros : ros,
    name : topic,
    messageType : "geometry_msgs/Twist"
  
});

return position_listener
}




let StateListener = new ROSLIB.Topic({
  ros : ros,
  name : "/state",
  messageType : "std_msgs/String"

});

let spawner_pub = new ROSLIB.Topic({
  ros : ros,
  name : "/agent_spawn",
  messageType : "std_msgs/Int16"

});

let cmd_vel2_listener = new ROSLIB.Topic({
  ros : ros,
  name : "/asd",
  messageType : "geometry_msgs/Twist"

}); 



let entity_creator_topic = new ROSLIB.Topic({
  ros : ros,
  name : "/new_agent",
  messageType : "std_msgs/String"

}); 

let distance_topic = new ROSLIB.Topic({
  ros : ros,
  name : "/distance",
  messageType : "std_msgs/Float32"

}); 

        

 let ok = false;      //változó a név adás előtti kirajzoláshoz.
 let pause = false;


function subscribe(topic){
  topic.subscribe(function(message) {
    console.log(message.data);
  });




}

const obj = JSON.parse('{"ros":"ros", "name":"/speed", "messageType" : "std_msgs/String"}');
let count = 0;
let entity_name ;
let topicname;
let spawning_msg = new ROSLIB.Message({
    data : 1

  });
$("#simulate").click(function(){ 
    pause = true;
    count++;
    entity = new Entity();

    entity_name = document.getElementById("nameInput").value;
    entity.setName(entity_name);
    spawner_pub.publish(spawning_msg);
    topic_name = "agent"+count+"/position";
    
    topicname = pos_sub(topic_name);
    console.log(topic_name)
    
    ok = true; 

    entity.spawn();
    

  

    //topic = document.getElementById("topicInput").value;
    entity.id ++;
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
  

 

  //console.log(message.data);
});

$("#stop").click(function(){  //startra kattintva új agent példány jön létre.
  pause = true;
        
});

$("#continue").click(function(){ 
  pause = false;
             
});

$("#cmd_vel").click(function(){ 
  
   
  
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
     //  console.log("agent name :" + entities[i].name+ "topic name: "+ topicname.name)
       
      entities[i].movement_subscribe(pos_sub(topic_name));
      entities[i].getDistance(entities);
      


        if(pause){

          entities[i].stop();
          entities[i].show();
        }else{
          entities[i].move();
          entities[i].show();
         // entities[i].collide();
        }
          
          
    } 
  }

 
}

  function mousePressed(){
  
    entity.selected();
  
}



 