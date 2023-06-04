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
      this.topic_name = "agent"+count+"/position";
      this.frontAngle = 0;
      
      // Create a listener for /my_topic
    }

    setFrontAngle(angle) {
      this.frontAngle = angle;
    }
  
    setName(name){
      return this.name = name;
    }
  
    spawn(){
        this.x = Math.random()* (200 - 50) + 50;
        this.y =  Math.random()* (200 - 50) + 50;
    }
  
    move() {
     /* let frontX = this.x + this.radius/2;
    let frontY = this.y;

    let newX = this.x + this.speed;

    // Check if the new position is within the canvas width
    if (newX + this.radius <= width) {
      this.x = newX;
    } else {
      this.x = width - this.radius; // Set the x-coordinate to the rightmost position within the canvas
      this.frontAngle += HALF_PI; // Rotate by 90 degrees
    }*/

      this.velocity = this.velx;
    
      let movementX = cos(this.frontAngle) * this.velocity;
      let movementY = sin(this.frontAngle) * this.angz;
  
      this.x += movementX;
      this.y += movementY;
      this.frontAngle += 0.009;
      
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

    movement_subscribe(topic){
      
      topic.subscribe(function(message){
        for(let i = 0; i< entities.length; i++){
          if(topic.name == "agent"+(i+1)+"/position")
           // console.log(topic.name);
            entities[i].velx = message.linear.x;
            entities[i].angz = message.angular.z;
        }
      });
    }

    show() {
      stroke(255);
      fill(204, 102, 0);

      push(); // Save the current drawing state
      translate(this.x, this.y); // Set the origin to the center of the circle
      rotate(this.frontAngle); // Apply the rotation

      ellipse(0, 0, this.radius, this.radius);
      textSize(50);
      text(this.name, -20, 0);

      let frontX = this.radius / 2;
      let frontY = 0;

      fill(255, 0, 0);
      triangle(frontX - 5, frontY + 10, frontX + 15, frontY, frontX - 5, frontY - 10);

      pop(); // Restore the previous drawing state
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

    selected(){

      for(let i = 0; i< entities.length; i++){
        let d = dist(mouseX,mouseY, entities[i].x, entities[i].y);
        if(d < entities[i].radius){
         alert("agent "+entities[i].name+ " selected");
         agent_velocity.innerHTML = entities[i].velx;
         agent_name.innerHTML = entities[i].name;

        }
      }
  }

    unsubscribe_from_topic(topic){
      topic.unsubscribe();
    }
  }