from my_robot_controller.agent import Agent
import rclpy
from rclpy.node import Node
import threading
from std_msgs.msg import Int16
from subprocess import Popen, PIPE
from rclpy.executors import MultiThreadedExecutor

count = 0
nodes = []
class Spawner(Node):

    def __init__(self, name, executor):
        super().__init__(name)
        
        self.executor = executor
        self.name = name
        self.spawn_sub = self.create_subscription(Int16, "/agent_spawn",self.listener_callback,10)
        

    def listener_callback(self, msg):
        global count
        global nodes
        count+= 1
        print(count)
        #cmd_str = "ros2 run my_robot_controller agent_node --ros-args -r __node:=agent"+str(self.count)
        #Popen(['xterm', '-e', cmd_str], stdin=PIPE)
        
        #nodes.append(Agent("agent"+str(count),count))
        self.executor.add_node(Agent("agent"+str(count),count))
        self.get_logger().info("agent"+str(count)+" node has been started")
        print(len(nodes))

    

def main(args=None):
    # boilerplate verbose ros2 stuff
    rclpy.init(args=args)
   
    

    executor = MultiThreadedExecutor(len(nodes)+1)
    
    spawner = Spawner("spawner", executor)

    

    
    executor.spin()
    executor.shutdown()
    rclpy.spin(spawner)
    rclpy.shutdown()

if __name__ == '__main__':
    main()