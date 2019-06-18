<?php
     /**
     * User: Caesar Tang
     * Date: 16-10-24
     * Info: 记录用户电话
     * 功能：
        记录用户电话
        请求：regist_userphone.php
        {
            "openid":"",
            "phone":""
        }
        返回：
        {
            "code":""             //0：正确；101：参数错误；201：链接数据库出错；202：更新信息出错；300：伪正常；
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
        $phone = $_GET['phone'];

        //判断是否正确,正确放在全局的字典
        if (isset($openid) && isset($phone)) {
            $g_data["openid"] = $openid;
            $g_data["phone"] = $phone;

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


    # 记录用户信息
    function userInfoPhone()
    {
        global $g_data;
        global $g_ret_code;

        $sql = sprintf("SELECT openid from dzpk_user_info WHERE openid='%s';", $g_data["openid"]);
        $query = $g_data["mysqlObj"]->queryDB($sql);
        if($query->num_rows){
            $sql = sprintf("UPDATE dzpk_user_info SET phone='%s' WHERE openid='%s';",
                $g_data["phone"], $g_data["openid"]);
            $query = $g_data["mysqlObj"]->operateDB($sql);
            if($query > -1){
                $g_ret_code = "0";
            }else{
                $g_ret_code = "202";
            }
        }else{
            $g_ret_code = "202";
        }
    }


    # 返回信息
    function PackRes()
    {
        global $g_ret_code;
        global $g_ret_msg;

        $res = array("code"=>$g_ret_code);
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
                userInfoPhone();
            }
            closeMysqlDB();
        }
        # 返回信息
        PackRes();
    }


    main();

?>



