// This is referenced from https://github.com/lencx/ChatGPT/blob/main/scripts/cmd.js

export default function cmdInit(){
    const styleDom = document.createElement('style');
    styleDom.innerHTML = `
    .chat-prompt-cmd-list {
        position: absolute;
        bottom: 60px;
        max-height: 100px;
        overflow: auto;
        z-index: 9999;
    }
    .chat-prompt-cmd-list>div {
    border: solid 2px rgba(80,80,80,.3);
    border-radius: 5px;
    background-color: #fff;
    }
    .chat-prompt-cmd-list .cmd-item {
    font-size: 12px;
    border-bottom: solid 1px rgba(80,80,80,.2);
    padding: 2px 4px;
    display: flex;
    user-select: none;
    cursor: pointer;
    }
    .chat-prompt-cmd-list .cmd-item:last-child {
        border-bottom: none;
    }
    .chat-prompt-cmd-list .cmd-item.selected {
        background: rgba(59,130,246,.3);
    }
    .chat-prompt-cmd-list .cmd-item b {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 4px;
        margin-right: 10px;
        color: #2a2a2a;
    }
    .chat-prompt-cmd-list .cmd-item i {
        width: 100%;
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        color: #888;
    }
    `
    document.head.append(styleDom);

    console.log('prepare execute code');
    let fieldset = document.getElementsByTagName('fieldset')[0];
    // 创建一个dev，输入123
    let dev = document.createElement('input');
    dev.setAttribute('id', 'dev');
    dev.setAttribute('type', 'text');
    dev.setAttribute('value', '123');
    fieldset.appendChild(dev);
}