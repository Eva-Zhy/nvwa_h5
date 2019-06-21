<?php

header("Access-Control-Allow-Origin:*");


//全局字典用于存放变量
$g_data = array();
//全局返回值变量
$g_ret_code = "2";

function ParaCheck()
{
	global $g_data;
	global $g_ret_code;
	$code = $_REQUEST['code'];
	if (isset($code)) {
		$g_data["code"] = $code;

		$g_ret_code = "0";
	}
}


function GetToken()
{
    global $g_data;

    //公众账号appid
    $APPID = "wxf6eb5f1d73b4584e";
    //公众账号APPSECRET
    $APPSECRET = "2136d4c7446c8c22461d7ec6c772626f";

	$url = sprintf("https://api.weixin.qq.com/sns/oauth2/access_token?appid=%s&secret=%s&code=%s&grant_type=authorization_code", $APPID, $APPSECRET, $g_data["code"]);
	$resp_contents = file_get_contents($url);

	$resp_json = json_decode($resp_contents, TRUE);

    $g_data["access_token"] = $resp_json["access_token"];
    $g_data["openid"] = $resp_json["openid"];
    $g_data["unionid"] = $resp_json["unionid"];
}


function GetUserInfo()
{
	global $g_data;
	$url = sprintf("https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN", $g_data["access_token"], $g_data["openid"]);
	$resp_contents = file_get_contents($url);
    $g_data["resp_contents"] = $resp_contents;
}


function PackRes()
{
    global $g_ret_code;
    global $g_data;
    $res = array("code"=>$g_ret_code);
    $res["msg"] = $g_data["resp_contents"];
    echo json_encode($res);
    exit();
}


function main()
{
    global $g_ret_code;
    ParaCheck();
    if("0" == $g_ret_code) {
        GetToken();
        GetUserInfo();
    }
    PackRes();
}

main();
?>

