import json
from datetime import datetime
from typing import Any, Dict, List

def format_datetime(dt: datetime) -> str:
    """Format datetime to ISO string"""
    return dt.isoformat() if dt else None

def safe_json_loads(data: str) -> Any:
    """Safely parse JSON string"""
    try:
        return json.loads(data)
    except (json.JSONDecodeError, TypeError):
        return None

def validate_email(email: str) -> bool:
    """Basic email validation"""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_string(text: str) -> str:
    """Sanitize user input string"""
    if not text:
        return ""
    # Remove potentially dangerous characters
    return text.strip()[:1000]  # Limit length

def create_error_response(message: str, status_code: int = 400) -> Dict[str, Any]:
    """Create standardized error response"""
    return {
        "error": message,
        "status_code": status_code,
        "timestamp": format_datetime(datetime.utcnow())
    }

def create_success_response(data: Any, message: str = "Success") -> Dict[str, Any]:
    """Create standardized success response"""
    return {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": format_datetime(datetime.utcnow())
    } 