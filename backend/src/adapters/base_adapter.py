from abc import ABC, abstractmethod

class BaseAdapter(ABC):
  @abstractmethod
  def list_instance(self):
    pass

  @abstractmethod
  def create_instance(self, name, image_alias):
    pass

  @abstractmethod
  def start_instance(self, name):
    pass

  @abstractmethod
  def stop_instance(self, name):
    pass

  @abstractmethod
  def delete_instance(self, name):
    pass
