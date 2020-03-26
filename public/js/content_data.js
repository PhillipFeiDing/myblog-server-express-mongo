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

// 发送 post 请求
function post(url, data = {}) {
    return $.ajax({
        type: 'post',
        url,
        data: JSON.stringify(data),
        contentType: "application/json",
    })
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
const $commentContainer = $('#comment-list')

get(url).then(res => {
    if (res.errno !== 0) {
        alert('获取博客内容数据错误')
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
            alert('获取菜单数据错误')
            return
        }
        const data = res.data || []
        data.forEach(item => {
            $menuContainer.append($(`
                <li><a href="${item.link}"><span style="opacity: 1; transform: translateX(-10px);">${item.itemname}</span></a></li>
            `))
        })
    })
}).then(() => {
    reloadCommentList()
})

const client_id = '9f872687649b6af95b8d'
const authorize_uri = 'https://www.github.com/login/oauth/authorize'
const redirect_uri = 'http://localhost:8000/api/blog/oauth/redirect'
const loginURL = `${authorize_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}`
$('#gitment-avatar').attr('href', loginURL)
$('.gitment-editor-login-link').attr('href', loginURL)
let targetLocation = window.location.href
if (!targetLocation.includes('#avatar')) {
    targetLocation += '#avatar'
}
$.cookie('oauthRedirectURL', targetLocation, { expires: 7, path: '/' })

function isGithubLoggedIn() {
    const githubUsername = $.cookie('githubUsername')
    const githubUserURL = $.cookie('githubUserURL')
    const githubAvatarURL = $.cookie('githubAvatarURL')
    if (githubUsername && githubUserURL && githubAvatarURL) {
        $('#github-avatar-img').attr('src', githubAvatarURL)
        $('#gitment-avatar').attr({
            'href': githubUserURL,
            'target': '_blank'
        })
        $('#comment-input').prop('disabled', false)
        $('#login').html(`Hi, <strong>${$.cookie('githubUsername')}</strong>.`)
    }
}
isGithubLoggedIn()

$('#preview').on('click', () => {
    const converter = new showdown.Converter()
    $('.gitment-editor-write-field').addClass('gitment-hidden')
    $('#editComment').removeClass('gitment-selected')
    $('#preview').addClass('gitment-selected')
    const toConvert = $('#comment-input').val()
    if (toConvert === '') {
        $('#preview-content').html('(No Content to Preview)')
    } else {
        $('#preview-content').html(converter.makeHtml(toConvert))
    }
    $('.gitment-editor-preview-field').removeClass('gitment-hidden')
})

$('#editComment').on('click', () => {
    $('.gitment-editor-write-field').removeClass('gitment-hidden')
    $('#editComment').addClass('gitment-selected')
    $('#preview').removeClass('gitment-selected')
    $('.gitment-editor-preview-field').addClass('gitment-hidden')
})

$('#comment-input').on('input', () => {
    if ($('#comment-input').val() !== '') {
        $('.gitment-editor-submit').prop('disabled', false)
    } else {
        $('.gitment-editor-submit').prop('disabled', true)
    }
})

$('.gitment-editor-submit').on('click', () => {
    const data = {
        blogid: urlParams.id,
        comment: $('#comment-input').val(),
        commenttime: Date.now()
    }
    post('/api/blog/make-comment', data).then((res) => {
        if (res.errno !== 0) {
            alert('评论失败，可能未登录')
            return
        }
        $('#comment-input').val('')
        reloadCommentList()
    })
})

function reloadCommentList() {
    const url = '/api/blog/get-comment?blogid=' + urlParams.id
    get(url).then(res => {
        if (res.errno !== 0) {
            alert('获取评论数据错误')
            return
        }
        const data = res.data || []
        const converter = new showdown.Converter()
        $('#comments-num').text(data.count)
        $commentContainer.html('')
        data.comments.forEach(item => {
            $commentContainer.append($(`
            <li class="gitment-comment">
                    <a class="gitment-comment-avatar" href="${item.userurl}" target="_blank">
                        <img class="gitment-comment-avatar-img" src="${item.avatarurl}">
                    </a>
                    <div class="gitment-comment-main">
                        <div class="gitment-comment-header">
                            <a class="gitment-comment-name" href="${item.userurl}" target="_blank">${item.username}</a> Commented on <span>${getFormatDate(item.commenttime)}</span>
                            <!--<div style="float:right;cursor:pointer" id="584984197"><img src="images/heart.svg" style="height:20px;float:left">0</div>-->
                        </div>
                        <div class="gitment-comment-body gitment-markdown">
                            <p>${converter.makeHtml(item.comment)}</p>
                        </div>
                    </div>
                </li>
            `))
        })
    })
}