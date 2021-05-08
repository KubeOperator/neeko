import el from "element-ui/lib/locale/lang/en";
import fu from "fit2cloud-ui/src/locale/lang/en_US"; // 加载fit2cloud的内容

const message = {
  commons: {
    message_box: {
      alert: "Warning",
      confirm: "Confirm",
      prompt: "Prompt"
    },
    dialog: {
      delete: "Delete"
    },
    confirm_message: {
      delete: "This operation cannot be undone, do you want to continue?",
      uncordon: "This operation will restore the node to a schedulable state. Do you want to continue?",
    },
    button: {
      login: "Login",
      ok: "Ok",
      save: "Save",
      delete: "Delete",
      import: "Import",
      batch_import: "Batch Import",
      upgrade: "Upgrade",
      check: "Diagnostic",
      cancel: "Cancel",
      return: "Return",
      create: "Create",
      confirm: "Confirm",
      edit: "Edit",
      sync: "Sync",
      enable: "Enable",
      disable: "Disable",
      jump_to: "Go to",
      search: "Search",
      verify: "Verify",
      management: "Management",
      submit: "Submit",
      refresh: "Refresh",
      authorize: "Authorize",
      revoke_authorize: "Cancel authorization",
      getBucket: "Get bucket",
      update: "Update",
      upload: "Upload",
      retry: "Retry",
      history: "History",
      error_msg: "Error",
      lock: "Enable/Disable",
      relation: "Associate",
      cordon: "Disperse",
      uncordon: "Resume to disperse",
      log: "Log"
    },
  }
}

export default {
  ...el,
  ...fu,
  ...message
};

