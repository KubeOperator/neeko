import Global from "@/utils/global_variable"
import i18n from "@/i18n"

var ipaddr = require("ipaddr.js")

var checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(i18n.t("commons.validate.required_msg")))
  }
  if (!Global.NamePattern.test(value)) {
    return callback(new Error(i18n.t("commons.validate.name_not_compliant")))
  }
  callback()
}

var checkIp = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(i18n.t("commons.validate.required_msg")))
  }
  if (!ipaddr.isValid(value)) {
    return callback(new Error(i18n.t("commons.validate.ip_error")))
  }
  callback()
}


const RequiredRule = { required: true, trigger: "blur", message: i18n.t("commons.validate.required_msg") }
const NameRule = { validator: checkName, required: true, trigger: "blur" }
const IpRule = { validator: checkIp, required: true, trigger: "blur" }
const EmailRule = { type: "email", message: i18n.t("commons.validate.email") }

// 中文、大小写英文、数字和-
const NumberRule = {
  required: true,
  trigger: "blur",
  min: 1,
  type: "number",
  message: i18n.t("commons.validate.number_limit")
}

// 支持小写英文、数字和- 不能以数字开头
const ClusterNameRule = {
  required: true,
  pattern: Global.ClusterNamePattern,
  message: i18n.t("commons.validate.name_not_compliant"),
  trigger: "blur"
}
// 支持小写英文、数字和-
const CommonNameRule = {
  required: true,
  pattern: Global.StorageNamePattern,
  message: i18n.t("commons.validate.name_not_compliant"),
  trigger: "blur"
}
// 密码规范
const PasswordRule = {
  required: true,
  pattern: Global.PasswordPattern,
  message: i18n.t("commons.validate.password_help"),
  trigger: "blur"
}

const LengthRule = {
  min: 1,
  max: 30,
  message: i18n.t("commons.validate.limit", [1, 30]),
  trigger: "blur"
}
export default {
  NameRule, RequiredRule, EmailRule, IpRule, NumberRule, ClusterNameRule, CommonNameRule, PasswordRule, LengthRule
}