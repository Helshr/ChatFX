# 数据库相关的服务
import json
from typing import Optional, Dict, Any
from mysql_lib import User, fetch_one
from sqlalchemy import select

# 根据 user_id 获取 user 信息
async def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    """
    根据 user_id 获取 user 信息
    
    Args:
        user_id: 用户ID
    """
    user = await fetch_one(select(User).where(User.id == user_id))
    return user