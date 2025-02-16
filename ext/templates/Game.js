const Template = require("./Template");

const html = `
<div id="main">
    <div id="waiting">
        <div class="header">
            <h1 id="please-wait"> Please wait... </h1>
            <div>ID: <span style="margin-left: 8px">{{gameId}}</span></div>
        </div>
        <p> 
            The game will start as soon as everyone's ready.
        <p>
        <div class="button">Ready</div>
        <p> 
        Editing as <b>{{name}}</b>. Not you? 
        <a id="sign-out">Sign out.</a> 
        </p>
    </div>
    <div id="game" class="invisible">
        <div class="header">
            <h1 id="time">15:00 remaining</h1>
            <div>ID: <span style="margin-left: 8px">{{gameId}}</span></div>
        </div>
        <p>Try to copy the site below <b>without</b> running your code.</p>
        <div id="assets">
            <h4 style="text-decoration: underline">Assets</h4>
            <p>Use these images in your site:</p>
            <ul>
                
            </ul>
        </div>
        <a href="#" id="img-link">
            <img src="https://i.redd.it/sv7mxplawwz31.png" id="thumb-inside" style="position: relative; display: flex; align-items: center; width: 100%"></img>
        </a>
        <p style="font-size: 0.9rem; margin-top: 1.5rem">Click on the image to open it in a browser window.</p>
    </div>
    </div>
    <div id="content"></div>
`
const css = `
    code {
        font-size: 1.2rem
    }
    .header {
        display: flex;
        flex-wrap: wrap;
    }
    .header > h1 {
        flex-grow: 1;
    }
    .header > div {
        align-self: center;
    }
    .body,
    html {
        background: black;
        color: white;
        font-family: 'Poppins', sans-serif;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        min-width: 100px;
    }

    #main {
        margin: 0.5rem;
        margin-left: 1.5rem;
        margin-right: 1.5rem;
    }

    a {
        color: inherit;
        text-decoration: underline;
        cursor: pointer;
    }
    li {
        overflow-wrap: anywhere;
    }
    .invisible {
        display: none;
    }

    .button {
        background: #49b738;
        text-align: center;
        margin-top: 6px;
        cursor: pointer;
        padding: 1rem;
        margin-bottom: 4px;
        width: 200px
    }

    .button-red {
        background: #dc004e;
    }

    #content {
        /* reset body styles */
        background: white;
        color: black;
        font-family: serif;
        margin: 0;
        padding: 0;
        margin-bottom: 2rem;
    }
`
const js = `
let isReady = false
const rdyButton = document.querySelector('.button')
const content = document.querySelector('#content')
const width = document.querySelector('#body').offsetWidth

document.getElementById('sign-out').addEventListener('click', () => vscode.postMessage({type: 'sign-out'}))

rdyButton.addEventListener('click', async () => {
    if(!isReady) { // Send ready signal
        vscode.postMessage({type: 'ready'})
        rdyButton.classList.add('button-red')
        rdyButton.innerText = 'Unready'
    } else { // Send unready signal
        vscode.postMessage({type: 'unready'})
        rdyButton.classList.remove('button-red')
        rdyButton.innerText = 'Ready'
    }
    isReady = !isReady
})

window.addEventListener('message', ({data}) => {
    const m = data
    if(m.type === 'time') {
        updateTimer(m.time)
    }
})

window.addEventListener('message', ({data}) => {
    const m = data
    if(m.type === 'content') {
        const assets = m.assets
        const url = m.url
        const image = url + '/' + m.image
        if(assets.length <= 0) {
            document.getElementById('assets').classList.add('invisible')
        } else {
            document.getElementById('assets').classList.remove('invisible')
            const ul = document.querySelector('ul')
            ul.innerHTML = ''
            for(const a of assets) {
                const li = document.createElement('li')
                li.appendChild(document.createTextNode(a));
                ul.appendChild(li)
            }
        }

        const img = document.getElementById('thumb-inside')
        img.src = image
        document.querySelector('#img-link').href = image
    }
})

function updateTimer(time) {
    // Send reminders
    const reminderTimes = [10, 30, 60, 120, 5 * 60, 10 * 60]
    if(reminderTimes.includes(time))
        vscode.postMessage({
            type: 'time-reminder',
            time
        })

    // Update HTML
    const s = time%60
    const m = Math.floor(time/60)
    let t = m+":"
    if(s===0) t += '00'
    else if(s<10) t+='0'+s
    else t+=s
    document.getElementById('time').innerText = t + ' remaining'

    document.querySelector('#game').classList.remove('invisible')
    document.querySelector('#waiting').classList.add('invisible')
}
`

const Game = new Template(html, css, js)

module.exports = Game