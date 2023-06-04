import rclpy
from rclpy.node import Node

from std_msgs.msg import Float32


class Distance_Listener(Node):

    def __init__(self):
        super().__init__('distance_listener')
        self.subscription = self.create_subscription(
            Float32,
            'distance',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info('I heard: "%lf"' % msg.data)


def main(args=None):
    rclpy.init(args=args)

    distance = Distance_Listener()

    rclpy.spin(distance)

    
    distance.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()