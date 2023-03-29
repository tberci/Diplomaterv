#!/usr/bin/env python3

import random
import time
from std_msgs.msg import String
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist


class MyNode(Node):
    def __init__(self):
        super().__init__("agent")
        
       
        self.new_agent = self.create_publisher(String,"/new_agent" , 10)   #A harmadik egy buffer
        self.cmd_vel_pub = self.create_publisher(Twist,"/cmd_vel" , 10)   #A harmadik egy buffer.
        self.cmd_vel2_pub = self.create_publisher(Twist,"/cmd_vel2" , 10)

    
        msg = String()
        msg.data = "kutya"
        time.sleep(1)
        self.new_agent.publish(msg)

        self.timer = self.create_timer(0.5, self.send_velocity) #timer híni fogja a send_velocity funkciót 0.5 ms-n ként
        self.timer2 = self.create_timer(0.5, self.send_velocity2) #timer híni fogja a send_velocity funkciót 0.5 ms-n ként
        self.get_logger().info("Draw circle node has been started")
        
    def send_velocity(self):
        msg = Twist() 
        msg.linear.x = random.uniform(1.5, 5.1)
        msg.angular.y = 1.0
        self.cmd_vel_pub.publish(msg)


    def send_velocity2(self):
        msg = Twist() 
        msg.linear.x = random.uniform(-2.0, 0.5)
        msg.angular.y = 3.0
        self.cmd_vel2_pub.publish(msg)    

def main(args=None):
    rclpy.init(args=args)

    #node here
    node = MyNode()
    rclpy.spin(node) #spin életbentartja a nodeot. Futni fog amíg lenem állíjuk.


    rclpy.shutdown()

if __name__ == '__main__':
    main()