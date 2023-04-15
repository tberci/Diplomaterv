


class Entity{
  constructor() {
      this.id = 0;
      this.name = "";
      this.x = 0;
      this.y =  0;
      this.radius = 70;
      this.velocity = 0;
      this.topic = "";
      this.velx = lin_x;
      this.angz = ang_z;
      
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

      var twist = new ROSLIB.Message({
        linear : {
              x : this.x,
              y : 0.0,
              z : 0.0
         },
        angular : {
              x : 0.0,
              y : 0.0,
              z : this.y
           }
          });
     position_pub.publish(twist)
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
        lin_x = message.linear.x;
        ang_z = message.angular.z;
        
        });
      
       
      }
    unsubscribe_from_topic(topic){
      topic.unsubscribe();
    }
  }