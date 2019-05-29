import testImage from '../assets/logo.png'
export default function PrintHTML (cartList, totalNum, totalPrice) {
  let stringElement =
    '<div style="display:flex;font-weight:bold;"> <div style="flex:6;">商品</div><div style="flex:2;">数量</div><div style="flex:2;">价格</div></div>'
  for (const item of cartList) {
    let stringExtra = '<div style="display:flex;flex-wrap: wrap;" >'
    let eachFoodPrice = item.price * item.num
    for (const extra of item.extra) {
      stringExtra += `<div style="margin:0 5px 0 5px;">${extra.name}</div>`
    }
    stringExtra += '</div>'

    stringElement += `<div><div style="display:flex;margin-top:10px;font-weight:bold;font-size:28px"> <div style="flex:6;">${
      item.nameWithSpecs
    }</div><div style="flex:2;">${
      item.num
    }</div><div style="flex:2;">${eachFoodPrice.toFixed(
      2
    )}</div></div>${stringExtra}</div>`
  }
  stringElement += `<div style="display:flex;margin-top:20px;font-weight:bold;"> <div style="flex:5;"></div><div style="flex:2;">数量:${totalNum}</div><div style="flex:3;">总计:${totalPrice}元</div></div>`

  var mywindow = window.open('', '_blank', 'height=400,width=600')

  mywindow.document.write('<html><head><title>' + document.title + '</title>')
  mywindow.document.write('</head><body >')
  mywindow.document.write('<h1 align="center">Stephen Curry is best</h1>')
  mywindow.document.write(
    `<img src="${testImage}" alt="Trulli" width="500" height="333">`
  )
  // mywindow.document.write(document.getElementById(elem).innerHTML)
  mywindow.document.write(stringElement)
  mywindow.document.write('</body></html>')

  mywindow.document.close() // necessary for IE >= 10
  mywindow.focus() // necessary for IE >= 10*/
  setTimeout(() => {
    mywindow.print()
    mywindow.close()
  }, 0.5)

  return true
}
