import Global from "@/utils/global_variable"
import i18n from "@/i18n"

var checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(i18n.t("commons.form.required_msg")))
  }
  if (!Global.NamePattern.test(value)) {
    return callback(new Error(i18n.t("automatic.vm_config.name_validate_msg")))
  }
  callback()
}


const RequiredRule = { required: true, trigger: "blur", message: i18n.t("commons.form.required_msg") }
const NameRule = { validator: checkName, required: true, trigger: "blur" }
export default {
  NameRule, RequiredRule
}