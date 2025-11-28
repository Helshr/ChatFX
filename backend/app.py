import os
import uuid
import random
import logging
import traceback

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from sqlalchemy import select, insert, update, delete, and_
from fastapi import FastAPI, Header, HTTPException


# 导入数据库模型和工具函数
from mysql_lib import User, fetch_one, execute, execute_and_return
from utils import send_validate_code, save_code, validate_code


FILE_DIR = os.path.join(os.path.dirname(__file__), "temp_files")


if not os.path.exists(FILE_DIR):
    os.makedirs(FILE_DIR)

app = FastAPI(debug=True)

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SendCodeRequest(BaseModel):
    phone: str = Field(..., description="手机号")


class SendCodeResponse(BaseModel):
    success: bool
    message: str


class LoginRequest(BaseModel):
    phone: Optional[str] = Field(None, description="手机号（手机号登录时必填）")
    code: Optional[str] = Field(None, description="验证码（手机号登录时必填）")


class LoginResponse(BaseModel):
    user_id: str
    token: str
    signature: str
    phone: Optional[str] = None
    nickname: Optional[str] = None
    message: str


class LogoutResponse(BaseModel):
    success: bool
    message: str


class DeleteAccountResponse(BaseModel):
    success: bool
    message: str
    deleted_tasks: int
    deleted_reminders: int


def generate_token() -> str:
    """生成用户token"""
    return str(uuid.uuid4())


async def verify_token(token: Optional[str], user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """验证token和user_id并返回用户信息"""
    if not token:
        return None
    
    # 如果提供了user_id，同时验证token和user_id
    if user_id:
        user = await fetch_one(
            select(User).where(and_(User.token == token, User.id == user_id))
        )
    else:
        # 兼容旧版本，只验证token
        user = await fetch_one(
            select(User).where(User.token == token)
        )
    return user


async def get_current_user(
    authorization: Optional[str] = Header(None),
    user_id: Optional[str] = Header(None, alias="X-User-Id")
) -> Dict[str, Any]:
    """获取当前登录用户（验证token和user_id）"""
    if not authorization:
        raise HTTPException(status_code=401, detail="未提供认证信息")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="未提供用户ID")
    
    # 支持 "Bearer token" 格式
    token = authorization
    if authorization.startswith("Bearer "):
        token = authorization[7:]
    
    user = await verify_token(token, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="无效的token或用户ID")
    
    return user


@app.post("/send_code", response_model=SendCodeResponse)
async def send_code(request: SendCodeRequest):
    """发送验证码"""
    try:
        # 正常号码：生成随机验证码
        code = str(random.randint(100000, 999999))
        
        # 保存验证码到Redis（使用哈希值作为key，5分钟有效期）
        await save_code(request.phone, code, expire=300)
        
        success = send_validate_code(request.phone, code)
        
        if success:
            return SendCodeResponse(success=True, message="验证码发送成功")
        else:
            return SendCodeResponse(success=False, message="验证码发送失败")
    except Exception as e:
        logging.error(f"发送验证码失败: {str(e)}")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"发送验证码失败: {str(e)}")


@app.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """验证登录（手机号登录token保持不变）"""
    try:
        # 手机号登录
        if request.phone and request.code:
            logging.info(f"手机号登录: phone={request.phone}")
            
            # 查找用户（根据phone）
            user = await fetch_one(
                select(User).where(User.phone == request.phone)
            )
            logging.info(f"用户查询结果: user_id={user['id'] if user else None}")
            phone_for_response = None
        
        # 手机号登录
        else:
            # 验证验证码
            logging.info(f"验证验证码: phone={request.phone[:8]}..., code={request.code}")
            is_valid = await validate_code(request.phone, request.code)
            logging.info(f"验证码验证结果: {is_valid}")
            
            if not is_valid:
                raise HTTPException(status_code=400, detail="验证码错误或已过期")
            
            # 查找用户（根据phone）
            logging.info(f"查找用户: phone={request.phone}")
            user = await fetch_one(
                select(User).where(User.phone == request.phone)
            )
            logging.info(f"用户查询结果: user_id={user['id'] if user else None}")
            phone_for_response = request.phone

        if user:
            # 用户已存在，使用已有token（支持多端登录）
            user_id = user['id']
            token_to_use = user['token']
            
            await execute(
                update(User)
                .where(User.id == user_id)
                .values(token=token_to_use)
            )
            logging.info(f"用户信息已更新: user_id={user_id}, token={token_to_use}")
        else:
            # 用户不存在，创建新用户
            new_token = generate_token()
            
            # 准备用户数据
            user_values = {
                "token": new_token,
                "phone": request.phone
            }
            logging.info(f"创建新用户(手机号登录): phone={request.phone}")
            
            # 先创建用户以获取user_id
            new_user = await execute_and_return(
                insert(User).values(**user_values)
            )
            user_id = new_user['id']
            logging.info(f"新用户创建成功: user_id={user_id}")
            token_to_use = new_token
        logging.info(f"登录成功: user_id={user_id}, token={token_to_use}")
        
        # 获取最新的用户信息
        updated_user = await fetch_one(
            select(User).where(User.id == user_id)
        )
        
        return LoginResponse(
            user_id=user_id,
            token=token_to_use,
            signature=updated_user.get('signature', ''),
            phone=phone_for_response,
            nickname=updated_user.get('nickname'),
            message="登录成功"
        )
    except HTTPException:
        raise
    except Exception as e:
        # 打印完整的错误堆栈
        logging.error(f"❌ 登录失败: {str(e)}")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"登录失败: {str(e)}\n{traceback.format_exc()}")


@app.post("/logout", response_model=LogoutResponse)
async def logout(user: Dict[str, Any] = Depends(get_current_user)):
    """用户退出登录（清空device_token和signature）"""
    try:
        user_id = user['id']
        logging.info(f"用户退出登录: user_id={user_id}")
        
        # 清空 voip_token、apn_token 和 signature
        await execute(
            update(User)
            .where(User.id == user_id)
            .values(
                token=None
            )
        )
        
        logging.info(f"✅ 用户退出登录成功: user_id={user_id}")
        return LogoutResponse(
            success=True,
            message="退出登录成功"
        )
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"❌ 退出登录失败: user_id={user.get('id', 'unknown')}, error={str(e)}")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"退出登录失败: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
