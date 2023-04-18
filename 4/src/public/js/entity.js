class Entity{
  constructor() {
      this.id = 0;
      this.name = "";
      this.x = 0;
      this.y =  0;
      this.radius = 70;
      this.velocity = 0;
      this.topic = "";
      this.velx = 0;
      this.angz = 0;
      this.topic_name = "";
      
      // Create a listener for /my_topic
    }
  
    setName(name){
      return this.name = name;
    }
  
    spawn(){
        this.x = Math.random()* (200 - 50) + 50;
        this.y =  Math.random()* (200 - 50) + 50;
    }
  
    move() {
      
      this.velocity = this.velx;
      this.x += this.velocity;
      this.y += this.angz;
    }

    getDistance( entities){
      let distance = 0;
      for(let i = 0; i< entities.length; i++){
        distance = sqrt( (entities[i].x - this.x)**2 + (entities[i].y - this.y)**2 );
        
        
      }
      let distance_msg = new ROSLIB.Message({
        data : distance
      
      });
      distance_topic.publish(distance_msg)
      
      return distance
   
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
          for(let i = 0; i< entities.length; i++){
            if(topic.name == entities[i].name + "/position")

              entities[i].velx = message.linear.x;
              entities[i].angz = message.angular.z;
          }
        
        
        });
      
      
      }
    unsubscribe_from_topic(topic){
      topic.unsubscribe();
    }
  }