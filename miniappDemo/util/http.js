import { config } from "../config.js"

const tips = {
  1: "抱歉，出现一个错误",
  1005: "appkey无效",
  3000: "期刊不存在"
}

class HTTP {
  request(params) {
    let url = config.api_base_url + params.url
    if (!params.method) {
      params.method = "GET"
    }

    wx.request({
      url: url,
      method: params.method,
      data: params.data,
      header: {
        "content-type": "application/json",
        appkey: config.appkey
      },
      success: res => {
        console.log("res: ", res)
        let code = res.statusCode.toString()
        //startsWith & endsWith
        if (code.startsWith("2")) {
          params.success && params.success(res.data)
        } else {
          let error_code = res.data.error_code
          this._show_error(error_code)
        }
      },
      fail: err => {
        this._show_error(1)
      }
    })
  }

  _show_error(error_code) {
    if (!error_code) {
      error_code = 1
    }

    wx.showToast({
      title: tips[error_code] ? tips[error_code] : tips[1],
      icon: "none",
      duration: 2000
    })
  }
}

export { HTTP }
