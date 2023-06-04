import rclpy
from rclpy.node import Node
import threading
from geometry_msgs.msg import Twist

import time

class Tester(Node):

    def __init__(self):
       
        self.initializer()
        
    def initializer(self):
        # Dynamically subscribe to 10 topics
        for i in range(10):
            super().__init__(node_name = "agent"+str(i))
            time.sleep(1)
            self.cmd_vel_sub = self.create_subscription(Twist, "agent"+str(i)+"/cmd_vel",self.listener_callback,10)
            
            
    
    def start(self):
        threading.Thread(target=self.initializer).start()
    def on_message(msg, topic_num = 0):
        print("Received a message on topic number %d:" % topic_num, msg)


    def listener_callback(self, msg):
        self.velx = msg.linear.x
        self.vely = msg.angular.z

def main(args=None):
    # boilerplate verbose ros2 stuff
    rclpy.init(args=args)
    node = Tester()
   
    rclpy.spin(node)
    
    rclpy.shutdown()

if __name__ == '__main__':
    main()