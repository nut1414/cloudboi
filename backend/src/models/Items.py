from pydantic import BaseModel

class Item(BaseModel):
  name: str
  price: float


class ResponseMessage(BaseModel):
  message: str
