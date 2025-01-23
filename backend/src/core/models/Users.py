from pydantic import BaseModel


class User(BaseModel):
  username: str

class TestModel(BaseModel):
  test_response: int
  test_response2: int