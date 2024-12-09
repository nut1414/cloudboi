import pylxd
from base_adapter import BaseAdapter

class MAASLXDAdapter(BaseAdapter):
  def __init__(self, endpoint='https://127.0.0.1:8443', verify=False):
    self.client = pylxd.Client(endpoint=endpoint, verify=verify)

  def list_containers(self):
    return [container.name for container in self.client.containers.all()]

  def create_container(self, name, image_alias):
    config = {
      'name': name,
      'source': {
        'type': 'image',
        'alias': image_alias,
      },
    }
    container = self.client.containers.create(config, wait=True)
    return container

  def start_container(self, name):
    container = self.client.containers.get(name)
    container.start(wait=True)
    return container

  def stop_container(self, name):
    container = self.client.containers.get(name)
    container.stop(wait=True)
    return container

  def delete_container(self, name):
    container = self.client.containers.get(name)
    # check if there is container
    if container:
      
      container.delete(wait=True)
    
  def connect_instance(self, name):
    container = self.client.containers.get(name)
    return container.execute(["/bin/bash"], stdin=True, stdout=True)

# Example usage
if __name__ == "__main__":
  adapter = MAASLXDAdapter()
  print("Available containers:", adapter.list_containers())
  adapter.create_container("test-container", "ubuntu/20.04")
  adapter.start_container("test-container")
  print("Started container 'test-container'")
  adapter.stop_container("test-container")
  print("Stopped container 'test-container'")
  adapter.delete_container("test-container")
  print("Deleted container 'test-container'")