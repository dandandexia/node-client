env=$1
prj=node
prj_dir=/data/www/$prj

function restart_node()
{
    pm2 reload all
    # pm2 start $prj_dir/pm2.json
}

function restart_node_dev()
{   
    pm2 reload all
    # pm2 start $prj_dir/pm2_dev.json
}

if [ "$env" = "online" ] ; then
    restart_node
else
    restart_node_dev
fi