<?php
/**
 * User: Caesart
 * Date: 16-10-25
 * Info: 数据库访问
 * Parms: $localhost, $user, $password, $db
 */

class MysqlDb
{
    protected $mysqli_db = null;

    function __construct($localhost, $user, $password, $db)
    {
        $this->mysqli_db = $this->OpenDbLink($localhost, $user, $password, $db);
    }


    /**
     * 连接数据库
     */
    protected function OpenDbLink($localhost, $user, $password, $db)
    {
        try{
            $mysqli = new mysqli();
            $mysqli->connect($localhost, $user, $password, $db);
            $mysqli->query("SET NAMES utf8");

            return $mysqli;
        }catch (Exception $e){
            $mysqli->close();

            return null;
        }
    }


    /**
     * 查询数据库
     */
    public function queryDB($sql)
    {
        $query = array();
        try{
            $query = $this->mysqli_db->query($sql);
        }catch (Exception $e){
            $this->mysqli_db->close();
        }

        return $query;
    }


    /**
     * 插入或者更新数据库
     */
    public function operateDB($sql)
    {
        $OperateStatus = -1;
        try{
            $this->mysqli_db->query($sql);
            $OperateStatus = $this->mysqli_db -> affected_rows;
        }catch (Exception $e){
            $this->mysqli_db->rollback();
        }

        return $OperateStatus;
    }


    /**
     * 关闭数据库
     */
    public function CloseDbLink()
    {
        $this->mysqli_db->close();
    }

}

