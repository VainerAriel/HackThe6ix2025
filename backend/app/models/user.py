from datetime import datetime
from typing import Optional, Dict, Any

class User:
    def __init__(self, auth0_id: str, email: str, name: str, picture: Optional[str] = None):
        self.auth0_id = auth0_id
        self.email = email
        self.name = name
        self.picture = picture
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'auth0_id': self.auth0_id,
            'email': self.email,
            'name': self.name,
            'picture': self.picture,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        user = cls(
            auth0_id=data['auth0_id'],
            email=data['email'],
            name=data['name'],
            picture=data.get('picture')
        )
        user.created_at = data.get('created_at', datetime.utcnow())
        user.updated_at = data.get('updated_at', datetime.utcnow())
        return user 