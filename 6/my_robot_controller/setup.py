from setuptools import setup

package_name = 'my_robot_controller'

setup(
    name=package_name,
    version='0.0.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='user',
    maintainer_email='user@todo.todo',
    description='TODO: Package description',
    license='TODO: License declaration',
    tests_require=['pytest'],
    entry_points={
        'console_scripts': [
            "agent_node = my_robot_controller.agent : main",
            
            "velocity_publisher_node = my_robot_controller.velocity_publisher : main",
            "tester_node = my_robot_controller.tester : main",
            "spawner = my_robot_controller.agent_spawner: main"
        ],
    },
)
