from launch import LaunchDescription
import launch_ros.actions

def generate_launch_description():
    return LaunchDescription([
        launch_ros.actions.Node(package='my_robot_controller', executable='test_node', name = 'agent1', output='screen'),
        launch_ros.actions.Node(package='my_robot_controller', executable='test_node', name = 'agent2', output='screen')
    ])