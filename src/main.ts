import { isDarkMode } from './utils'

const tooltipEl = document.createElement('div')
const loadingEl = document.createElement('div')

loadingEl.innerHTML = 'Fetching...'
loadingEl.style.cssText = `
    text-align: center;
    margin-top: 40px;
    color: #666;
`

tooltipEl.appendChild(loadingEl)

const CLOSE_TIMEOUT = 300
let timer = 0
let isTooltipShow = false

function createTooltip() {
  tooltipEl.style.cssText = `
    position: absolute;
    width: 500px;
    min-height: 100px;
    max-height: 400px;
    background: ${isDarkMode() ? '#25303e' : '#fff'};
    padding: 20px;
    border: 1px solid ${isDarkMode() ? '#1f2227' : '#e4e7ed'};
    box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
    overflow: auto;
    z-index: 100;
    border-radius: 4px;
    top: 0;
    display: none;
    align-items: center;
  `
  tooltipEl.addEventListener('mouseenter', () => {
    clearTimeout(timer)
  })

  tooltipEl.addEventListener('mouseleave', () => {
    hideTooltip()
  })
  document.body.appendChild(tooltipEl)
}

function hideTooltip() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    tooltipEl.style.display = 'none'
    isTooltipShow = false
  }, CLOSE_TIMEOUT)
}

function showTooltip() {
  tooltipEl.style.display = 'block'
  isTooltipShow = true
}

async function getContent(tid: string) {
  try {
    tooltipEl.innerHTML = ''
    tooltipEl.appendChild(loadingEl)
    let domString = ''
    if (sessionStorage.getItem(`v2ex-${tid}`)) {
      domString = sessionStorage.getItem(`v2ex-${tid}`)!
    }
    else {
      const response = await fetch(`https://www.v2ex.com/t/${tid}`)
      domString = await response.text()
      sessionStorage.setItem(`v2ex-${tid}`, domString)
    }

    const domParser = new DOMParser()
    const dom = domParser.parseFromString(domString, 'text/html')
    const content = dom.querySelector('#Main > .box')
    tooltipEl.innerHTML = ''
    tooltipEl.append(content!)
  }
  catch (error) {
    console.log('🚀 v2ex-topic-tooltip error', error)
  }
}

function main() {
  document.querySelectorAll('.item_title').forEach((el) => {
    el.addEventListener('mouseenter', (event) => {
      clearTimeout(timer)

      if (!isTooltipShow) {
        const pageX = (event as MouseEvent).pageX
        const pageY = (event as MouseEvent).pageY
        tooltipEl.style.transform = `translate(${pageX}px, ${pageY}px)`
        const href = el.querySelector('a')?.getAttribute('href')
        const tid = href?.match(/\d+/g)![0]
        showTooltip()
        if (tid)
          getContent(tid)
      }
    })

    el.addEventListener('mouseleave', () => {
      hideTooltip()
    })
  })
  createTooltip()
}

main()
