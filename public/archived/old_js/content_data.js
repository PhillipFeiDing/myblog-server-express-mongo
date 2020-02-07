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
})

// 返回按钮
function goTop(min_height) {
    $(".Totop").click(
        function() {
            $('html,body').animate({
                scrollTop: 0
            }, 700);
        });
    //获取页面的最小高度，无传入值则默认为600像素
    min_height=min_height?min_height:400;
    //为窗口的scroll事件绑定处理函数
    $(window).scroll(function() {
        //获取窗口的滚动条的垂直位置
        var s = $(window).scrollTop();
        //当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
        if (s > min_height) {
            $(".Totop").fadeIn(100);
        } else {
            $(".Totop").fadeOut(200);
        }
    });
}
$(function() {
    goTop();
});

// 微信扫码
$('#icon_Wechat').mouseenter(() => {
    $('#Wechat_Qr').css('transform', 'translateY(0px)')
    $('#Wechat_Qr').css('z-index', '99')
    $('#Wechat_Qr').css('opacity', '1')
})
$('#icon_Wechat').mouseleave(() => {
    $('#Wechat_Qr').css('transform', 'translateY(-20px)')
    $('#Wechat_Qr').css('z-index', '-1')
    $('#Wechat_Qr').css('opacity', '0')
})