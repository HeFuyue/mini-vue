import {parseHTML} from './parse.js'

export function compileToFunction(template) {
    // parseHTML方法用来将HTML文本转换成AST语法树
    let ast = parseHTML(template)
    let astCode = codeGenerator(ast)
    console.log(astCode)
    astCode = `with(this){return ${astCode}}`
    return new Function(astCode)
}

// attrsGenerator()函数用来生成标签属性的字符串函数
function attrsGenerator(attrs) {
    const bindRE = /^:|^v-bind:/
    const onRE = /^@|^v-on:/
    let directives = {}
    let attrString = '{'
    for (let i = 0; i < attrs.length; i++) {
        let attrValue = attrs[i].value
        if (attrs[i].name === 'v-if') {
            directives['v-if'] = attrValue
        } if (attrs[i].name === 'style') {
            let styleAttrValue = ''
            attrs[i].value.split(';').forEach(item => {
                const [name, value] = item.split(':')
                let styleString = `"${name.trim()}": "${value.trim()}", `
                styleAttrValue += styleString
            })
            attrValue = `{${styleAttrValue.slice(0, styleAttrValue.length - 2)}}`
            attrString += `${attrs[i].name}: ${attrValue}, `
        } else if (bindRE.test(attrs[i].name)) {
            attrString += `"${attrs[i].name.replace(bindRE, '')}": ${attrValue}, `
        } else if (onRE.test(attrs[i].name)) {
            if (/=>/.test(attrValue)) {
                attrString += `on: {"${attrs[i].name.replace(onRE, '')}": function($event){return (${attrValue}).apply(null, arguments)}}, `
            } else if (/\(/.test(attrValue)) {
                attrString += `on: {"${attrs[i].name.replace(onRE, '')}": function($event){return ${attrValue}}}, `
            } else if (/\.prevent/.test(attrValue)) {
                attrString += `on: {"${attrs[i].name.replace(onRE, '').replace(/\.prevent/, '')}": function($event){$event.preventDefault();return ${attrValue}}}, `
            } else if (/\.stop/.test(attrValue)) {
                attrString += `on: {"${attrs[i].name.replace(onRE, '').replace(/\.stop/, '')}": function($event){$event.stopPropagation();return ${attrValue}}}, `
            } else if (/\.native/.test(attrValue)) {
                attrString += `nativeOn: {"${attrs[i].name.replace(onRE, '').replace(/\.native/, '')}": function($event){return ${attrValue}}}, `
            } else if (/\.enter/.test(attrValue)) {
                attrString += `on: {"${attrs[i].name.replace(onRE, '').replace(/\.enter/, '')}": function($event) {if ($event.type.indexOf('key') !== 13) return null;return (${attrValue}).apply(null, arguments)}}, `
            } else {
                attrString += `on: {"${attrs[i].name.replace(onRE, '')}": ${attrValue}}, `
            }
        } else if (attrs[i].name === 'v-show') {
            attrString += `directives: [{name: "show", rawName: "v-show", value: (${attrValue}), expression: "${attrValue}"}], `
        } else if (attrs[i].name === 'v-slot') {
            attrString += `slot: '${attrValue}', `
        } else {
            attrValue = `"${attrValue}"`
            attrString += `${attrs[i].name}: ${attrValue}, `
        }
        // attrString += `${attrs[i].name}: ${attrValue}, `
    }
    return attrString.slice(0, attrString.length - 2) + '}'
}

function codeGenerator(ast) {
    const attrs = ast.attrs
    let hasDirective = false
    if (ast.attrs) {
        for (let i = 0; i < attrs.length; i++) {
            let attrValue = attrs[i].value
            // console.log(attrs[i].name, /v-/.test(attrs[i].name) && ['v-on', 'v-bind', 'v-slot', 'v-show'].every(attr => attrs[i].name.indexOf(attr) < 0))
            if (attrs[i].name === 'v-if') {
                hasDirective = true
                attrs.splice(i, 1)
                return `(${attrValue}) ? _c('${ast.tag}', ${attrs.length ? attrsGenerator(attrs) : null}${ast.children ? `, ${childrenGenerator(ast.children)}` : ''}) : _e()`
            } else if (attrs[i].name === 'v-for') {
                let iterable, iterator
                hasDirective = true
                attrs.splice(i, 1)
                if (/\sin\s/.test(attrValue)) {
                    [iterator, iterable] = attrValue.split(' in ')
                } else if (/\sof\s/.test(attrValue)) {
                    [iterator, iterable] = attrValue.split(' of ')
                }
                return `_l((${iterable}), function${iterator}{return _c('${ast.tag}', ${attrs.length ? attrsGenerator(attrs) : null}${ast.children ? `, ${childrenGenerator(ast.children)}` : ''})})`
            } else if (attrs[i].name === 'v-model') {
                if (ast.tag === 'input') {
                    let type = attrs.filter(attr => attr.name === 'type')[0].value || 'text'
                    if (type === 'text') {
                        return `_c('input', {directives: [{name: "model", rawName: "v-model", value: (${attrValue}), expression: "${attrValue}"}], attrs: {type: 'text'}, on:{"input":function($event){${attrValue} = $event.target.value}}})`
                    } else if (type === 'checkbox') {
                        return `_c('input', {directives: [{name: "model", rawName: "v-model", value: (${attrValue}), expression: "${attrValue}"}], attrs: {type: 'checkbox'}, on: {"change": function ($event) {var $$a = ${attrValue},$$el = $event.target,$$c = $$el.checked ? (true) : (false);if (Array.isArray($$a)) {var $$v = null,$$i = _i($$a, $$v);if ($$el.checked) {$$i < 0 && (${attrValue} = $$a.concat([$$v]))} else {$$i > -1 && (${attrValue} = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))}} else {${attrValue} = $$c}}}})`
                    }
                } else {
                    return `_c('${ast.tag}', {model: { value: (${attrValue}), callback: function ($$v) {${attrValue} = $$v},expression: "${attrValue}"}})`
                }
            } else if (/v-/.test(attrs[i].name) && ['v-on', 'v-bind', 'v-slot', 'v-show'].every(attr => attrs[i].name.indexOf(attr) < 0)) {
                const [name, arg] = attrs[i].name.split(':')
                return `_c('${ast.tag}', {directives: [{name: "${name.replace('v-', '')}",rawName: "${attrs[i].name}",value: (${attrValue}),expression: "${attrValue}"${arg ? `,arg: "${arg}"` : ""}}]})`
            } else if (attrs[i].name === 'slot-scope') {
                attrs.splice(i, 1)
                let slotName = 'default'
                for (let i = 0; i < attrs.length; i++) {
                    if (attrs[i].name === 'slot') {
                        slotName = attrs[i].value
                        attrs.splice(i, 1)
                        break
                    }
                }
                return `_c('${ast.tag}', {scopedSlots: _u([{key: "${slotName}", fn: function (${attrValue}) {return ${codeGenerator(ast)}}}])})`
            }
        }

        if (!hasDirective) {
            return `_c('${ast.tag}', ${attrs.length ? attrsGenerator(attrs) : null}${ast.children ? `, ${childrenGenerator(ast.children)}` : ''})`
        }
    } else {
        return `_c('${ast.tag}', ${ast.children ? `, ${childrenGenerator(ast.children)}` : ''})`
    }
    
}

// _c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello" + _s(hobbys))), _c('span', {on: {"click": function($event){return (() => cb(5)).apply(null, arguments)}}, ref: "age"}, _v(_s(age))), _c('mycomponent', {a: "1", b: "2", "c": age, on: {"myevent": cb}, ref: "mycomponent"}, ))
// _c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello" + _s(hobbys))), (age) ? _c('span', {on: {"click": function($event){return (() => cb(5)).apply(null, arguments)}}, ref: "age"}, _v(_s(age))) : _e(), _c('mycomponent', {a: "1", b: "2", "c": age, on: {"myevent": cb}, ref: "mycomponent"}, ))

// childrenGenerator()函数用来生成子标签的字符串函数
function childrenGenerator(children) {
    let childrenArr = []
    children.map(child => {
        childrenArr.push(genChild(child))
    })
    return `[${childrenArr.join(', ')}]`
    // return children.map(child => genChild(child)).join(', ')
}

function genChild(child) {
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // defaultTagRE正则用来匹配{{ 插值 }} 语法
    if (child.type === 1 && child.tag !== 'slot') {
        return codeGenerator(child) // 如果是普通节点, 直接调用codeGenerator()生成字符串函数
    } else if (child.tag === 'slot') {
        let name = 'default'
        let props = []
        child.attrs.forEach(attr => {
            if (attr.name === 'name') {
                name = attr.value
            } else if (/^:|^v-bind:/.test(attr.name)) {
                props.push(`"${attr.name.replace(/^:|^v-bind:/, '')}": ${attr.value}`)
            }
        })
        if (!props.length) {
            return `_t('${name}')`
        } else {
            return `_t('${name}', {${props.join(', ')}})`
        }
    } else { // 文本节点
        if (!defaultTagRE.test(child.text)) { // 没有匹配到插值语法, 直接将文本转化为 _v(文本)
            return `_v('${child.text}')`
        }

        defaultTagRE.lastIndex = 0 // 带有g的正则表达式, lastIndex属性需要置0
        let tokens = []
        let match
        let lastIndex = 0

        while (match = defaultTagRE.exec(child.text)) {
            let index = match.index // index等于当前匹配到插值的位置

            if (index > lastIndex) { // index大于上次匹配到插值的位置, 说明两个插值之间存在文本, 需要将这段文本插入到tokens里面
                tokens.push(`"${match.input.slice(lastIndex, index).trim()}"`)
            }
            tokens.push(`_s(${match[1]})`) // 将插值里面的内容包上_s(插值)插入到tokens

            lastIndex = defaultTagRE.lastIndex
            // console.log(match, index, lastIndex)
        }

        if (lastIndex < child.text.length) { // 最后一次匹配到插值的位置小于文本长度, 说明后面还有文本, 需要继续将文本插入tokens
            tokens.push(`"${child.text.slice(lastIndex, child.text.length)}"`)
        }
        // console.log(tokens)
        return `_v(${tokens.join(' + ')})`
    }
}

/* 
codeGenerator()方法用来将AST语法树转化为字符串函数：
例：
<div id="root">
    <div id = "app" style = "background-color: #ccc; color: red">
        {{name}} Hello {{name}} Hello
    </div>
    <span>{{age}}</span>
</div>
上述DOM的AST转化为：
_c('div', {id: "root"}, _c('div', {id: "app", style: {"background-color": "#ccc", "color": "red"}}, _v(_s(name) + "Hello" + _s(name) + "Hello")), _c('span', null, _v(_s(age))))
 */

/* function codeGenerator(ast) {
    return (
        `_c('${ast.tag}', ${ast.attrs.length ? attrsGenerator(ast.attrs) : null}${ast.children ? `, ${childrenGenerator(ast.children)}` : ''})`
    )
} */
