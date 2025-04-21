def insert_blank_line_in_file(file_path):
    # 尝试以 'utf-8' 编码打开文件
    try:
        with open(file_path, 'r', encoding='utf-8') as infile:
            lines = infile.readlines()

        with open(file_path, 'w', encoding='utf-8') as outfile:
            for line in lines:
                outfile.write(line)
                outfile.write('\n')  # 写入空行
    except UnicodeDecodeError:
        print(f"无法以 'utf-8' 编码打开文件 {file_path}，尝试使用其他编码格式。")
        # 如果 UTF-8 解码失败，尝试以 'gbk' 编码打开
        with open(file_path, 'r', encoding='gbk') as infile:
            lines = infile.readlines()

        with open(file_path, 'w', encoding='gbk') as outfile:
            for line in lines:
                outfile.write(line)
                outfile.write('\n')  # 写入空行


# 示例调用
insert_blank_line_in_file('chapters/2.txt')
