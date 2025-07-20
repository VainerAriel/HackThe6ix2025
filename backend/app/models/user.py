from datetime import datetime
from typing import Optional, Dict, Any, List

class User:
    def __init__(self, auth0_id: str, name: str, email: str, username: str, 
                 picture: Optional[str] = None, QuestionnaireData: Optional[Dict[str, Any]] = None):
        self.auth0_id = auth0_id
        self.name = name
        self.email = email
        self.username = username
        self.picture = picture
        self.QuestionnaireData = QuestionnaireData or {}
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'auth0_id': self.auth0_id,
            'name': self.name,
            'email': self.email,
            'username': self.username,
            'picture': self.picture,
            'QuestionnaireData': self.QuestionnaireData,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        user = cls(
            auth0_id=data['auth0_id'],
            name=data['name'],
            email=data['email'],
            username=data['username'],
            picture=data.get('picture'),
            QuestionnaireData=data.get('QuestionnaireData', {})
        )
        # Set timestamps from data if available, otherwise use current time
        if 'created_at' in data:
            user.created_at = data['created_at']
        if 'updated_at' in data:
            user.updated_at = data['updated_at']
        return user 
