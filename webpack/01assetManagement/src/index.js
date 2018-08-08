import _ from 'lodash'
import './style.css'
import Icon from './icon.jpg'
import Data from './data.xml'

function component () {
  let element = document.createElement('h1')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  element.classList.add('hello')
  let myIcon = new Image()
  myIcon.src = Icon
  element.appendChild(myIcon)
  console.log(Data)
  return element
}

document.body.appendChild(component())
