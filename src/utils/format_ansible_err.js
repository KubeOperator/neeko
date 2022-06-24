export function ansibleErrFormat(str) {
  let formatMsgs = [];
  if (!isJson(str)) {
    return [
      { name: "Error Message", info: str, failed: false, type: "unFormat" }
    ];
  }
  var json1 = JSON.parse(str);
  for (const key in json1) {
    var itemMsg = { name: "", info: {}, failed: false };
    itemMsg.name = key;
    if (isJson(json1[key])) {
      var json2 = JSON.parse(json1[key]);
      itemMsg.info = json2;
      if (itemMsg.info.msg) {
        itemMsg.info.msg = itemMsg.info.msg.replace(/\t/g, "").trim();
      }
      if (itemMsg.info.stdout) {
        itemMsg.info.stdout = itemMsg.info.stdout.replace(/\t/g, "").trim();
      }
      if (itemMsg.info.stderr) {
        itemMsg.info.stderr = itemMsg.info.stderr.replace(/\t/g, "").trim();
      }
      if (itemMsg.info.unreachable) {
        itemMsg.failed = true;
      } else {
        itemMsg.failed = json2.failed;
      }
    } else {
      itemMsg.type = "unFormat";
      itemMsg.info = json1[key];
    }
    if (itemMsg.info.length !== 0) {
      formatMsgs.push(itemMsg);
    }
  }
  return formatMsgs;
}

function isJson(str) {
  try {
    if (typeof JSON.parse(str) === "object") {
      return true;
    }
  } catch {
    return false;
  }
}
