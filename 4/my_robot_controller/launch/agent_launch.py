from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
import launch_ros.actions
import os
from launch_xml.launch_description_sources import XMLLaunchDescriptionSource
from ament_index_python import get_package_share_directory

def generate_launch_description():
    rosbridge_launch = IncludeLaunchDescription(
    XMLLaunchDescriptionSource(
    os.path.join(get_package_share_directory('rosbridge_server'),'launch/rosbridge_websocket_launch.xml')
        )
    )

    ld = LaunchDescription();

    ld.add_action(rosbridge_launch)

    return ld