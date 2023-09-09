const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

export function parseHTML(htmlText) {
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 利用栈生成AST语法树
    let currentNode // currentNode指针指向栈中的最后一个节点
    let root // AST语法树的根节点

    // createASTNode方法返回一个AST语法树节点
    function createASTNode(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            attrs,
            parent: null,
            children: []
        }
    }

    /* function createASTElement(ASTNode) {
        return {
            type: 1,
            tag: ASTNode.tag,
            attrsList: ASTNode.attrs,
            parent: ASTNode.parent,
            children: ASTNode.children
        }
    } */

    // advance方法用来对HTML的文本进行截取, 将解析后的标签去除
    function advance(n) {
        htmlText = htmlText.substring(n)
    }

    // start方法用来创建开始标签对应的AST语法树节点
    function start(tag, attrs) {
        const startNode = createASTNode(tag, attrs)
        if (tag !== 'input') stack.push(startNode) // 将当前节点推入栈

        // 如果指针非空, 则存在父节点
        if (currentNode) {
            startNode.parent = currentNode // 当前节点的parent指向父节点
            currentNode.children.push(startNode) // 在父节点的children属性中加入当前节点
            if (tag !== 'input') currentNode = startNode // 当前节点作为父节点
        }

        // 不存在父节点的情况, 即初次调用该方法
        if(!root) {
            root = startNode // 当前节点作为根节点
            currentNode = root // 当前节点作为父节点
        }
        /* startNode.el = createASTElement(startNode)
        console.log(startNode) */
    }

    // text方法用来创建文本对应的AST语法树节点
    function text(char) {
        char = char.replace(/\s/g, '') // 删去文本中的空格
        
        // 对父节点的children属性添加该文本
        currentNode.children.push({
            type: TEXT_TYPE,
            text: char,
            parent: currentNode
        })
    }

    // end方法用来处理结束标签
    function end(name) {
        stack.pop() // 遇到结束标签, 则该标签内容已解析完毕, 需要返回上一级父节点, 将当前节点出栈
        currentNode = currentNode.parent // 父节点指针指向当前节点的父节点
    }

    // parseStartTag方法用来读取开始标签的标签名, 标签属性
    function parseStartTag() {
        const tagStart = htmlText.match(startTagOpen) // 当前HTML文本是否匹配开始标签
        let tagAttrs, tagEnd

        if (tagStart) {
            // 将当前开始标签的标签名保存在match中
            const match = {
                tagName: tagStart[1],
                attrs: []
            }
            advance(tagStart[0].length) // 删去HTML文本中的当前开始标签的标签名

            // 没有匹配上结束标签且匹配上了标签属性, 开始解析标签属性
            while (!(tagEnd = htmlText.match(startTagClose)) && (tagAttrs = htmlText.match(attribute) || htmlText.match(dynamicArgAttribute))) {
                if (tagAttrs) {
                    match.attrs.push({name: tagAttrs[1], value: tagAttrs[3] || tagAttrs[4] || tagAttrs[5] || true}) // 若存在标签属性, 则将标签属性写入match中
                    advance(tagAttrs[0].length) // 删去HTML文本中的当前标签属性
                }
            }

            // 匹配上了结束标签
            if (tagEnd) {
                advance(tagEnd[0].length) // 删去HTML文本中的当前结束标签
            }
            // console.log(match)
            return match // 将解析完的开始标签对象match返回
        }

        // 未匹配上开始标签
        return false
    }

    // 该循环将HTML文本进行截取, 分解为开始标签, 标签体以及结束标签, 并调用相应的处理方法形成AST语法树
    while (htmlText) {
        // debugger
        htmlText = htmlText.trim() // 清除HTML文本中的所有开始结束位置的空格和换行符
        let textEnd = htmlText.indexOf('<')

        if (textEnd === 0) { // 当前HTML文本的开始是一个标签

            const startTagMatch = parseStartTag() // 匹配开始标签, 如果匹配到, 调用start方法去处理
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }

            const endTagMatch = htmlText.match(endTag) // 匹配结束标签, 如果匹配到, 调用end方法去处理
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }

        if (textEnd > 0) { // 当前HTML文本的开始不是标签, 应为标签体
            const char = htmlText.substring(0, textEnd) // 将不是标签的这段HTML截取出来

            if (char) { // 调用text方法处理标签体
                advance(textEnd)
                text(char)
                continue
            }
            break;
        }
    }
    return root
}
