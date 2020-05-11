#!/bin/bash
cur_dir=`old=\`pwd\`; cd \`dirname $0\`; echo \`pwd\`; cd $old;`
env=$1
prj=broker-node

prj_dir=/data/www/$prj
cdn_dir=/data/www/broker/uploads/
dep_dir=/data/deploy_www/$prj.dep.`date +%Y%m%d_%H%M%S`

if [ -z "$env" ]; then
	echo "Usage: $0 ENV"
	echo "    ENV: dev, online"
	exit 1
fi
function deploy_dev()
{
    mkdir -p /data/applogs/$prj
	chmod ugo+rwx /data/applogs /data/applogs/$prj

    rm -f $prj_dir
	ln -sf $cur_dir $prj_dir

    export NODE_ENV='development'
}

function deploy_online()
{
    # 静态文件cdn
    ts-node ./server/utils/CdnStatic.ts
    echo 'update assets_md5.json done'
    git add server/assets_md5.json
    git commit -m "online update assets_md5.json"
    git push
    echo '已更新git仓库assets_md5.json文件'

    mkdir -p /data/applogs/$prj
	chmod ugo+rwx /data/applogs /data/applogs/$prj

    mkdir -p /data/deploy_www
	chmod ugo+rx /data/deploy_www

	echo "copy files..."
	rsync -a --exclude '.*' $cur_dir/ $dep_dir/
    
	if [ $? -ne "0" ]; then
		echo "Failed to deploy project!"
		exit 1
	fi
	chmod ugo+rx $dep_dir

	echo "create links..."
	# 将项目软链到当前版本
	rm -f $prj_dir
	ln -sf $dep_dir $prj_dir
}

echo ""
echo "#######################################"
echo "Project: $prj"
echo "Env    : $env"
echo ""

if [ "$env" = "online" ]; then
    
	deploy_online
else
    
	deploy_dev
fi

if [  -z "$usr" ]; then
    $prj_dir/server.sh $env
fi

echo ""
echo "done."
echo "#######################################"
echo ""