// 无后台请求部分
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

// 搜索框
var searchOn = false
function openSearch() {
    $('.search-input').css('z-index', 99)
    $('.search-input').css('width', '300px')
    searchOn = true
    $('.search-input')[0].focus()
}
function closeSearch() {
    $('.search-input').css('width', '42px')
    $('.search-input').css('z-index', -1)
    $('.search-input').val('')
    searchOn = false
}
$('.search').on('click', () => {
    openSearch()
})
$('.search-input').mouseleave(() => {
    closeSearch()
})
$(document).keyup(function(event){
    const searchWord = $('.search-input').val()
    if(event.keyCode ==13 && searchOn && searchWord !== ''){
        location.href = '/index.html?keyword=' + searchWord
    }
});

// 目录栏
const transformSelectors = [
    '.navi-button',
    '.search-input',
    '.search',
    '.main',
    '.Totop'
]
const menuWidth = 150
function openMenu() {
    transformSelectors.forEach((item) => {
        $(item).css('transform', `translateX(-${menuWidth}px)`)
    })
    $('.main-navication').css('opacity', '1')
}
function closeMenu() {
    transformSelectors.forEach((item) => {
        $(item).css('transform', `translateX(0px)`)
    })
    $('.main-navication').css('opacity', '0')
}
$('.navi-button').on('click', () => {
    openMenu()
})
$('.main-navication').mouseleave(() => {
    closeMenu()
})

// 微信扫码
function openBarCode() {
    $('#Wechat_Qr').css('transform', 'translateY(0px)')
    $('#Wechat_Qr').css('z-index', '99')
    $('#Wechat_Qr').css('opacity', '1')
}
function closeBarCode() {
    $('#Wechat_Qr').css('transform', 'translateY(-20px)')
    $('#Wechat_Qr').css('z-index', '-1')
    $('#Wechat_Qr').css('opacity', '0')
}
$('#icon_Wechat').mouseenter(() => {
    openBarCode()
})
// $('#icon_Wechat').on('click', () => {
//     openBarCode()
// })
$('#icon_Wechat').mouseleave(() => {
    closeBarCode()
})

// 关闭控件
$('.main').on('click', () => {
    closeSearch()
    closeMenu()
    // closeBarCode()
})