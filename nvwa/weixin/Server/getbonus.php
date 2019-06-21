<?php
    /**
     * User: Caesar Tang
     * Date: 16-10-24
     * Info: 查询奖品
     * 功能：
        查询奖品
        请求：getbonus.php
        {
            "openid":""
        }
        返回：
        {
            "code":"" ,            //0：正确；101：参数错误；102：openid未注册；201：链接数据库出错；202：查询信息出错；203:奖券已发完;300：伪正常；
            "msg":{}		        //{"bonus":""}
        }
     */

    header("Content-Type: text/html; charset=utf-8");
    header("Access-Control-Allow-Origin:*");
    require "Config.php";
    require "MysqlClass.php";
    require "Util.php";

    // 全局字典用于存放变量
    $g_data = array();
    // 全局返回值code(默认为'参数错误')
    $g_ret_code = "101";
    // 全局返回msg(默认为'参数错误')
    $g_ret_msg = array();


    // 处理请求参数
    function ParaCheck()
    {
        global $g_ret_code;
        global $g_data;

        $openid = $_GET['openid'];

        //判断是否正确,正确放在全局的字典
        if (isset($openid)) {
            $g_data["openid"] = $openid;

            $g_ret_code = "300";
        }else{
            $g_ret_code = "101";
        }
    }


    # 初始化数据库
    function initMysqlDB()
    {
        global $g_data;
        global $g_ret_code;
        # 获取数据配置信息
        $localhost = Config::LOCALHOST;
        $user = Config::USER;
        $password = Config::PASSWOED;
        $db = Config::DB;
        # 初始化数据连接
        $mysqlObj = new MysqlDb($localhost, $user, $password, $db);
        if($mysqlObj){
            $g_data["mysqlObj"] = $mysqlObj;

            $g_ret_code = "300";
        }else{
            $g_ret_code = "201";
        }

    }


    # 关闭数据库
    function closeMysqlDB()
    {
        global $g_data;
        $g_data["mysqlObj"]->CloseDbLink();
    }


    # 检测用户是否注册
    function checkUser()
    {
        global $g_data;
        global $g_ret_code;

        $sql = sprintf("SELECT openid from dzpk_user_info WHERE openid='%s';", $g_data["openid"]);
        $query = $g_data["mysqlObj"]->queryDB($sql);
        if($query->num_rows){
            $g_ret_code = "300";
        }else{
            $g_ret_code = "102";
        }
    }


    # 查询奖品
    function getBonus()
    {
        global $g_data;
        global $g_ret_code;
        global $g_ret_msg;

        $sql = sprintf("SELECT bonus from dzpk_bonus WHERE openid='%s';", $g_data["openid"]);
        $query = $g_data["mysqlObj"]->queryDB($sql);
        if($query->num_rows){
            while ($row = $query->fetch_assoc()){
                $g_ret_msg["bonus"] = $row["bonus"];
            }
            $g_ret_code = "0";
        }else{
            $sql = sprintf("update dzpk_bonus set openid = '%s' where openid is NULL limit 1;", $g_data["openid"]);
            $query = $g_data["mysqlObj"]->operateDB($sql);
            if($query > 0){
                $sql = sprintf("SELECT bonus from dzpk_bonus WHERE openid='%s';", $g_data["openid"]);
                $query = $g_data["mysqlObj"]->queryDB($sql);
                if($query->num_rows){
                    while ($row = $query->fetch_assoc()){
                        $g_ret_msg["bonus"] = $row["bonus"];
                    }
                    $g_ret_code = "0";
                }else{
                    $g_ret_code = "202";
                }
            }else{
                $g_ret_code = "203";
            }
        }
    }


    # 返回信息
    function PackRes()
    {
        global $g_ret_code;
        global $g_ret_msg;

        $res = array("code"=>$g_ret_code, "msg"=>$g_ret_msg);
        if(empty($g_ret_msg)){
            echo json_encode($res);
        }else {
            echo Util::json_encode($res);
        }
        exit();
    }


    function main()
    {
        global $g_ret_code;
        # 检测参数
        ParaCheck();
        if($g_ret_code == "300"){
            # 初始化数据库
            initMysqlDB();
            if($g_ret_code == "300"){
                checkUser();
            }
            if($g_ret_code == "300"){
                getBonus();
            }
            closeMysqlDB();
        }
        # 返回信息
        PackRes();
    }


    main();

?>



