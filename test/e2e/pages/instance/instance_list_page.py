from playwright.sync_api import Page, expect

from ..base_class import BasePage
from ..common.side_nav_bar import SideNavBar

class InstanceListPage(BasePage):
    path: str = "/user/{username}/instances"
    
    def __init__(self, page: Page, username: str):
        super().__init__(page, self.path.format(username=username))
        
        self.side_nav = SideNavBar(page)
        
        
        
        