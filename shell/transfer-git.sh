# 使用说明：
# 1. 创建一个文件夹
# 2. 把该脚本放到刚创建的文件夹中
# 3. 将要处理的项目复制一份到该文件家下
# 4. 修改变量
#    foldderName 项目文件夹名称
#    newGitUrl 新git地址




# 变量
foldderName='learning-project'
newGitUrl='https://github.com/ruicky/learning-project.git'


cd ./$foldderName

# 下载最新的代码
git fetch
git pull

echo '---old---'
git remote -v

git remote set-url origin $newGitUrl

echo '---new---'
git remote -v

for BRANCH in `git branch -r|sed 's/\*//g'`;
  do 
    echo 'old---'$BRANCH
    tempBanch=${BRANCH:7}
    # echo $tempBanch
    if [ "$tempBanch" != "HEAD" ] && [ "$tempBanch" ];then
    echo $tempBanch
    git checkout $tempBanch
    git pull 
    git branch --set-upstream-to=origin/$tempBanch $tempBanch
    git push -u origin $tempBanch
    fi

    
  done
git checkout master;

# 如果需要同时推送两个分支修改 
# vim ./learning-project/.git/config 中 [remote "origin"] 下面增加一行url
# url = https://github.com/ruicky/learning-project.git