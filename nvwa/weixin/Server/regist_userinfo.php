<?php
     /**
     * User: Caesar Tang
     * Date: 16-10-24
     * Info: 记录用户信息
     * 功能：
        记录用户信息
        请求：regist_userinfo.php
        {
            "openid":"",
            "nickname":"",
            "avatar":"",
            "sex":"",
            "country":"",
            "province":"",
            "city":""
        }
        返回：
        {
            "code":""             //0：正确；101：参数错误；201：链接数据库出错；202：插入信息出错；300：伪正常；
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
        $nickname = $_GET['nickname'];
        $avatar = $_GET['avatar'];
        $sex = $_GET['sex'];
        $country = $_GET['country'];
        $province = $_GET['province'];
        $city = $_GET['city'];

        //判断是否正确,正确放在全局的字典
        if (isset($openid)) {
            $g_data["openid"] = $openid;
            $g_data["nickname"] = $nickname;
            $g_data["avatar"] = $avatar;
            $g_data["sex"] = $sex;
            $g_data["country"] = $country;
            $g_data["province"] = $province;
            $g_data["city"] = $city;

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
    function userInfo()
    {
        global $g_data;
        global $g_ret_code;

        $sql = sprintf("SELECT openid from dzpk_user_info WHERE openid='%s';", $g_data["openid"]);
        $query = $g_data["mysqlObj"]->queryDB($sql);
        if($query->num_rows){
            $sql = sprintf("UPDATE dzpk_user_info SET nickname='%s', avatar='%s', sex='%s', country='%s', province='%s', city='%s' WHERE openid='%s';",
                $g_data["nickname"], $g_data["avatar"], $g_data["sex"], $g_data["country"], $g_data["province"], $g_data["city"], $g_data["openid"]);
        }else{
            $sql = sprintf("INSERT INTO dzpk_user_info (openid, nickname, avatar, sex, country, province, city, insert_time) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', NOW());",
                $g_data["openid"], $g_data["nickname"], $g_data["avatar"], $g_data["sex"], $g_data["country"], $g_data["province"], $g_data["city"]);
        }
        $query = $g_data["mysqlObj"]->operateDB($sql);
        if($query > -1){
            $g_ret_code = "0";
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
                userInfo();
            }
            closeMysqlDB();
        }
        # 返回信息
        PackRes();
    }


    main();

?>



