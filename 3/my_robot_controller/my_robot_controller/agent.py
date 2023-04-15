#!/usr/bin/env python3

import random
import time
from std_msgs.msg import String
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Float32

class MyNode(Node):

    def __init__(self):
        super().__init__('agent1')
        self.value = input("Please enter a string:\n")
        self.velx = 0.0
        self.vely = 0.0

        self.x = 0.0
        self.y = 0.0
       
        self.new_agent = self.create_publisher(String,"/new_agent" , 10)   #A harmadik egy buffer
        self.cmd_vel_pub = self.create_publisher(Twist,"agent"+self.value+"/cmd_vel",10) # ágens pozicio
        self.timer = self.create_timer(0.5, self.agent_velocity_pub)

        self.get_logger().info("Agent node has been started")

         
        

       # self.cmd_vel_sub = self.create_subscription(Twist, 'cmd_vel',self.listener_callback,10)
        
        self.position_sub = self.create_subscription(Twist,'position',self.position_callback,10)
     
        self.distance_sub = self.create_subscription(Float32,'distance',self.distance_callback,10)
        
    def listener_callback(self, msg):
        self.velx = msg.linear.x
        self.vely = msg.angular.z


    def position_callback(self, msg):
        self.x = msg.linear.x
        self.y = msg.angular.z

 

    def distance_callback(self, msg):
         self.get_logger().info('Getting: "%s"' % msg.data)
    
    def agent_velocity_pub(self):
        msg = Twist() 
       
        # Linear velocity in the x-axis.
        if(self.value == "3"):
          msg.linear.x = random.uniform(-5, -10)       
        else:
          msg.linear.x = random.uniform(1.5, 5.1)
        
        
        msg.linear.y = 0.0
        msg.linear.z = 0.0
 
               # Angular velocity in the z-axis.
        msg.angular.x = 0.0
        msg.angular.y = 0.0
        msg.angular.z = random.uniform(2.0, 0.5)
        self.cmd_vel_pub.publish(msg)

    def create_agent(self):
        msg = String()
        msg.data = "agent"+self.value
        
        self.new_agent.publish(msg)

   
def main(args=None):
    rclpy.init(args=args)

    #node here
    node = MyNode()
   
    node.create_agent()
               
    rclpy.spin(node) #spin életbentartja a nodeot. Futni fog amíg lenem állíjuk.


    rclpy.shutdown()

if __name__ == '__main__':
    main()