let states = document.getElementById("state");
let messages = document.getElementById("messages");
let box = document.getElementById("box").style.height;

let topic;
let canvasH ;
let canvasW;
let rosMsg;

const agent_states = ["happy", "angry", "confused"];      //kutya állapotai teszt.

function setup() {
 let canvas =  createCanvas(windowWidth/1.3, windowHeight/1.7);
 canvas.parent("canvas");   //máskülönben minden más html elem felette lenne pozicionálva.
 canvasH = height;
 canvasW = width;
 console.log("height " + canvasH);
 console.log("width " + canvasW);
 states.style.height = canvasH +"px";
}


let cmd_vel_listener = new ROSLIB.Topic({
      ros : ros,
      name : "/cmd_vel",
      messageType : "std_msgs/Float32"
    
}); 

let StateListener = new ROSLIB.Topic({
  ros : ros,
  name : "/state",
  messageType : "std_msgs/String"

});

let cmd_vel2_listener = new ROSLIB.Topic({
  ros : ros,
  name : "/cmd_vel2",
  messageType : "std_msgs/Float32"

}); 



 let agent ;        
 const agents = [];
 let ok = false;      //változó a név adás előtti kirajzoláshoz.
 let pause = false;


function append_state(x){
  let item = document.createElement('p');
  item.textContent = agent_states[x] ;
  messages.appendChild(item);

}

function subscribe(topic){
  topic.subscribe(function(message) {
  

  const ul = document. getElementById("messages");
  const newMessage = document. createElement("li");
  newMessage. appendChild(document. createTextNode(message.data));
  ul.appendChild(newMessage);
  });

}


function publish(topic, msg){
  topic.publish(msg);

}



const obj = JSON.parse('{"ros":"ros", "name":"/speed", "messageType" : "std_msgs/String"}');



$("#simulate").click(function(){  //szimulációra kattintva új agent példány jön létre.
      pause = true;
      
      agent = new Agent();
      let agent_name = document.getElementById("nameInput").value;
      agent.setName(agent_name);

      

      //topic = document.getElementById("topicInput").value;
      agents.push(agent);   //minden új agent az agents tömbbe kerül.
      console.log("A new agent has been created!" );
      console.log(agents.length);

      messages.innerHTML = "active agents : " + agents.length;

      //agent.topics.push(obj.name);
      
      console.log("a subolt topic" + topic);
      
      subscribe(StateListener);

      if(agent.name === ""){  //amíg a név mező üres addig nem enged agentet létrehozni.
        alert("agent mush have a name");

      }else{
        ok = true; 


        let rand_string  = Math.floor(Math.random() * agent_states.length);

        let agent_states_msg = new ROSLIB.Message({
          data : agent_states[rand_string]
   
        });

        
        publish(StateListener,agent_states_msg);
        
    
      
      }
});


$("#stop").click(function(){  //startra kattintva új agent példány jön létre.
  pause = true;
        
});

$("#continue").click(function(){ 
  pause = false;
             
});

$("#cmd_vel").click(function(){ 
  agent.rosMsg = rosMsg; 
  let velocity1 = new ROSLIB.Message({
    data : Math.floor(Math.random() * 5)
    
  });
  
 
agent.Movement_subscribe(cmd_vel_listener);

publish(cmd_vel_listener,velocity1);
             
});

$("#cmd_vel2").click(function(){  
  agent.rosMsg = rosMsg; 
//agent.topic = 2; 
let velocity2= new ROSLIB.Message({
    data : Math.floor(Math.random() * 10)
  
  });

agent.Movement_subscribe(cmd_vel2_listener);
publish(cmd_vel2_listener,velocity2);
             
});


function draw() {
  background(0);    //canvas törlés
 
  if(ok){
   
    for(let i = 0; i< agents.length; i++){
      //console.log(agents[i].topics);
          if(pause){
            agents[i].stop();
            agents[i].show();
          }else{
            
            agents[i].move();
            agents[i].show();
            agents[i].collide();
           
          }
    }
  }

 
}

 