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

// 判断语言
function isEnglish(str) {
    if (escape(str).indexOf("%u")<0) { 
        return true
    } else {
        return false
    }
}

// 点亮标签
function lightLabel(selector) {
    $(selector).css('color', '#2c3e50')
    $(selector).css('background-color', '#ecf0f1')
}

// 获取 dom 元素
const $tagContainer = $('#tags')
const $cnTagContainer = $('#tags-cn')
const $container = $('#issue-list')
const $currentTagContainer = $('#tag-display-container')
const $pagesContainer = $('#pages')
const $menuContainer = $('#menu')

// 后台请求部分
// 获取 tag list
const tagListUrl = '/api/tag/taglist'
get(tagListUrl).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    const data = res.data || []
    let tagReference = {}
    data.forEach(item => {
        const toAppend = `
            <a href="?tag=${item.id}" id="tag_${item.id}">${item.tagname}</a>
        `
        if (isEnglish(item.tagname)) {
            $tagContainer.append($(toAppend))
        } else {
            $cnTagContainer.append($(toAppend))
        }
        tagReference[item.id] = item.tagname
    })
    return tagReference
}).then((tagReference) => {
    // 拼接接口 url
    let url = '/api/blog/list?'
    let hasQuery = false
    const urlParams = getUrlParams()
    if (urlParams.author) {
        url += 'author=' + urlParams.author
        hasQuery = true
    }
    if (urlParams.tag) {
        if (hasQuery) {
            url += '&'
        }
        url += 'tag=' + urlParams.tag
        hasQuery = true
        $currentTagContainer.html('<h1>' + tagReference[parseInt(urlParams.tag)] + '</h1>')
        lightLabel('#tag_' + urlParams.tag)
    } else {
        lightLabel('#all-tag')
    }
    if (urlParams.keyword) {
        if (hasQuery) {
            url += '&'
        }
        url += 'keyword=' + urlParams.keyword
        hasQuery = true
    }
    // 先检查是否有url参数或者page，有则需要滑动页面，否则显示顶端
    if (hasQuery || urlParams.page) {
        $('.container')[0].scrollIntoView()
    }

    // 强制添加上page参数，否则后台会返回所有
    if (hasQuery) {
        url += '&'
    }
    const pageNum = urlParams.page || '1'
    url += 'page=' + pageNum
    hasQuery = true

    // 加载数据
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }

        // 移除加载提示
        $container.html('')
        // 遍历博客列表，并显示
        const data = res.data || []
        const resultsFound = data.length
        data.forEach(item => {
            let tagList = item.tags
            if (tagList === '') {
                tagList = '[]'
            }
            let tagListHtml = ''
            JSON.parse(tagList).forEach(tagId => {
                if (tagReference[tagId]) {
                    tagListHtml += `
                        <li>
                            <a href="?tag=${tagId}">
                                ${tagReference[tagId]}
                            </a>
                        </li>
                    `
                }
            })
            tagListHtml = `
                <ul class="meta">
                    <li>
                        ${item.author}
                    </li>
            `
            + tagListHtml
            + `
                </ul>
            `
            $container.append($(`
                <li class="blog-exerpt-container" blog-id="${item.id}">
                    <p class="date">
                        ${getFormatDate(item.createtime)}
                    </p>
                    <h4 class="title">
                        <a href="/content.html?id=${item.id}">
                            ${item.title}
                        </a>
                    </h4>
                    <div class="excerpt">
                        <p id="blog-p-${item.id}" class="issue" style="float: left;">
                            ${item.exerpt} ${six_hundred_spaces}
                        </p>
                        <did id="blog-div-${item.id}" class="blog-image-container"style="float: left; width: 0px;">
                            <img id="blog-image-${item.id}" src="${item.imageurl}" style="padding-left: 10px; height: 0; width: 0;">
                        </div>
                        <div style="clear: both"></div>
                    </div>
                    ${tagListHtml}
                </li>
            `))
        })
        $('.blog-exerpt-container').on('mouseenter', function() {
            const thisId = $(this).attr('blog-id')
            $(this).css('background', '#ecf0f1')
            const srcurl = $('#blog-image-' + thisId).attr('src')
            if (srcurl != '') {
                $('#blog-p-' + thisId).css('width', '70%')
                const height = $('#blog-p-' + thisId).css('height')
                $('#blog-image-' + thisId).css('display', '')
                $('#blog-image-' + thisId).css('height', height)
                $('#blog-image-' + thisId).css('width', '100%')
                $('#blog-div-' + thisId).css('width', '30%')
            }
        })
        $('.blog-exerpt-container').on('mouseleave', function() {
            const thisId = $(this).attr('blog-id')
            $(this).css('background', '')
            $('#blog-p-' + thisId).css('width', '')
            $('#blog-image-' + thisId).css('height', 0)
            $('#blog-image-' + thisId).css('width', 0)
            $('#blog-image-' + thisId).css('display', 'none')
        })
        render_dot_lines()
        return resultsFound
    }).then(resultsFound => {
        let resultEng = ''
        if (resultsFound <= 0) {
            resultEng = 'Found no blog'
        } else if (resultsFound == 1) {
            resultEng = 'Showing 1 blog'
        } else {
            resultEng = `Showing ${resultsFound} blogs`
        }

        if (urlParams.author) {
            $currentTagContainer.html(`<h3>${resultEng} authored by <span style="font-style: italic; font-weight: normal;">${decodeURI(urlParams.author)}</span>.</h3>`)
        } else if(urlParams.keyword) {
            $currentTagContainer.html(`<h3>${resultEng} titled with "<span style="font-weight: normal;">${decodeURI(urlParams.keyword)}</span>".</h3>`)
        }
    })
    return pageNum
}).then(currPageNum => {
    // 拼接接口 url
    let url = '/api/blog/pagecount?'
    const urlParams = getUrlParams()
    let hasQuery = false
    queryStr = ''
    if (urlParams.author) {
        queryStr += 'author=' + urlParams.author
        hasQuery = true
    }
    if (urlParams.tag) {
        if (hasQuery) {
            queryStr += '&'
        }
        queryStr += 'tag=' + urlParams.tag
        hasQuery = true
    }
    if (urlParams.keyword) {
        if (hasQuery) {
            queryStr += '&'
        }
        queryStr += 'keyword=' + urlParams.keyword
        hasQuery = true
    }
    url = url + queryStr
    
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        const data = res.data || {}
        const pageCount = Math.max(1, data.pageCount)
        let pageNums = []
        for (var pageNum = 1; pageNum <= pageCount; pageNum++) {
            pageNums.push(pageNum)
        }
        function getCursorStyle(targetPage, thisPage) {
            if (parseInt(targetPage) === parseInt(thisPage)) {
                return 'cursor'
            } else {
                return 'pointer'
            }
        }
        function getPointerEvents(targetPage, thisPage) {
            if (parseInt(targetPage) === parseInt(thisPage)) {
                return 'none'
            } else {
                return 'auto'
            }
        }
        function getClassAttr(targetPage, thisPage) {
            if (parseInt(targetPage) === parseInt(thisPage)) {
                return 'class="active"'
            } else {
                return ''
            }
        }
        let url = '?' + queryStr
        if (queryStr != '') {
            url += '&'
        }
        url += 'page='
        $pagesContainer.append($(`
            <li id="prev_page_" style="pointer-events: ${getPointerEvents(1, currPageNum)};">
                <a id="last" style="cursor: ${getCursorStyle(1, currPageNum)};" href="${url + (parseInt(currPageNum) - 1)}">«</a>
            </li>
        `))
        pageNums.forEach(pageNum => {
            $pagesContainer.append($(`
            <li style="pointer-events: ${getPointerEvents(pageNum, currPageNum)};">
                <a id="page${pageNum}" style="cursor: ${getCursorStyle(pageNum, currPageNum)};" ${getClassAttr(pageNum, currPageNum)} href="${url + pageNum}">${pageNum}</a>
            </li>
        `))
        })
        $pagesContainer.append($(`
            <li id="next_page_" style="pointer-events: ${getPointerEvents(pageCount, currPageNum)};">
                <a id="next" style="cursor: ${getCursorStyle(pageCount, currPageNum)}" href="${url + (parseInt(currPageNum) + 1)}">»</a>
            </li>
        `))
    })
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

const six_hundred_spaces = '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; '
