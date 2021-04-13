import Global from "@/utils/global_variable"
import i18n from "@/i18n"

var ipaddr = require("ipaddr.js")

var checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(i18n.t("commons.validate.required_msg")))
  }
  if (!Global.NamePattern.test(value)) {
    return callback(new Error(i18n.t("automatic.validate.name_validate_msg")))
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

const RequiredRule = { required: true, trigger: "blur", message: i18n.t("commons.form.required_msg") }
const NameRule = { validator: checkName, required: true, trigger: "blur" }
const IpRule = { validator: checkIp, required: true, trigger: "blur" }
const EmailRule = { type: "email", message: i18n.t("commons.validate.email") }
export default {
  NameRule, RequiredRule, EmailRule, IpRule
}