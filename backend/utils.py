# coding: utf-8
# 主要工作: 验证码发送和验证

import redis.asyncio as aioredis
import os
import uuid
import json
import logging
from dotenv import load_dotenv
from aliyunsdkdysmsapi.request.v20170525 import SendSmsRequest
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.profile import region_provider

# 加载环境变量
load_dotenv()

# 配置logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
)

# 从环境变量获取配置
ALIYUN_ID = os.environ.get("ALIYUN_ID")
ALIYUN_KEY = os.environ.get("ALIYUN_KEY")
ALIYN_SMS = os.environ.get("ALIYN_SMS")
ALIYN_SMS_SINATURE = os.environ.get("ALIYN_SMS_SINATURE")

# 阿里云短信配置
# 注意：不要更改
REGION = "cn-hangzhou"
PRODUCT_NAME = "Dysmsapi"
DOMAIN = "dysmsapi.aliyuncs.com"

# 初始化阿里云客户端
acs_client = AcsClient(ALIYUN_ID, ALIYUN_KEY, REGION)
region_provider.add_endpoint(PRODUCT_NAME, REGION, DOMAIN)


# 发短消息
def _send_sms(business_id, phone_numbers, sign_name, template_code, template_param=None):
	smsRequest = SendSmsRequest.SendSmsRequest()
	# 申请的短信模板编码,必填
	smsRequest.set_TemplateCode(template_code)

	# 短信模板变量参数
	if template_param is not None:
		smsRequest.set_TemplateParam(template_param)

	# 设置业务请求流水号，必填。
	smsRequest.set_OutId(business_id)

	# 短信签名
	smsRequest.set_SignName(sign_name)

	# 数据提交方式
	# smsRequest.set_method(MT.POST)

	# 数据提交格式
	# smsRequest.set_accept_format(FT.JSON)

	# 短信发送的号码列表，必填。
	smsRequest.set_PhoneNumbers(phone_numbers)

	# 调用短信发送接口，返回json
	smsResponse = acs_client.do_action_with_exception(smsRequest)

	# TODO 业务处理

	return smsResponse


# 发送验证码
def send_validate_code(phone, code):
	__business_id = str(uuid.uuid1())
	params = {"code": code}
	params = json.dumps(params)
	print(params)
	# backup_sms(phone, code)
	resp = _send_sms(__business_id, phone, ALIYN_SMS_SINATURE, ALIYN_SMS, params)
	logging.info(resp)
	# 返回格式:
	# {"Message":"OK","RequestId":"84208E60-794B-4564-A7AF-43FE7A728C07","BizId":"333513525009179680^0","Code":"OK"}
	try:
		resp = json.loads(resp)
		if resp.get('Code', '') == 'OK':
			return True
		else:
			return False
	except Exception as e:
		logging.exception(e)
		return False

REDIS_HOST = os.environ.get("REDIS_HOST")
redis = aioredis.from_url(
    REDIS_HOST,
    encoding="utf-8",
    decode_responses=True,
    retry_on_timeout=True,
    socket_keepalive=True,
    health_check_interval=60,
    # 添加以下参数
    socket_timeout=30.0,           # 设置socket操作超时时间
    socket_connect_timeout=10.0,   # 设置连接超时时间
    max_connections=100,           # 设置连接池最大连接数
    # min_connections=5,             # 设置连接池最小连接数
    # max_retries=3,                # 设置最大重试次数
    # retry_on_error=[              # 设置需要重试的错误类型
    #     ConnectionError,
    #     TimeoutError,
    #     ConnectionResetError
    # ]
)

async def save_code(phone, code, expire=300):
	# 保存验证码到redis, 5分钟超时
    try:
        await redis.set(f"aido:{phone}", code, ex=expire)
        logging.info("Success: redis set code")
    except Exception as e:
        logging.error(f"Redis save_code error: {e}")
        raise

# 验证验证码
async def validate_code(phone, code):
    try:
        the_code = await redis.get(f"aido:{phone}")
        logging.info(f"Retrieved code for {phone}: {the_code}, expected: {code}")
        return the_code == code
    except Exception as e:
        logging.error(f"Redis validate_code error: {e}")
        raise


if __name__ == "__main__":
	send_validate_code("15202893162", "123456")
	