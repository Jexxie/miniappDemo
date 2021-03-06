import { HTTP } from "../util/http.js"

class ClassicModel extends HTTP {
  getLatest(sCallback) {
    this.request({
      url: "classic/latest",
      success: res => {
        sCallback(res)
        this._setLatestIndex(res.index)
        let key = this._getKey(res.index)
        wx.setStorageSync(key, res)
      }
    })
  }

  // getPrevious(index, sCallback) {
  //   this.request({
  //     url: "classic/" + index + "/previous",
  //     success: res => {
  //       sCallback(res);
  //     }
  //   });
  // }

  // getNext() {

  // }

  getClassic(index, nextOrPrevious, sCallback) {
    // 先缓存中寻找，没有再向服务器请求，写入到缓存
    let key =
      nextOrPrevious == "next"
        ? this._getKey(index + 1)
        : this._getKey(index - 1)
    // console.log("key: ", key)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      this.request({
        // classic/7/previous
        url: `classic/${index}/${nextOrPrevious}`,
        success: res => {
          // console.log("res3: ", res)
          wx.setStorageSync(this._getKey(res.index), res)
          sCallback(res)
        }
      })
    } else {
      sCallback(classic)
    }
  }

  isFirst(index) {
    return index == 1 ? true : false
  }

  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }

  _setLatestIndex(index) {
    wx.setStorageSync("latest", index)
  }

  _getLatestIndex() {
    let index = wx.getStorageSync("latest")
    return index
  }

  _getKey(index) {
    let key = "classic-" + index
    return key
  }
}

export { ClassicModel }
