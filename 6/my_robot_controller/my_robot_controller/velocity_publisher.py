#!/usr/bin/env python3

import random
import time
from std_msgs.msg import String
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist


class MyNode(Node):
    def __init__(self):
        super().__init__("velocity")
        self.topic_name = ""


        self.topics = []
        self.listener = self.create_subscription(String, "/new_agent",self.listener_callback,10)
        
        self.cmd_vel_timer = self.create_timer(5, self.getTopics)

    def listener_callback(self, msg):
         self.get_logger().info('Getting: "%s"' % msg.data)
         self.topic_name  = msg.data
         print(self.topic_name)
         
         #self.create_subscription(Twist, self.topic_name+"/cmd_vel",self.generate_callback(self.topic_name),10)

         
         self.topics.append(msg.data)
         for i in self.topics:
           
            print(i)    
      
    def getTopics(self):
            for i in self.topics:
                print(i)
                print("size: " + str(len(self.topics)))

    
    def generate_callback(self,topic_name):
        return lambda msg  : self.cmd_vel_callback(msg, topic_name)
    


    def cmd_vel_callback(self, msg, topic_name):
        self.get_logger().info("x : " + str(msg.linear.x) + " y : "+ str(msg.angular.z) + " from " + str(topic_name) )
        
def main(args=None):
    rclpy.init(args=args)

    #node here
    node = MyNode()
    
    rclpy.spin(node) #spin életbentartja a nodeot. Futni fog amíg lenem állíjuk.


    rclpy.shutdown()

if __name__ == '__main__':
    main()