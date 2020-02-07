// 反转义
function decode (str){  
    var temp = "";
    if(str.length == 0) return "";
    temp = str.replace(/&amp;/g,"&");
    temp = temp.replace(/&lt;/g,"<");
    temp = temp.replace(/&gt;/g,">");
    temp = temp.replace(/&nbsp;/g," ");
    temp = temp.replace(/&#39;/g,"\'");
    temp = temp.replace(/&quot;/g,"\"");
    return temp;  
}

// 发送 get 请求
function get(url) {
    return $.get(url)
}

// 显示格式化的时间
function getFormatDate(dt) {
    moment.locale('en')
    return moment(dt).format('LLLL')
}

// 获取 url 参数
function getUrlParams() {
    let paramStr = location.href.split('?')[1] || ''
    paramStr = paramStr.split('#')[0]
    const result = {}
    paramStr.split('&').forEach(itemStr => {
        const arr = itemStr.split('=')
        const key = arr[0]
        const val = arr[1]
        result[key] = val
    })
    return result
}

// 获取 dom 元素
const $title = $('#title')
const $instruction = $('#instruction')
const $content = $('#content')

// 获取数据
const urlParams = getUrlParams()
const url = '/api/blog/detail?id=' + urlParams.id
const $menuContainer = $('#menu')

get(url).then(res => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }

    // 显示数据
    const data = res.data || {}
    $title.text(decode(data.title))
    $content.html(decode(data.content))
    $instruction.html($(`
        <span>
            <a href="/index.html?author=${data.author}">${data.author}</a>
        </span>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <span>${getFormatDate(data.createtime)}</span>
    `))
}).then(() => {
    const url = '/api/menu/menulist'
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        const data = res.data || []
        data.forEach(item => {
            $menuContainer.append($(`
                <li><a href="${item.link}"><span style="opacity: 1; transform: translateX(-10px);">${item.itemname}</span></a></li>
            `))
        })
    })
})
