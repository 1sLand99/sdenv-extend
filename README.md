[![NPM version](https://badge.fury.io/js/sdenv-extend.svg)](http://badge.fury.io/js/sdenv-extend)

用于sdenv补环境框架与真实浏览器加载网页的公共方法与共有处理.

## node端

1. 安装包：`npm install sdenv-extend`
2. 导入：`const SdenvExtend = require('sdenv-extend')`
3. 初始化(需要传入window对象)：`new SdenvExtend(cfg, window)`
4. 需要注意在调试开发的时候为了保证浏览器端与node端运行一致，一般会将添加拓展放在html页面的script标签内执行，而此时应该使用node端的sdenv而不是浏览器端的sdenv，因此在初始化的时候需要将node端的包进行缓存即：`new SdenvExtend({ memory: { SdenvExtend } }, window);`
5. 初始化完成后在node端既可以通过`require('sdenv-extend').sdenv()`取到唯一的sdenv对象，然后就可以使用该对象下面的tools和utils内的方法了

## 浏览器端

打包文件下载：`https://github.com/pysunday/sdenv-extend/releases`，文件名为sdenv-extend-iife的js文件即为浏览器端使用文件。

1. head内引入：`<script type="text/javascript" charset="utf-8" src="/path/to/sdenv-extend-iife.js"></script>`
2. 初始化：`new SdenvExtend(cfg)`，初始化后会存在方法`Object.sdenv`用于获取sdenv对象
3. html页面中使用：
```javascript
const SdenvExtend = Object.sdenv().memory.SdenvExtend || SdenvExtend;
const sdenv = new SdenvExtend();
```
4. 使用extend handle拓展方法，应该在网页第一处javascript执行前后添加，即执行html中javascript代码前的最后一处node执行处或者就在该javascript代码内，建议是在html中的第一处javascript代码内使用，如：
```javascript
const SdenvExtend = Object.sdenv().memory.SdenvExtend || SdenvExtend;
new SdenvExtend()
  .getHandle('battery')('charging_success')
  .getHandle('eval')()
  ...
  .getHandle('func')();
```

## API

### extend handle拓展方法

在SdenvExtend实例化对象后通过链式方法getHandle添加，见上方浏览器端第四条

#### `.getHandle('battery')(string | object)`

作用: 定义机器电量及充电状态，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)

params:
  * string(预存配置)：charging_success(正在充电，电量100%，该项默认)、discharging_success(未充电，电量100%)、charging_ing(正在充电)、discharging_ing(未充电)
  * object(自定义配置)：如预存配置不满足使用需求则可传入自定义对象，参考浏览器端`navigator.getBattery().then(data => console.log(data))`打印结果

默认值：

```json
{
  onchargingchange: null,
  onchargingtimechange: null,
  ondischargingtimechange: null,
  onlevelchange: null,
  charging: true,
  chargingTime: 0,
  dischargingTime: Infinity,
  level: 1,
}
```

#### `.getHandle('connection')(object)`

作用：定义网络环境，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection)

params:
  * object：参考浏览器端`navigator.connection`返回结果

默认值：

```json
{
  downlink: 6.66,
  effectiveType: "4g",
  onchange: null,
  rtt: 0,
  saveData: false,
}
```

#### `.getHandle('cookie')(object)`

作用：cookie值监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)

params:
  * object: 包含日志打印、回调、数据处理的钩子对象，可用属性(参考附录一)：getLog、setLog、log、getCb、setCb、cb、parse

#### `.getHandle('eval')(object)`

作用：eval方法调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

该拓展应用后会将代码字符串中的debugger去除，如果我们自己想要断点可以使用sdDebugger代替

params:
  * object: 包含日志打印、回调钩子对象，可用属性(参考附录一)：log、cb

eval执行固定值映射：
  * `!new function(){eval("this.a=1")}().a` -> false

#### `.getHandle('func')(object)`

作用：Function方法调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

该拓展应用后会将代码字符串中的debugger去除，如果我们自己想要断点可以使用sdDebugger代替

params:
  * object: 包含日志打印、回调钩子对象，可用属性(参考附录一)：log、cb

#### `.getHandle('event')(object)`

作用：`addEventListener`方法的调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

params:
  * object: 包含日志打印、回调、事件过滤的钩子对象，可用属性(参考附录一)：addLog、runLog、log、addCb、runCb、cb、filter

#### `.getHandle('ovserver')(object)`

作用：`MutationObserver`方法的调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

params:
  * object: 包含日志打印、回调、事件过滤的钩子对象，可用属性(参考附录一)：newLog、addLog、runLog、log、newCb、addCb、runCb、cb、filter

#### `.getHandle('timeout')(object)`

作用：`setTimeout`方法的调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)

params:
  * object: 包含日志打印、回调钩子对象，可用属性(参考附录一)：log、cb、filter，除了附录一中记录的这三个属性还有一个特殊的time属性，当time属性不传则使用sdenv-extend内部封装的定时器，当time值为数字则使用自带定时器，且time的优先级大于调用时传入的time值

#### `.getHandle('interval')(object)`

作用：`setInterval`方法的调用监控封装，[跳转MDN文档](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)

params:
  * object: 包含日志打印、回调钩子对象，可用属性(参考附录一)：log、cb、filter，除了附录一中记录的这三个属性还有一个特殊的time属性，当time属性不传则使用sdenv-extend内部封装的定时器，当time值为数字则使用自带定时器，且time的优先级大于调用时传入的time值

#### `.getHandle('dateAndRandom')(object)`

作用：用于获取运行时时间值记录及固定时间值与随机数

params:
  * object -> datas(object)：指定上下文获取的运行时日期数据
  * object -> randomReturn(number)：Math.random方法返回的数值

其中datas的值为指定上下文运行时的产物，可以在浏览器端运行时在断点的位置执行`Object.sdenv().utils.getDateData(copy)`获取

### tools工具方法

待补充...

## 附录1: extend handle入参对象配置列表

属性名 | 类型 | 作用 | 默认值
------ | ---- | ---- | ------
getLog | boolean | 开启get日志 | -
setLog | boolean | 开启set日志 | -
addLog | boolean | 开启方法调用日志 | -
runLog | boolean | 开启回调运行日志 | -
newLog | boolean | 开启实例化过程日志 | -
log | boolean | 同时开启get和set日志 | -
getCb | function | get的回调 | -
setCb | function | set的回调 | -
addCb | function | 方法调用的回调 | -
runCb | function | 回调运行的回调 | -
newCb | function | 实例化过程的回调 | -
cb | function | 同时设置get和set回调，回调里设置断点更友好 | -
parse | function | set最终值时执行 | `(val) => val`
filter | function | 返回false则抛弃该项代码运行 | `(...params) => true`
