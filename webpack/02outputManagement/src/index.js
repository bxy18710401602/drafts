import _ from 'lodash'
import printMe from './print.js'

function component () {
  let element = document.createElement('h1')
  let btn = document.createElement('button')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  btn.innerHTML = '点我看输出'
  btn.onclick = printMe

  element.appendChild(btn)
  
  return element
}

document.body.appendChild(component())
