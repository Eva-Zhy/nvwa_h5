/*
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dzpk_user_info`
-- ----------------------------
DROP TABLE IF EXISTS `dzpk_user_info`;
CREATE TABLE `dzpk_user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openid` varchar(64) NOT NULL COMMENT '用户openid',
  `nickname` varchar(64) DEFAULT NULL COMMENT '用户昵称',
  `avatar` varchar(256) DEFAULT NULL COMMENT '用户头像',
  `sex` varchar(64) DEFAULT NULL COMMENT '用户性别',
  `country` varchar(64) DEFAULT NULL COMMENT '国籍',
  `province` varchar(64) DEFAULT NULL COMMENT '省份',
  `city` varchar(64) DEFAULT NULL COMMENT '城市',
  `phone` varchar(64) DEFAULT NULL COMMENT '电话',
  `insert_time` datetime DEFAULT NULL COMMENT '信息插入日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dzpk_user_info
-- ----------------------------
