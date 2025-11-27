# MySQL客户端
import os
import uuid
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, func
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
from typing import Any, Union, Optional, List
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import create_engine, Select, Insert, Update, Delete
from dotenv import load_dotenv
import logging

# 配置日志
logging.getLogger("sqlalchemy").setLevel(logging.ERROR)
logging.getLogger("sqlalchemy.engine").setLevel(logging.ERROR)

# 加载环境变量
load_dotenv()
MYSQL_URI = os.environ.get("MYSQL_URI")

# 创建数据库引擎
async_engine = create_async_engine(
    f"mysql+asyncmy://{MYSQL_URI}",
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

# 创建基类
Base = declarative_base()


# 异步session
async def get_async_session():
    """获取异步数据库会话"""
    async with AsyncSession(async_engine) as session:
        yield session


class User(Base):
    """用户表"""
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(36), nullable=True, comment="手机号")
    token = Column(String(255), comment="用户token")
    create_at = Column(DateTime, default=func.now(), comment="创建时间")
    update_at = Column(DateTime, default=func.now(), onupdate=func.now(), comment="更新时间")


class MG(Base):
    """MG作品表"""
    __tablename__ = "mgs"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=False, comment="用户ID")
    code = Column(Text, nullable=False, comment="作品代码")
    prompt = Column(Text, nullable=False, comment="作品提示词")
    create_at = Column(DateTime, default=func.now(), comment="创建时间")
    update_at = Column(DateTime, default=func.now(), onupdate=func.now(), comment="更新时间")


# 异步数据库操作方法
async def fetch_one(select_query: Union[Select, Insert, Update]) -> Optional[dict[str, Any]]:
    """执行查询并返回第一行结果"""
    async with async_engine.begin() as conn:
        cursor = await conn.execute(select_query)
        if isinstance(select_query, Select):
            row = cursor.first()
            return row._asdict() if row else None
        elif isinstance(select_query, Insert):
            last_inserted_id = cursor.inserted_primary_key[0]
            # 获取刚插入的记录
            table = select_query.table
            select_query = table.select().where(table.c.id == last_inserted_id)
            result = await conn.execute(select_query)
            inserted_data = result.fetchone()
            return inserted_data._asdict() if inserted_data else None
        return None


async def fetch_all(select_query: Union[Select, Insert, Update]) -> List[dict[str, Any]]:
    """执行查询并返回所有结果"""
    async with async_engine.begin() as conn:
        cursor = await conn.execute(select_query)
        rows = cursor.all()
        return [r._asdict() for r in rows]


async def execute(select_query: Union[Insert, Update, Delete]) -> None:
    """执行插入、更新或删除操作"""
    async with async_engine.begin() as conn:
        await conn.execute(select_query)


async def execute_and_return(select_query: Insert) -> Optional[dict[str, Any]]:
    """执行插入操作并返回插入的记录"""
    async with async_engine.begin() as conn:
        cursor = await conn.execute(select_query)
        last_inserted_id = cursor.inserted_primary_key[0]
        # 获取刚插入的记录
        table = select_query.table
        select_query = table.select().where(table.c.id == last_inserted_id)
        result = await conn.execute(select_query)
        inserted_data = result.fetchone()
        return inserted_data._asdict() if inserted_data else None


def sqlalchemy_model_to_dict(model):
    """将SQLAlchemy模型转换为字典"""
    if model is None:
        return None
    return {col.name: getattr(model, col.name) for col in model.__table__.columns}

