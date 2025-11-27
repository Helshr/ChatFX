#!/usr/bin/env python3
"""
将带透明通道的 WebM (VP9) 转换为 MOV (ProRes 4444)
保留透明度，正确处理 alpha 通道
"""
import subprocess
import sys
import os

def convert_webm_to_mov(input_file, output_file):
    """
    使用 ffmpeg 将 WebM 转换为 MOV，保留透明通道
    
    参数:
        input_file: 输入的 WebM 文件路径
        output_file: 输出的 MOV 文件路径
    """
    # 优化方案：使用 ProRes 4444 但降低位深度和质量
    # 如需更小文件，可改用 profile:v 3 (ProRes 422 HQ，无alpha) 或 2 (ProRes 422)
    cmd = [
        'ffmpeg',
        '-c:v', 'libvpx-vp9',      # 使用 libvpx-vp9 解码器正确读取 VP9 alpha
        '-i', input_file,
        '-c:v', 'prores_ks',       # 使用 ProRes 编码器
        '-profile:v', '4444',       # ProRes 4444 profile (支持 alpha)
        '-quant_mat', 'default',    # 使用默认量化矩阵 (比 hq 文件小)
        '-qscale:v', '9',           # 质量控制 (0-32，值越大文件越小，建议8-12)
        '-vendor', 'apl0',          # Apple 厂商代码
        '-pix_fmt', 'yuva444p',     # 像素格式：YUV 4:4:4 + alpha，8-bit (比10-bit小)
        '-y',                       # 覆盖已存在的文件
        output_file
    ]
    
    print(f"正在转换: {input_file} -> {output_file}")
    print("使用编码: ProRes 4444 (支持透明通道)")
    print("-" * 60)
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("\n✓ 转换成功！")
        
        # 显示文件信息
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # MB
        print(f"\n文件信息:")
        print(f"  输出文件: {output_file}")
        print(f"  文件大小: {file_size:.1f} MB")
        
        # 显示视频信息
        probe_cmd = [
            'ffprobe', '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=codec_name,pix_fmt,width,height',
            '-of', 'default=noprint_wrappers=1',
            output_file
        ]
        probe_result = subprocess.run(probe_cmd, capture_output=True, text=True)
        print(f"\n视频信息:")
        print(probe_result.stdout)
        
        return True
    else:
        print("\n✗ 转换失败！")
        print(f"错误信息:\n{result.stderr}")
        return False

if __name__ == '__main__':
    # 默认转换 b.webm 到 b.mov
    input_file = '8M.webm'
    output_file = '8M.mov'
    
    # 支持命令行参数
    if len(sys.argv) >= 2:
        input_file = sys.argv[1]
    if len(sys.argv) >= 3:
        output_file = sys.argv[2]
    
    # 检查输入文件是否存在
    if not os.path.exists(input_file):
        print(f"错误: 找不到输入文件 '{input_file}'")
        sys.exit(1)
    
    print("=" * 60)
    print("WebM 到 MOV 转换工具 (保留透明通道)")
    print("=" * 60)
    
    # 执行转换
    success = convert_webm_to_mov(input_file, output_file)
    
    sys.exit(0 if success else 1)

