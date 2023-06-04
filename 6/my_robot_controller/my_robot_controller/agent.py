#!/usr/bin/env python3

import random
import time
from std_msgs.msg import String
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
from std_msgs.msg import Int16
import threading
from rclpy.executors import MultiThreadedExecutor



SPIN_QUEUE = []
class Agent(Node):

    def __init__(self, name, count):
        super().__init__(name)

        self.name = name
        
        self.value = 0
        self.velx = 0.0
        self.vely = 0.0

        self.x = 0.0
        self.y = 0.0
       
        #self.new_agent = self.create_publisher(String,"/new_agent" , 10)   #A harmadik egy buffer
        
        self.cmd_vel_timer = self.create_timer(0.5, self.agent_velocity_pub)
        self.position_timer = self.create_timer(0.5, self.agent_pos)
        self.cmd_vel_pub = self.create_publisher(Twist,"agent"+str(count)+"/cmd_vel",10) # ágens pozicio
        self.position_pub = self.create_publisher(Twist,"agent"+str(count)+"/position",10) # ágens pozicio
        self.cmd_vel_sub = self.create_subscription(Twist, "agent"+str(count)+"/cmd_vel",self.listener_callback,10)
        
       # self.executor_setup()
        #self.spawn_sub = self.create_subscription(Int16, "/agent_spawn",self.new_agent_callback,10)
        #self.position_sub = self.create_subscription(Twist,'position',self.position_callback,10)
     
        #self.distance_sub = self.create_subscription(Float32,'distance',self.distance_callback,10)
        
   # def new_agent_callback(self,msg):
       # global count
        
       # count += 1
       # print(count)
        #cmd_str = "ros2 run my_robot_controller agent_node --ros-args -r __node:=agent"+str(self.count)
        #Popen(['xterm', '-e', cmd_str], stdin=PIPE)
        #threading.Thread(target= Agent(self.name+str(count)) )
       
       # global SPIN_QUEUE
       # SPIN_QUEUE.append(Agent("agent"+str(count)))

        
        #self.get_logger().info("agent"+str(count)+" node has been started")
        
     
    def executor_setup(self):
        executor = MultiThreadedExecutor()
        executor.add_node(self)  
        executor.spin()  
        
    def listener_callback(self, msg):
        self.velx = msg.linear.x
        self.vely = msg.angular.z

    


   # def position_callback(self, msg):
   #     self.x = msg.linear.x
    #    self.y = msg.angular.z

    def agent_pos(self):
        msg = Twist() 
        self.x =  self.velx
        self.y =  self.vely

        msg.linear.x =  self.x
        msg.angular.z =  self.y

        self.position_pub.publish(msg)

    #def distance_callback(self, msg):
    #    self.get_logger().info('Getting: "%s"' % msg.data)
    
    def agent_velocity_pub(self):
        msg = Twist() 
       
        # Linear velocity in the x-axis.
        
        
        msg.linear.x = random.uniform(5.0, 0.5)
        msg.linear.y = 0.0
        msg.linear.z = 0.0
 
               # Angular velocity in the z-axis.
        msg.angular.x = 0.0
        msg.angular.y = 0.0
        msg.angular.z = 1.0
        self.cmd_vel_pub.publish(msg)

   # def create_agent(self):
   #     msg = String()
    #    msg.data = "agent"+self.value
    #    
    #    self.new_agent.publish(msg)

   


def main(args=None):
    rclpy.init(args=args)
    spawner = Agent("spawner")
  
    #for node in SPIN_QUEUE:
       
    
        
    
    rclpy.spin(spawner)
    
    rclpy.shutdown()
    

if __name__ == '__main__':
    main()