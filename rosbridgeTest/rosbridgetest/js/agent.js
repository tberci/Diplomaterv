// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url : 'ws://localhost:9090' });

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




class Agent {
    constructor() {
      this.name = "";
      this.x = 0;
      this.y =  0;
      this.radius = 70;
      this.velocity = 0;
      this.topic = "";
      this.rosMsg = 0;
      

      this.spawn();
      
      // Create a listener for /my_topic
    }
  
    setName(name){
      return this.name = name;
    }
  
    spawn(){
        this.x = Math.random()* (200 - 50) + 50;
        this.y =  Math.random()* (600 - 50) + 50;
    }
  
    move() {
    
      if (typeof rosMsg == 'undefined'){
        this.velocity = 0; 
        
      }
     else{
      this.velocity = this.rosMsg;
      this.x += this.velocity;
     }
    }
  
    show() {
      stroke(255);
      fill(204,102,0);
      ellipse(this.x, this.y, this.radius,this.radius);
      textSize(50);
      text(this.name, this.x-20, this.y);
    }
  
    collide(){
      if(this.x +this.radius > canvasW|| this.y +this.radius > canvasH || this.x +this.radius< 0 || this.y+this.radius <0){
        //console.log("collision detected");
        this.x = Math.random()* (200 - 50) + 50;
        this.y =  Math.random()* (600 - 50) + 50;
      }
    }
  
    stop(){
      this.velocity = 0;
    }

    Movement_subscribe(topic){
      
        topic.subscribe(function(message) {
        rosMsg = message.data;
  
        const ul = document. getElementById("messages");
        const newMessage = document. createElement("li");
        newMessage. appendChild(document. createTextNode(message.data));
        ul.appendChild(newMessage);
        });
      
       
      }
  }