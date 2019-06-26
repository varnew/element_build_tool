export default function (data) { // data: widgetForm数据
  data = JSON.parse(data)
  let form = {}
  let rules = {}
  data.list.map((item) => {
    form[item.model] = item.defaultValue ? item.defaultValue: ''
  })
}
